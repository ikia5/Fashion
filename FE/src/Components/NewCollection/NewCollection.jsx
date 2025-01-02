import React, { useEffect, useState } from "react";
import "../Css/NewCollection.css";
import Item from "../Items/Item";

const NewCollection = () =>{

    const [new_collection, setNew_collection] = useState([]);

    useEffect(() => {
      fetch("http://localhost:4000/newcollection")
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setNew_collection(data);
          } else {
            console.error("Data received from API is not an array:", data);
          }
        })
        .catch((error) => console.error("Error fetching data:", error));
    }, []);
    
    return(
        <div className="new-collection">
            <h1>NEW COLLECTION</h1>
            <hr />
            <div className="collection">
                {new_collection.map((item,i)=>{
                    return <Item key={i} id={item.id} name={item.name} image={item.image} price={item.price}/>
                })}
            </div>
        </div>
    )
}

export default NewCollection