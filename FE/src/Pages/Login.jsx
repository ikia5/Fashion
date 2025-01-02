import React, { useState } from "react";
import "../Components/Css/Login.css";
import { jwtDecode } from "jwt-decode";

const Login = () => {

    const [state, setState] = useState("Login");
    const [formData, setFormData] = useState({
        email:"",
        name:"",
        phone:"",
        address:"",
        role:"customer",
        password:""
    })
    const changeHandler = (e) =>{
        setFormData({...formData, [e.target.name]:e.target.value})
    }

    const login = async () =>{
        console.log("Login executed", formData);
        let respondData;
        await fetch("http://localhost:4000/login", {
            method: "POST",
            headers: {
                Accept: "application/form-data",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        }).then((response)=> response.json()).then((data)=>respondData=data)
        if(respondData.success){
            const token = respondData.token;
            localStorage.setItem("auth-token", token);
//      Check the role of the user from the response data
            const decoded = jwtDecode(token);
            const { role } = decoded.user;
            
//      Redirect based on the user's role
            if (role === 'admin') {
                window.location.replace("http://localhost:5173");
            } else {
                window.location.replace("http://localhost:3000");
            }
        }
        else{
            alert(respondData.errors)
        }
    }

    const register = async () =>{
        console.log("Register executed", formData);
        let respondData;
        await fetch("http://localhost:4000/register", {
            method: "POST",
            headers: {
                Accept: "application/form-data",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        }).then((response)=> response.json()).then((data)=>respondData=data)
        if(respondData.success){
            localStorage.setItem("auth-token", respondData.token);
            window.location.replace("/")
        }
        else{
            alert(respondData.errors)
        }
    }

    return(
        <div className="login-main">
            <div className="login-container">
                <h2>{state}</h2>
                <div className="login-login">
                    <input name="email" value={formData.email} onChange={changeHandler} type="text" placeholder="Email" />
                    {state==="Register"?<input name="name" value={formData.name} onChange={changeHandler} type="text" placeholder="Name" />:<></>}
                    {state==="Register"?<input name="phone" value={formData.phone} onChange={changeHandler} type="text" placeholder="Phone" />:<></>}
                    {state==="Register"?<input name="address" value={formData.address} onChange={changeHandler} type="text" placeholder="Address" />:<></>}
                    <input name="password" value={formData.password} onChange={changeHandler} type="password" placeholder="Password" />
                </div>
                <button onClick={()=>{state==="Login"?login():register()}}>Continue</button>
                {state==="Login"
                ?<p className="register">Don't have an account? <span onClick={()=>{setState("Register")}}>Register here</span></p>
                :<p className="login">Already have an account? <span onClick={()=>{setState("Login")}}>Login here</span></p>}
            </div>
        </div>
    )
}

export default Login