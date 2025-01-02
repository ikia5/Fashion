import React, { useContext } from "react";
import "../Css/Display.css";
import { ShopContext } from "../../Context/ShopContext";

const Display = (props) => {
    const {product} = props;
    const {addToCart} = useContext(ShopContext);

    return(
        <div className="display-product">
            <div className="display-left">
                <div className="display-image">
                    <img src={product.image} alt="" />
                </div>
            </div>
            <div className="display-right">
                <h1>{product.name}</h1>
                <div className="display-right-price">
                    <div className="display-right-new">${product.price}</div>
                </div>
                <div className="product-description">
                    <p>Category: {product.category}</p>
                    <p>Season: {product.season}</p>
                    <p>Label: {product.label}</p>
                    <p>Primary color: {product.color}</p>
                    <p>{product.description}</p>
                </div>
                <button onClick={()=>{addToCart(product)}}>ADD TO CART</button>
            </div>
        </div>
    )
}

export default Display