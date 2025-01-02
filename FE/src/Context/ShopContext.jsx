import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
    const [all_product, setAll_product] = useState([]);
    const [cartItems, setcartItem] = useState([]);
    useEffect(() =>{
        fetch("http://localhost:4000/allproducts")
        .then((response)=>response.json())
        .then((data)=>setAll_product(data))
    },[])

//      Cart functions
    const addToCart = (product) => {
        setcartItem((prev) => {
            const isItemInCart = prev && prev.some(item => item.id === product.id);
            if(isItemInCart) {
                return prev.map(item => {
                    if(item.id === product.id) {
                        return {
                            ...item,
                            quantity: item.quantity + 1,
                        };
                    }
                    return item;
                });
            } else { 
                return [...prev, {
                    id: product.id,
                        quantity: 1,
                        size: ["S"],
                        product
                }]
            }
        }
        );
    };

    const removeFromCart = (productId) => {
        setcartItem((prev) => prev.filter((item) => item.id !== productId));
    };

    const clearCart = () => {
        setcartItem([]);
    };

    const updateCartItemQuantity = (itemId, newQuantity) => {
        setcartItem((prev) => {
            return prev.map((item) => {
                if (item.id === itemId) {
                    return { ...item, quantity: newQuantity };
                }
                return item;
            });
        });
    }

    const updateCartItemSize = (itemId, newSize) => {
        setcartItem((prev) => {
            return prev.map((item) => {
                if (item.id === itemId) {
                    return { ...item, size: newSize };
                }
                return item;
            });
        });
    }
    
    const contextValue = {all_product, cartItems, addToCart, removeFromCart, clearCart, updateCartItemQuantity, updateCartItemSize};

    return(
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider