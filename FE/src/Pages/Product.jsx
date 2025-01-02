import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../Context/ShopContext"
import { useParams } from "react-router-dom";
import Display from "../Components/PDisplay/Display";
import "../Components/Css/Product.css"
import Item from "../Components/Items/Item";

const Product = () => {
    const { all_product } = useContext(ShopContext);
    const { productId } = useParams();
    const product = all_product.find((e) => e.id === Number(productId)); 
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:5000/recommendations?item_id=${productId}`)
            .then(response => response.json())
            .then(data => setRecommendations(data.recommended_items))
            .catch(error => console.error('Error fetching recommendations:', error));
    }, [productId]);
    
    return(
        <div>
            {product && (
                <div className="display-products">
                    <Display product={product}></Display>
                    <h2>Related products</h2>
                    <div className="recommended">
                        {recommendations.map((item, i) => (
                            <Item key={i} id={item.id} name={item.name} image={item.image} price={item.price} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Product;
