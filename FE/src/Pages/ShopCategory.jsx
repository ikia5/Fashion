import React, { useContext, useState } from "react";
import "../Components/Css/ShopCategory.css";
import { ShopContext } from "../Context/ShopContext";
import Item from "../Components/Items/Item";
import banner from "../Components/Assets/banner.jpg"

const ShopCategory = (props) => {
    const {all_product} = useContext(ShopContext);
    const [searchName, setSearchName] = useState("");
    const [selectedSeason, setSelectedSeason] = useState("All");
    const [selectedLabel, setSelectedLabel] = useState("All");
    const [selectedColor, setSelectedColor] = useState("All");

    const filteredProducts = all_product.filter((item) => {
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

    return(
        <div className="shop-category">
            <div className="shopcategory-banner">
                <img src={banner} alt="" />
            </div>
            <div className="filter-product">
                <input type="text" placeholder="Search product" value={searchName} onChange={(e) => setSearchName(e.target.value)}/>
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
            <div className="shopcategory-product">
                {filteredProducts.map((item,i)=>{
                    if (props.category===item.category) {
                        return <Item key={i} id={item.id} name={item.name} image={item.image} price={item.price} />
                    }
                    else{
                        return null;
                    }
                })}
            </div>
        </div>
    )
}

export default ShopCategory