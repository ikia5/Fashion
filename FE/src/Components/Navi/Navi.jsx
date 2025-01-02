import React, {  useState, useEffect } from "react";
import "../Css/Navi.css";
import logo from "../Assets/logo.png";
import cart_icon from "../Assets/cart_icon.png";
import profile_icon from "../Assets/profile.png";
import order_icon from "../Assets/list-order.png";
import { Link } from "react-router-dom";

const Navi = () =>{

   const [menu,setMenu] = useState("menu");
   const [userData, setUserData] = useState({})

   const fetchInfo = async () =>{
      await fetch("http://localhost:4000/profile", {
          headers: {
              'auth-token': localStorage.getItem('auth-token')
          }
      })
      .then((res)=>res.json())
      .then((data)=>{setUserData(data)});
   }

   useEffect(() =>{
         fetchInfo();
   },[])

   const handleProfileClick = () => {
      if (userData.role === "admin") {
         window.location.replace("http://localhost:5173");
      } else {
         window.location.replace("http://localhost:3000");
      }
   };
  
   return(
      <div className="navi">
         <div className="navi-logo">
            <img onClick={handleProfileClick} src={logo} alt="" />
         </div>

         <ul className="navi-header">
            <li onClick={()=>{setMenu("menu")}}><Link style={{textDecoration: "none"}} to="/">Menu</Link>{menu==="menu"?<hr/>:<></>}</li>
            <li onClick={()=>{setMenu("men")}}><Link style={{textDecoration: "none"}}to="/men">Men</Link>{menu==="men"?<hr/>:<></>}</li>
            <li onClick={()=>{setMenu("women")}}><Link style={{textDecoration: "none"}} to="/women">Women</Link>{menu==="women"?<hr/>:<></>}</li>
            <li onClick={()=>{setMenu("kids")}}><Link style={{textDecoration: "none"}} to="/kids">Kids</Link>{menu==="kids"?<hr/>:<></>}</li>
         </ul>

         <div className="navi-cart-login">
            <Link to="/cart"><img src={cart_icon} alt="" title="Cart"/></Link>
            {localStorage.getItem("auth-token")
            ?<Link to="/profile"><img src={profile_icon} className="profile" alt="" title="Profile"/></Link>
            :<></>
            }
            {localStorage.getItem("auth-token")
            ?<Link to="/myorders"><img src={order_icon} className="myorders" alt="" title="My orders"/></Link>
            :<></>
            }
            {localStorage.getItem("auth-token")
            ?<button onClick={()=>{localStorage.removeItem("auth-token");window.location.replace("/")}}>Log out</button>
            :<Link to="/login"><button>Log in</button></Link>
            }
         </div>
      </div>
   )
}

export default Navi