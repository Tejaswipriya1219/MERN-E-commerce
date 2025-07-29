import React,{useEffect,useState}from 'react'
import './Popular.css'

import { Item } from '../Item/Item'

// Define your deployed backend URL as a constant
const BACKEND_API_BASE_URL = 'https://mern-e-commerce-backend-9xbi.onrender.com'; // <-- Your deployed backend URL

export const Popular = () => {

  const [popularProducts,setPopularProducts]=useState([]);

  useEffect(()=>{
        fetch(`${BACKEND_API_BASE_URL}/popularinwomen`) // <-- Changed URL
        .then((response)=>response.json())
        .then((data)=>setPopularProducts(data))
        .catch((error) => console.error("Error fetching popular products:", error)); // Added error handling
  },[]) // Empty dependency array means this runs once on mount

  return (
    <div className='popular'>
        <h1>POPULAR IN WOMEN</h1>
        <hr/>
        <div className="popular-item">
            {popularProducts.map((item,i) =>{
                return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
            } )}
        </div>
    </div>
  )
}
