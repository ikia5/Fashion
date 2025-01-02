import React from "react";
import "./Navbar.css";
import logo from "../../assets/logo.png";

const Navbar = () => {
    return (
        <div className="head-section-top">
            <div className="navbar">
                <div className="navbar-logo">
                    <a href="http://localhost:3000">
                        <img src={logo} alt="" />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Navbar;