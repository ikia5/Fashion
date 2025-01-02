import React from "react";
import "./Admin.css";
import Sidebar from "../../Components/Sidebar/Sidebar";
import { Routes, Route } from "react-router-dom";
import AddProduct from "../../Components/AddProduct/AddProduct";
import ListProduct from "../../Components/ListProduct/ListProduct";
import ListOrder from "../../Components/ListOrder/ListOrder";
import ListUsers from "../../Components/ListUsers/ListUsers";

const Admin = () => {
    return(
        <div className="admin">
            <Sidebar></Sidebar>
            <Routes>
                <Route path="/addproduct" element={<AddProduct/>} />
                <Route path="/listproduct" element={<ListProduct/>} />
                <Route path="/listorder" element={<ListOrder/>} />
                <Route path="/listusers" element={<ListUsers/>} />
            </Routes>
        </div>
    )
}

export default Admin