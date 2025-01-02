import React, { useEffect, useState } from "react";
import "../Components/Css/Orders.css";

const Orders = () => {
    const [myOrders, setMyOrders] = useState([]);

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

    return (
        <div className="orders-container">
            <h2>My Orders</h2>
            {myOrders.map((order, index) => {
                const {cartItems} = order;
                    return(
                        <div key={index} className="list-order">
                            <div className="listorder-allorders">
                                <div className="listorder-format">
                                    <div className="customer-info">
                                        <p>Product</p>
                                        <p>Product name</p>
                                        <p>Product size</p>
                                        <p>Quantity</p>
                                        <p>Total</p>
                                    </div>
                                    <hr />
                                    {cartItems.map((item, index) => (
                                        <div key={index} className="cartitems">
                                            <img src={item.product.image} alt="" />
                                            <p>{item.product.name}</p>
                                            <p>{item.size.toString()}</p>
                                            <p>{item.quantity}</p>
                                            <p>$ {item.product.price*item.quantity}</p>
                                        </div>
                                    ))}
                                    <div className="total-price">
                                        <h2>$ {order.total}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
        </div>
    );
}

export default Orders;
