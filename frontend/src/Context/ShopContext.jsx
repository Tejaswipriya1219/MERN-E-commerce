import React, { createContext, useState, useEffect } from 'react';

export const ShopContext = createContext(null);

const getDefaultCart = () => {
    let cart = {};
    for (let i = 0; i <= 300; i++) {
        cart[i] = 0;
    }
    return cart;
};

// Define your backend URL as a constant for easier management
// In a real production app, you might get this from an environment variable (e.g., process.env.REACT_APP_BACKEND_URL)
const BACKEND_URL = 'https://mern-e-commerce-backend-9xbi.onrender.com'; // <-- Updated URL

const ShopContextProvider = (props) => {
    const [all_product, setAll_Product] = useState([]);
    const [cartItems, setCartItems] = useState(getDefaultCart());

    useEffect(() => {
        // Fetch all products
        fetch(`${BACKEND_URL}/allproducts`) // <-- Updated URL
            .then((response) => response.json())
            .then((data) => setAll_Product(data))
            .catch((error) => console.error("Error fetching all products:", error)); // Add error handling

        // Fetch cart if user is logged in
        if (localStorage.getItem('auto-token')) {
            fetch(`${BACKEND_URL}/getcart`, { // <-- Updated URL
                method: 'POST',
                headers: {
                    'auth-token': localStorage.getItem('auto-token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data && typeof data === 'object') {
                        setCartItems(data);
                    } else {
                        console.error("Received unexpected data for cart:", data);
                    }
                })
                .catch((error) => console.error("Error fetching cart:", error)); // Add error handling
        }
    }, []); // Empty dependency array means this runs once on mount

    const addToCart = (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: prev[itemId] + 1,
        }));

        if (localStorage.getItem('auto-token')) {
            fetch(`${BACKEND_URL}/addtocart`, { // <-- Updated URL
                method: 'POST',
                headers: {
                    'auth-token': localStorage.getItem('auto-token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId }),
            })
                .then((response) => response.json())
                .then((data) => console.log('Add to cart:', data))
                .catch((error) => console.error("Error adding to cart:", error)); // Add error handling
        }
    };

    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: prev[itemId] - 1,
        }));

        if (localStorage.getItem('auto-token')) {
            fetch(`${BACKEND_URL}/removefromcart`, { // <-- Updated URL
                method: 'POST',
                headers: {
                    'auth-token': localStorage.getItem('auto-token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId }),
            })
                .then((response) => response.json())
                .then((data) => console.log('Remove from cart:', data))
                .catch((error) => console.error("Error removing from cart:", error)); // Add error handling
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                const product = all_product.find((p) => p.id === Number(item));
                if (product) {
                    totalAmount += product.new_price * cartItems[item];
                }
            }
        }
        return totalAmount;
    };

    const getTotalCartItems = () => {
        let totalItem = 0;
        for (const item in cartItems) {
            totalItem += cartItems[item];
        }
        return totalItem;
    };

    const contextValue = {
        all_product,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        getTotalCartItems,
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
