import React, { useEffect, useState } from "react";
import "./ListProduct.css";
import remove_icon from "../../assets/remove_icon.png";
import save_changes from "../../assets/changes.png"

const ListProduct = () => {

    const [allproducts, setAllProducts] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [selectedSeason, setSelectedSeason] = useState("All");
    const [selectedLabel, setSelectedLabel] = useState("All");
    const [selectedColor, setSelectedColor] = useState("All");

    const filteredProducts = allproducts.filter((item) => {
        if (searchName && item.name.toLowerCase().indexOf(searchName.toLowerCase()) === -1) {
            return false;
        }
        if (selectedSeason !== "All" && item.season !== selectedSeason) {
            return false;
        }
        if (selectedLabel !== "All" && item.label !== selectedLabel) {
            return false;
        }
        if (selectedColor !== "All" && item.color !== selectedColor) {
            return false;
        }
        return true;
    });

    const fetchInfo = async () =>{
        await fetch("http://localhost:4000/allproducts")
        .then((res)=>res.json())
        .then((data)=>{setAllProducts(data)});
    }

    useEffect(() =>{
        fetchInfo();
    },[])

    const remove_product = async (id) =>{
        await fetch("http://localhost:4000/removeproduct", {
            method: "POST",
            headers:{
                Accept: "application/json",
                "Content-Type" : "application/json",
            },
            body: JSON.stringify({id:id})
        })
        await fetchInfo();
    }

    const update_product = async (product) =>{
        const { id, name, price, description, category } = product;
        try {
            await fetch("http://localhost:4000/updateproduct", {
                method: "PUT",
                headers:{
                    Accept: "application/json",
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify({id, name, price, description, category})
            }).then(()=> {
                fetchInfo();
            })
            alert("Updated successfully!")
        } catch (error) {
            alert("Failed to update product: " + error.message)
        }
    }

    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const updatedProducts = [...allproducts];
        updatedProducts[index][name] = value;
        setAllProducts(updatedProducts);
    };

    return(
        <div className="list-product">
            <h1>All products</h1>
            <div className="searchbox">
                <input type="search" name="search-name" placeholder="Search product by name" value={searchName} onChange={(e) => setSearchName(e.target.value)}/>
                <select name="season" id="season" value={selectedSeason} onChange={(e) => setSelectedSeason(e.target.value)} title="Pick season">
                    <option value="All">All</option>
                    <option value="Spring">Spring</option>
                    <option value="Summer">Sumer</option>
                    <option value="Autumn">Autumn</option>
                    <option value="Winter">Winter</option>
                </select>
                <select name="label" id="label" value={selectedLabel} onChange={(e) => setSelectedLabel(e.target.value)} title="Pick label">
                    <option value="All">All</option>
                    <option value="T-shirt">T-shirt</option>
                    <option value="Shirt">Shirt</option>
                    <option value="Longsleeve">Longsleeve</option>
                    <option value="Coat">Coat</option>
                    <option value="Pants">Pants</option>
                    <option value="Dress">Dress</option>
                </select>
                <select name="color" id="color" value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} title="Pick color">
                    <option value="All">All</option>
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
            <div className="listproduct-allproducts">
                <hr />
                {filteredProducts.map((product, index) => {
                    return<>
                        <div key={index} className="listproduct-format">
                            <img src={product.image} alt="" className="listproduct-image" />
                            <p>{product.id}</p>
                            <input className="product-name" type="text" value={product.name} name="name" onChange={(e) => handleInputChange(index, e)} />
                            <input className="product-price" type="number" value={product.price} name="price" onChange={(e) => handleInputChange(index, e)} />
                            <select className="product-category" value={product.category} name="category" onChange={(e) => handleInputChange(index, e)}>
                                <option value="men">Men</option>
                                <option value="women">Women</option>
                                <option value="kids">Kids</option>
                            </select>
                            <input className="product-description" type="text" value={product.description} name="description" onChange={(e) => handleInputChange(index, e)} />
                            <img src={remove_icon} alt="" className="listproduct-remove" onClick={() =>{remove_product(product.id)}} />
                            <img src={save_changes} alt="" className="listproduct-save" onClick={() =>{update_product(product)}} />
                        </div>
                    <hr />
                    </>
                })}
            </div>
        </div>
    )
}

export default ListProduct