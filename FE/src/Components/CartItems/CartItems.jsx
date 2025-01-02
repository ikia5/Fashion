import React, { useContext } from "react";
import "../Css/CartItems.css";
import { ShopContext } from "../../Context/ShopContext";
import remove_icon from "../Assets/cart_cross_icon.png";

const CartItems = () => {
    const {all_product, cartItems, removeFromCart, clearCart, updateCartItemQuantity, updateCartItemSize} = useContext(ShopContext);
    let totalPrice = 0;

    const createOrder = async () => {
        const authToken = localStorage.getItem('auth-token');
        
        if (!authToken) {
            alert('You need to log in to create an order.');
            return;
        }

        await fetch('http://localhost:4000/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('auth-token')
        },
            body: JSON.stringify({
                'cartItems': cartItems,
                'total': totalPrice,
            })
        }).then(()=> {
            clearCart();
            alert('Order created')
        })
    }

    const handleQuantityChange = (itemId, event) => {
        const newQuantity = parseInt(event.target.value);
        updateCartItemQuantity(itemId, newQuantity);
    }

    const handleSizeChange = (itemId, event) => {
        const newSize = event.target.value;
        updateCartItemSize(itemId, [newSize]);
    }
    
    return(
        <div className="cart-items">
            <div className="cart-items-main">
                <p>Product</p>
                <p>Name</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Size</p>
                <p>Total</p>
                <p>Remove</p>
            </div>
            <hr />
            <div>
                {Array.isArray(all_product) && all_product.length > 0 && cartItems && cartItems.length > 0 && cartItems.map((item) => {
                    const { product, quantity }= item;
                    totalPrice += product.price * quantity; 
                    return <div>
                    <div className="cart-items-format cart-items-main">
                        <img src={product.image} alt="" className="cart-product-icon" />
                        <p>{product.name}</p>
                        <p>${product.price}</p>
                        <input type="number" value={quantity} className="cart-item-quantity" onChange={(e) => handleQuantityChange(item.id, e)}
                        />
                        <select value={item.size[0]} name="size" className="size-selector" onChange={(e) => handleSizeChange(item.id, e)}>
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                        </select>
                        <p>${product.price * quantity}</p>
                        <img src={remove_icon} onClick={()=>{removeFromCart(item.id)}} alt="" className="cart-remove-icon" />
                    </div>
                    <hr />
                    </div>
                })}
                <div className="cart-under">
                    <div className="cart-total">
                        <h1>Cart total</h1>
                        <div>
                            <div className="cart-total-items">
                                <h3>Total</h3>
                                <h3>${totalPrice}</h3>
                            </div>
                        </div>
                        <button onClick={clearCart} className="clear-cart">Clear cart</button>
                        <button className="create-order" onClick={createOrder}>Create Order</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartItems