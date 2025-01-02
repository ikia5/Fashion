import React, { useState } from "react";
import "./AddProduct.css";
import upload_area from "../../assets/upload_area.png";

const AddProduct = () => {

    const [image, setImage] = useState(false);
    const [productDetails, setProductDetails] = useState({
        name: "",
        price:"",
        category:"men",
        season: "Spring",
        label: "T-shirt",
        color: "White",
        description:"",
        image:""
    })

    const imageHandler = (e) => {
        setImage(e.target.files[0]);
    }

    const changeHandler = (e) =>{
        setProductDetails({...productDetails,[e.target.name]:e.target.value})
    }

    const Add_Product = async() => {
        let responseData;
        let product = productDetails;
        let formData = new FormData();
        formData.append("product",image);
        await fetch("http://localhost:4000/upload", {
                method: "POST",
                headers:{
                    Accept:'application/json',
                },
                body: formData,
            }).then((resp) => resp.json()).then((data)=>{responseData=data});
        if(responseData.success){
            product.image = responseData.image_url;
            console.log(product);
            await fetch("http://localhost:4000/addproduct", {
                method: "POST",
                headers:{
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(product),
            }).then((resp) => resp.json()).then((data)=>{
                data.success?alert("Product added"):alert("Failed")
                window.location.reload();
            })
        }
    }

    return(
        <div className="add-product">
            <div className="addproduct-field">
                <input value={productDetails.name} onChange={changeHandler} type="text" name="name" placeholder="Product name" />
            </div>
            <div className="addproduct-field">
                <input value={productDetails.price} onChange={changeHandler} type="text" name="price" placeholder="Product price" />
            </div>
            <div className="addproduct-field">
                <select value={productDetails.category} onChange={changeHandler} name="category" className="add-product-selector">
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                </select>
            </div>
            <div className="addproduct-field">
                <select value={productDetails.season} onChange={changeHandler} name="season" className="add-product-selector">
                    <option value="Spring">Spring</option>
                    <option value="Summer">Summer</option>
                    <option value="Autumn">Autumn</option>
                    <option value="Winter">Winter</option>
                </select>
            </div>
            <div className="addproduct-field">
                <select value={productDetails.label} onChange={changeHandler} name="label" className="add-product-selector">
                    <option value="T-shirt">T-shirt</option>
                    <option value="Shirt">Shirt</option>
                    <option value="Longsleeve">Longsleeve</option>
                    <option value="Coat">Coat</option>
                    <option value="Pants">Pants</option>
                    <option value="Dress">Dress</option>
                </select>
            </div>
            <div className="addproduct-field">
                <select value={productDetails.color} onChange={changeHandler} name="color" className="add-product-selector">
                    <option value="White">White</option>
                    <option value="Yellow">Yellow</option>
                    <option value="Orange">Orange</option>
                    <option value="Red">Red</option>
                    <option value="Pink">Pink</option>
                    <option value="Green">Green</option>
                    <option value="Blue">Blue</option>
                    <option value="Indigo">Indigo</option>
                    <option value="Violet">Violet</option>
                    <option value="Brown">Brown</option>
                    <option value="Gray">Gray</option>
                    <option value="Black">Black</option>
                </select>
            </div>
            <div className="addproduct-field">
                <input value={productDetails.description} onChange={changeHandler} type="text" name="description" placeholder="Product description" />
            </div>
            <div className="addproduct-field">
                <label htmlFor="file-input">
                    <img src={image?URL.createObjectURL(image):upload_area} className="addproduct-img" alt="" />
                </label>
                <input onChange={imageHandler} type="file" name="image" id="file-input" hidden/>
            </div>
            <button onClick={()=>{Add_Product()}} className="addproduct-btn">Add product</button>
        </div>
    )
}

export default AddProduct