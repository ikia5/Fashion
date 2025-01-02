import React from "react";
import SideMenu from "../Components/SideMenu/SideMenu";
import Offer from "../Components/Offer/Offer";
import NewCollection from "../Components/NewCollection/NewCollection";

const Menu = () => {
    return(
        <div>
            <SideMenu></SideMenu>
            <NewCollection></NewCollection>
            <Offer></Offer>

        </div>
    )
}

export default Menu