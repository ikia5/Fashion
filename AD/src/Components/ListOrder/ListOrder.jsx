import React, { useEffect, useState } from "react";
import "./ListOrder.css";

const ListOrder = () => {

    const [allorders, setAllOrders] = useState([]);
    const [searchID, setSearchID] = useState("");
    const [searchEmail, setSearchEmail] = useState("");

    const fetchInfo = async () =>{
        await fetch("http://localhost:4000/allorders")
        .then((res)=>res.json())
        .then((data)=>{setAllOrders(data)});
    }

    useEffect(() =>{
        fetchInfo();
    },[])

    const sortedOrders = allorders.sort((a, b) => b.id - a.id);

    // Filter orders
    const filteredOrders = sortedOrders.filter(order =>{
        if (searchID && !order.id.toString().includes(searchID)) {
            return false;
        }
        if (searchEmail && order.email.toLowerCase().indexOf(searchEmail.toLowerCase()) === -1) {
            return false;
        }
        return true;
    });

    const handleCheckboxChange = async (id, event) => {
        const isChecked = event.target.checked; 
        await fetch('http://localhost:4000/update-order-deliver', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                'id': id,
                'deliver': isChecked,
            })
        }).then(()=> fetchInfo());
    };

    return(
        <div className="list-order">
            <h1>All orders</h1>
            <div className="searchbox">
                <input type="number" value={searchID} onChange={(e) => setSearchID(e.target.value)} placeholder="Search by ID" />
                <input type="text" value={searchEmail} onChange={(e) => setSearchEmail(e.target.value)} placeholder="Search by email"/>
            </div>
            <div className="listorder-allorders">
                <hr />
                {filteredOrders.map((order, index) => {
                    const {cartItems} = order;
                    return (
                        <div key={index} className={`listorder-format ${order.isChecked ? 'checked' : ''}`}>
                    <div className="customer-info">
                        <p className="id">{order.id}</p>
                        <p className={order.deliver ? 'gray-text' : ''}>{order.email}</p>
                        <p className={order.deliver ? 'gray-text' : ''}>{order.name}</p>
                        <p className={order.deliver ? 'gray-text' : ''}>{order.phone}</p>
                        <p className={order.deliver ? 'gray-text' : ''}>{order.address}</p>
                        <p className={order.deliver ? 'gray-text' : ''}>{order.total}</p>
                    </div>
                    {cartItems.map((item, index) => (
                        <div key={index} className="cart-items">
                            <img src={item.product.image} alt="" />
                            <p className={order.deliver ? 'gray-text' : ''}>{item.product.id}</p>
                            <p className={order.deliver ? 'gray-text' : ''}>{item.product.name}</p>
                            <p className={order.deliver ? 'gray-text' : ''}>{item.size.toString()}</p>
                            <p className={order.deliver ? 'gray-text' : ''}>{item.quantity}</p>
                        </div>
                    ))}
                    <input type="checkbox" id="delivered" className="delivered" checked={order.deliver} value="false" onChange={(event) => handleCheckboxChange(order.id, event)}/>
                    <hr />
                </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ListOrder