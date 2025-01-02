import React from "react";
import "../Css/Item.css";
import { Link } from "react-router-dom";

const Item = (props) => {
    return(
        <div className="item">
            <Link to ={`/product/${props.id}`}><img src={props.image} alt="" /></Link>
            <p>{props.name}</p>
            <div className="item-price">
                <div className="item-price-new">
                    ${props.price}
                </div>
            </div>
        </div>
    )
}

export default Item