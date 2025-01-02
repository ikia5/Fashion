import React, { useEffect, useState } from "react";
import "./ListUsers.css";
import remove_icon from "../../assets/remove_icon.png";
import save_changes from "../../assets/changes.png"

const ListUsers = () =>{
    const [allusers, setAllUsers] = useState([]);
    const [searchEmail, setSearchEmail] = useState("");

    const handleSearchChange = (event) => {
        setSearchEmail(event.target.value);
    };

    const filteredUsers = allusers.filter(user =>
        user.email.toLowerCase().includes(searchEmail.toLowerCase())
    );

    const fetchInfo = async () =>{
        await fetch("http://localhost:4000/allusers")
        .then((res)=>res.json())
        .then((data)=>{setAllUsers(data)});
    }

    useEffect(() =>{
        fetchInfo();
    },[])

    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const updatedUsers = [...allusers];
        updatedUsers[index][name] = value;
        setAllUsers(updatedUsers);
    };

    const remove_user = async (email) => {
        const confirmed = window.confirm("Are you sure you want to remove the user?");
        
        if (confirmed) {
            try {
                await fetch("http://localhost:4000/removeuser", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: email })
                });
                await fetchInfo();
            } catch (error) {
                console.error("Failed to remove user: ", error);
            }
        } else {
            console.log("User canceled the operation.");
        }
    }
    

    const update_user_role = async (user) =>{
        const { email, role } = user;
        try {
            await fetch("http://localhost:4000/update-user-role", {
                method: "PUT",
                headers:{
                    Accept: "application/json",
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify({email, role})
            }).then(()=> {
                fetchInfo();
            })
            alert("Updated successfully!")
        } catch (error) {
            alert("Failed to update product: " + error.message)
        }
    }

    return(
        <div className="list-user">
            <h1>All users</h1>
            <div className="searchbox">
                <input type="search" name="search-email" placeholder="Search user by email" value={searchEmail} onChange={handleSearchChange}/>
            </div>
            <div className="listuser-allusers">
                <hr />
                {filteredUsers.map((user, index) => {
                    return<>
                        <div key={index} className="listuser-format">
                            <p>{user.name}</p>
                            <p>{user.email}</p>
                            <p>{user.phone}</p>
                            <p>{user.address}</p>
                            <select className="user-role" value={user.role} name="role" onChange={(e) => handleInputChange(index, e)}>
                                <option value="customer">Customer</option>
                                <option value="admin">Admin</option>
                            </select>
                            <img src={remove_icon} alt="" className="listuser-remove" onClick={() =>{remove_user(user.email)}} />
                            <img src={save_changes} alt="" className="listproduct-save" onClick={() =>{update_user_role(user)}} />
                        </div>
                        <hr />
                    </>
                })}
            </div>
        </div>
    )
}

export default ListUsers