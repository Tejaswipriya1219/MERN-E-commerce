import React, { createContext, useState, useEffect } from 'react';

export const ShopContext = createContext(null);

const getDefaultCart = () => {
    let cart = {};
    for (let i = 0; i <= 300; i++) {
        cart[i] = 0;
    }
    return cart;
};

const ShopContextProvider = (props) => {
    const [all_product, setAll_Product] = useState([]);
    const [cartItems, setCartItems] = useState(getDefaultCart());

    useEffect(() => {
        // Fetch all products
        fetch('http://localhost:4000/allproducts')
            .then((response) => response.json())
            .then((data) => setAll_Product(data));

        // Fetch cart if user is logged in
        if (localStorage.getItem('auto-token')) {
            fetch('http://localhost:4000/getcart', {
                method: 'POST',
                headers: {
                    'auth-token': localStorage.getItem('auto-token'), // ✅ corrected
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data && typeof data === 'object') {
                        setCartItems(data);
                    }
                });
        }
    }, []);

    const addToCart = (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: prev[itemId] + 1,
        }));

        if (localStorage.getItem('auto-token')) {
            fetch('http://localhost:4000/addtocart', {
                method: 'POST',
                headers: {
                    'auth-token': localStorage.getItem('auto-token'), // ✅ corrected
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId }),
            })
                .then((response) => response.json())
                .then((data) => console.log('Add to cart:', data));
        }
    };

    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: prev[itemId] - 1,
        }));

        if (localStorage.getItem('auto-token')) {
            fetch('http://localhost:4000/removefromcart', {
                method: 'POST',
                headers: {
                    'auth-token': localStorage.getItem('auto-token'), // ✅ corrected
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId }),
            })
                .then((response) => response.json())
                .then((data) => console.log('Remove from cart:', data));
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
