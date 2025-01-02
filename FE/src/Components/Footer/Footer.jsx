import React from "react";
import "../Css/Footer.css";
import logo from "../Assets/logo.png";

const Footer = () => {
    return(
        <div className="footer">
            <div className="footer_logo">
                <img src={logo} alt="" />
            </div>
            <div className="phone-contact">
            <p>Contact:</p><span>   +84 12345678</span>
            </div>
            <ul className="footer-links" style={{textDecoration:"none"}}>
                <li>Facebook</li>
                <li>Instagram</li>
            </ul>
        </div>
    )
}

export default Footer