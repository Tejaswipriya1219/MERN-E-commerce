import React, { useEffect, useState } from 'react'
import './NewCollections.css'

import { Item } from '../Item/Item';

// Define your deployed backend URL as a constant
const BACKEND_API_BASE_URL = 'https://mern-e-commerce-backend-9xbi.onrender.com';

export const NewCollections = () => {
  const [new_collection, setNew_collection] = useState([]);

  useEffect(() => {
    fetch(`${BACKEND_API_BASE_URL}/newcollections`)
      .then((response) => response.json())
      .then((data) => setNew_collection(data))
      .catch((error) => console.error("Error fetching new collections:", error));
  }, []) 

  return (
    <div className='new-collections'>
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className="collections">
        {new_collection.map((item, i) => {
          return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
        })}
      </div>
    </div>
  )
}
