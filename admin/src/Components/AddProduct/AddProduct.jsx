import React, { useState } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';

// Define your backend URL as a constant
const BACKEND_URL = 'https://mern-e-commerce-backend-9xbi.onrender.com';

const AddProduct = () => {
  const [image, setImage] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "women",
    new_price: "",
    old_price: ""
  });

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
    setProductDetails({ ...productDetails, image: e.target.files[0] });
  };

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const Add_Product = async () => {
    console.log(productDetails);
    let responseData;
    let product = { ...productDetails }; 

    let formData = new FormData();
    formData.append('product', image);

    try {
      // First, upload the image
      const uploadResponse = await fetch(`${BACKEND_URL}/upload`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      });

      responseData = await uploadResponse.json();

      if (responseData.success) {
        product.image = responseData.image_url;
        console.log(product);

        // Then, add the product with the received image URL
        const addProductResponse = await fetch(`${BACKEND_URL}/addproduct`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(product),
        });

        const addProductData = await addProductResponse.json();
        addProductData.success ? alert("Product Added") : alert("Failed to add product");

        // Clear form after successful addition (optional)
        if (addProductData.success) {
            setProductDetails({
                name: "",
                image: "", 
                category: "women",
                new_price: "",
                old_price: ""
            });
            setImage(false); 
        }

      } else {
        alert("Image upload failed!");
        console.error("Image upload failed:", responseData);
      }
    } catch (error) {
      console.error("An error occurred during product addition:", error);
      alert("An error occurred. Please check console for details.");
    }
  };

  return (
    <div className="addproduct">
      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input
          type="text"
          name="name"
          placeholder="Type here"
          value={productDetails.name}
          onChange={changeHandler}
        />
      </div>

      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            type="text"
            name="old_price"
            placeholder="Type here"
            value={productDetails.old_price}
            onChange={changeHandler}
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input
            type="text"
            name="new_price"
            placeholder="Type here"
            value={productDetails.new_price}
            onChange={changeHandler}
          />
        </div>
      </div>

      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select
          name="category"
          className="add-product-selector"
          value={productDetails.category}
          onChange={changeHandler}
        >
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>

      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img
            src={image ? URL.createObjectURL(image) : upload_area}
            className="addproduct-thumbnail-img"
            alt="upload"
          />
        </label>
        <input
          onChange={imageHandler}
          type="file"
          name="image"
          id="file-input"
          hidden
        />
      </div>

      <button onClick={() => { Add_Product() }} className="addproduct-btn">ADD</button>
    </div>
  );
};

export default AddProduct;
