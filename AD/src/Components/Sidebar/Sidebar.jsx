import React from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";
import add_product from "../../assets/add-product.png";
import list_product from "../../assets/list-product.png";
import list_order from "../../assets/list-order.png";

const Sidebar = () => {
    return(
        <div className="sidebar">
            <Link to = {"/addproduct"} style={{textDecoration:"none"}}>
                <div className="sidebar-item">
                    <img src={add_product} alt="" />
                    <p>Add Product</p>
                </div>
            </Link>
            <Link to = {"/listproduct"} style={{textDecoration:"none"}}>
                <div className="sidebar-item">
                    <img src={list_product} alt="" />
                    <p>List Product</p>
                </div>
            </Link>
            <Link to = {"/listorder"} style={{textDecoration:"none"}}>
                <div className="sidebar-item">
                    <img src={list_order} alt="" />
                    <p>List Order</p>
                </div>
            </Link>
            <Link to = {"/listusers"} style={{textDecoration:"none"}}>
                <div className="sidebar-item">
                    <img src={list_order} alt="" />
                    <p>List Users</p>
                </div>
            </Link>
        </div>
    )
}

export default Sidebar