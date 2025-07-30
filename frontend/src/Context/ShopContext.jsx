import React, { createContext, useState, useEffect } from 'react';

export const ShopContext = createContext(null);

const getDefaultCart = () => {
    let cart = {};
    for (let i = 0; i <= 300; i++) {
        cart[i] = 0;
    }
    return cart;
};

// Define your deployed backend URL as a constant
const BACKEND_API_BASE_URL = 'https://mern-e-commerce-backend-9xbi.onrender.com';

const ShopContextProvider = (props) => {
    const [all_product, setAll_Product] = useState([]);
    const [cartItems, setCartItems] = useState(getDefaultCart());

    useEffect(() => {
        // Fetch all products
        fetch(`${BACKEND_API_BASE_URL}/allproducts`)
            .then((response) => response.json())
            .then((data) => setAll_Product(data))
            .catch((error) => console.error("Error fetching all products:", error));

        // Fetch cart if user is logged in
        if (localStorage.getItem('auto-token')) {
            fetch(`${BACKEND_API_BASE_URL}/getcart`, {
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
                .catch((error) => console.error("Error fetching cart:", error));
        }
    }, []);

    const addToCart = (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: prev[itemId] + 1,
        }));

        if (localStorage.getItem('auto-token')) {
            fetch(`${BACKEND_API_BASE_URL}/addtocart`, {
                method: 'POST',
                headers: {
                    'auth-token': localStorage.getItem('auto-token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId }),
            })
                .then((response) => response.json())
                .then((data) => console.log('Add to cart:', data))
                .catch((error) => console.error("Error adding to cart:", error));
        }
    };

    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: prev[itemId] - 1,
        }));

        if (localStorage.getItem('auto-token')) {
            fetch(`${BACKEND_API_BASE_URL}/removefromcart`, {
                method: 'POST',
                headers: {
                    'auth-token': localStorage.getItem('auto-token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId }),
            })
                .then((response) => response.json())
                .then((data) => console.log('Remove from cart:', data))
                .catch((error) => console.error("Error removing from cart:", error));
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
