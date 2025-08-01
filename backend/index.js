const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const cloudinary = require('cloudinary').v2; // ADD THIS

// Use process.env.PORT for dynamic port assignment by hosting providers like Render
const port = process.env.PORT || 4000;

app.use(express.json());

// Ensure CORS allows requests from your deployed frontend and admin sites
app.use(cors({
    origin: [
        'https://mern-e-commerce-frontend-0xif.onrender.com', 
        'https://mern-e-commerce-admin-0lf5.onrender.com',   
        'http://localhost:3000', 
        'http://localhost:5173', 
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'auth-token'],
}));

// Configure Cloudinary with environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Database Connection - USE ENVIRONMENT VARIABLE
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// API
app.get("/", (req, res) => {
  res.send("Express App is Running");
});

// Image Storage Engine (using multer memory storage for Cloudinary)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
});

// Creating Upload Endpoint for images using Cloudinary
app.post("/upload", upload.single('product'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: 0, message: "No file uploaded" });
        }
        // Upload image to Cloudinary from memory buffer
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const result = await cloudinary.uploader.upload(dataURI);

        res.json({
            success: 1,
            image_url: result.secure_url // Cloudinary provides a permanent, secure URL
        });
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        res.status(500).json({ success: 0, message: "Cloudinary upload failed" });
    }
});
// Remove the express.static line as images are now served from Cloudinary
// app.use('/images', express.static('upload/images')); 

// Schema for creating products
const Product=mongoose.model("Product",{
  id:{
    type:Number,
    required:true,
  },
  name:{
    type:String,
    required:true,
  },
  image:{
    type:String,
    required:true,
  },
  category:{
    type:String,
    required:true,
  },
  new_price:{
    type:Number,
    required:true,
  },
  old_price:{
    type:Number,
    required:true,
  },
  date:{
    type:Date,
    default:Date.now,
  },
  available:{
    type:Boolean,
    default:true,
  },
})

app.post('/addproduct',async (req,res)=>{
  let products = await Product.find({});
  let id;
  if(products.length > 0){
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id=last_product.id + 1;
  }
  else{
    id=1;
  }

  const product = new Product({
    id:req.body.id || id, 
    name:req.body.name,
    image:req.body.image,
    category:req.body.category,
    new_price:req.body.new_price,
    old_price:req.body.old_price,
  });
  console.log(product);
  await product.save();
  console.log("Saved");
  res.json({
    success:true,
    name:req.body.name,
  })
})

// Creating API for deleting products
app.post('/removeproduct',async(req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
      success:true,
      name:req.body.name
    })
})

// Creating API for getting all products
app.get('/allproducts',async(req,res)=>{
  let products=await Product.find({});
  console.log("All Products Fetched");
  res.send(products);
})

//Schema creating for user model
const Users=mongoose.model('Users',{
  name:{
    type:String,
  },
  email:{
    type:String,
    unique:true,
  },
  password:{
    type:String,
  },
  cartData:{
    type:Object,
  },
  date:{
    type:Date,
    default:Date.now,
  }
})

// Creating Endpoint for registering the user
app.post('/signup',async(req,res)=>{
  let check=await Users.findOne({email:req.body.email});
  if(check){
    return res.status(400).json({success:false,errors:"existing user found with same email address"})
  }
  let cart={};
  for(let i=0;i<300;i++){
    cart[i]=0;
  }
  const user=new Users({
    name:req.body.username,
    email:req.body.email,
    password:req.body.password,
    cartData:cart,
  })

  await user.save();

  const data = {
    user:{
      id:user.id
    }
  }
  // Use environment variable for JWT secret (set this in Render Dashboard)
  const token = jwt.sign(data, process.env.JWT_SECRET); 
  res.json({success:true,token})
})

app.post('/login', async (req, res) => {
  const user = await Users.findOne({ email: req.body.email });

  if (!user) {
    return res.status(200).json({ success: false, errors: "Wrong Email Id" });
  }

  const passCompare = req.body.password === user.password;

  if (!passCompare) {
    return res.status(200).json({ success: false, errors: "Wrong Password" });
  }

  const data = {
    user: {
      id: user.id
    }
  };
  // Use environment variable for JWT secret (set this in Render Dashboard)
  const token = jwt.sign(data, process.env.JWT_SECRET);
  return res.status(200).json({ success: true, token });
});

// creating endpoint for newcollection data
app.get('/newCollections',async(req,res)=>{
  let products = await Product.find({});
  let newcollection = products.slice(1).slice(-8); 
  console.log("NewCollection Fetched");
  res.send(newcollection);
})

//creating endpoint for popular in women section
app.get('/popularinwomen',async(req,res)=>{
  let products = await Product.find({category:"women"});
  let popular_in_women = products.slice(0,4);
  console.log("Popular in women Fetched");
  res.send(popular_in_women);
})

//creating middleware to fetch user
const fetchUser = async(req, res, next) => {
  const token = req.header('auth-token');
  if (!token) {
    res.status(401).send({ errors: "Please authenticate using valid token" })
  } else {
    try {
      // Use environment variable for JWT secret (set this in Render Dashboard)
      const data = jwt.verify(token, process.env.JWT_SECRET);
      req.user = data.user;
      next(); 
    } catch (error) {
      res.status(401).send({ errors: "Please authenticate using a valid token" })
    }
  }
};

//creating endpoint for adding products in cartdata
app.post('/addtocart',fetchUser,async (req,res)=>{
  console.log("Added",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] +=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Added")
})

//creating endpoint to remove product from cartitems
app.post('/removefromcart',fetchUser,async (req,res)=>{
  console.log("removed",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId] > 0)
    userData.cartData[req.body.itemId] -=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Removed")
})

// creating endpoint to get cartidata
app.post('/getcart',fetchUser,async(req,res)=>{
  console.log("GetCart");
  let userData = await Users.findOne({_id:req.user.id});
  res.json(userData.cartData);
})

app.listen(port, (error) => {
  if (!error) {
    console.log("Server Running on Port " + port);
  } else {
    console.log("Error: " + error);
  }
});