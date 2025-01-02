import React from "react";
import "../Components/Css/Profile.css";
import { useState } from "react";
import { useEffect } from "react";

const Profile = () => {

    const [userData, setUserData] = useState({
        name: "",
        email: "",
        phone: "",
        address: ""
    });

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const delete_account = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete your account?");
        if (confirmDelete) {
            await fetch("http://localhost:4000/deleteaccount", {
                method: "POST",
                headers: {
                    'auth-token': localStorage.getItem('auth-token')
                },
                body: JSON.stringify({ id: id })
            });
            localStorage.removeItem("auth-token");
            window.location.replace("/");
        } else {
            console.log("Account deletion canceled.");
        }
    }

    const update_profile = async () =>{
        const { name, email, phone, address } = userData;
        try {
            await fetch("http://localhost:4000/updateprofile", {
                method: "PUT",
                headers:{
                    'content-type': 'application/json',
                    'auth-token': localStorage.getItem('auth-token')
                },
                body: JSON.stringify({ name, email, phone, address })
            }).then(()=> {
                fetchInfo();
                alert("Updated successfully!")
            })
        } catch (error) {
            alert("Failed to update profile: " + error.message)
        }    
    }

    return(
        <div className="profile-main">
            <div className="profile-container">
                <h2>User profile</h2>
                <div className="profile-profile">
                    <p>Email: {userData.email}</p>
                    <p>Phone: {userData.phone}</p>
                    <input name="name" value={userData.name} type="text" onChange={handleInputChange} />
                    <input name="address" value={userData.address} type="text" onChange={handleInputChange} />
                </div>
                <button className="update" onClick={update_profile}>Save changes</button>
                <button className="delete" onClick={() =>{delete_account(userData.id)}}>Delete account</button>
            </div>
        </div>
    )
}

export default Profile