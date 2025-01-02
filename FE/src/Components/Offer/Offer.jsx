import React, { useEffect, useState } from "react";
import "../Css/Offer.css";
import Item from "../Items/Item";

const Offer = () => {

    const [myOrders, setMyOrders] = useState([]);
    const [boughtProducts, setBoughtProducts] = useState([]);
    const [recommendations, setRecommendations] = useState([]);

    const fetchInfo = async () =>{
        await fetch("http://localhost:4000/my-orders", {
            headers: {
                'auth-token': localStorage.getItem('auth-token')
            }
        })
        .then((res)=>res.json())
        .then((data)=>{setMyOrders(data)});
    }

    useEffect(() =>{
        fetchInfo();
    },[])

    useEffect(() => {
        if (myOrders.length > 0) {
            const productIds = [];
            myOrders.forEach(order => {
                order.cartItems.forEach(cartItem => {
                    const productId = cartItem.product.id;
                    if (!productIds.includes(productId)) {
                        productIds.push(productId);
                    }
                });
            });
            setBoughtProducts(productIds);
        }
    }, [myOrders]);
    
    useEffect(() => {
        if (boughtProducts.length > 0) {
            const fetchRecommendations = async () => {
                try {
                    const response = await fetch('http://localhost:5000/frombought', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ boughtProducts: boughtProducts })
                    });
                    const data = await response.json();
                    setRecommendations(JSON.parse(data));
                } catch (error) {
                    console.error('Error fetching recommendations:', error);
                }
            };
            fetchRecommendations();
        }
    }, [boughtProducts]);
    
    return (
        <div className="offer">
            <h1>OFFER FOR YOU</h1>
            <hr />
            <div className="collection">
                {recommendations?.length > 0 ? (
                    recommendations.map((item, i) => (
                        <Item key={i} id={item.id} name={item.name} image={item.image} price={item.price}/>
                    ))
                ) : (
                    <h2>You haven't bought anything</h2>
                )}
            </div>
        </div>
    )
    
}

export default Offer