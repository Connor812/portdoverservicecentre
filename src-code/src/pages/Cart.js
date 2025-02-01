import React, { useState } from "react";
import Header from "../components/Header";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Alert } from "react-bootstrap";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import "../assets/css/cart.css";

function Cart() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState(localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : []);
    const [errorMessage, setErrorMessage] = useState("");
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const [hst, setHst] = useState(() => {
        let hstTotal = 0;
        cartItems.forEach((item) => {
            console.log(item);

            if (item.is_taxable) {
                hstTotal += (item.price * 0.13) * item.quantity;
            }
        });
        return hstTotal;
    });
    const shipping = 0;
    const total = subtotal + hst + shipping;

    function formatCart(price) {
        return `$${(price / 100).toFixed(2)}`;
    }

    function updateQuantity(action, item) {
        const updatedCartItems = cartItems.map(cartItem => {
            if (cartItem.id === item.id) {
                let newQuantity = cartItem.quantity;
                if (action === "increase") {
                    newQuantity += 1;
                } else if (action === "subtract" && cartItem.quantity > 1) {
                    newQuantity -= 1;
                }
                return { ...cartItem, quantity: newQuantity };
            }
            return cartItem;
        });

        setCartItems(updatedCartItems);
        localStorage.setItem("cart", JSON.stringify(updatedCartItems));

        // Recalculate HST
        const newHst = updatedCartItems.reduce((acc, cartItem) => {
            if (cartItem.is_taxable) {
                return acc + (cartItem.price * 0.13) * cartItem.quantity;
            }
            return acc;
        }, 0);
        setHst(newHst);
    }


    function removeItem(id) {
        const updatedCartItems = cartItems.filter(item => item.id !== id);
        setCartItems(updatedCartItems);
        localStorage.setItem("cart", JSON.stringify(updatedCartItems));
        
        // Recalculate HST
        const newHst = updatedCartItems.reduce((acc, cartItem) => {
            if (cartItem.is_taxable) {
                return acc + (cartItem.price * 0.13) * cartItem.quantity;
            }
            return acc;
        }, 0);
        setHst(newHst);
    }


    function handleCheckoutClick() {
        if (cartItems.length === 0) {
            setErrorMessage("Your cart is empty. Please add items to proceed.");
        } else {
            navigate("/checkout");
        }
    }

    return (
        <main>
            <Header />
            <div className="cart-header">
                <h1 className="time-regular">Your Cart</h1>
            </div>
            <section className="cart-container">
                <div className="cart-items-container">
                    <Row className="cart-table-headings">
                        <Col sm={4} md={6}>Item</Col>
                        <Col sm={4} md={3}>Quantity</Col>
                        <Col sm={4} md={3}>Subtotal</Col>
                    </Row>
                    {cartItems.length === 0 ? (
                        <div>Cart is empty</div>
                    ) : (
                        cartItems.map((item, index) => (
                            <Row className="cart-item" key={index}>
                                <Col md={6} className="cart-item-column">
                                    <div className="cart-image-container">
                                        <img className="cart-product-img" src={item.image} alt="product" />
                                        <div className="cart-item-info">
                                            <h5 className="cart-item-name">{item.name}</h5>
                                            {item.variation && <div className="cart-item-variation">Variation: {item.variation}</div>}
                                            <div>
                                                Price: {formatCart(item.price)}
                                            </div>
                                            <button className="remove-from-cart-btn" onClick={() => removeItem(item.id)}>
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={3} className="quantity-container cart-item-column">
                                    <button className="cart-quantity-btn" onClick={() => updateQuantity("subtract", item)}>
                                        <IoIosArrowDown />
                                    </button>
                                    <div className="quantity-input">
                                        {item.quantity}
                                    </div>
                                    <button className="cart-quantity-btn" onClick={() => updateQuantity("increase", item)}>
                                        <IoIosArrowUp />
                                    </button>
                                </Col>
                                <Col md={3} className="cart-subtotal cart-item-column">
                                    {formatCart(item.price * item.quantity)}
                                </Col>
                            </Row>
                        ))
                    )}
                </div>
                <div className="cart-total-container">
                    <h1 className="m-0">Cart Totals</h1>
                    <hr />
                    <div className="cart-total">
                        <div className="space-between">
                            <div>Subtotal:</div>
                            <div>{formatCart(subtotal)}</div>
                        </div>
                        <div className="space-between">
                            <div>Shipping:</div>
                            <div>{formatCart(shipping)}</div>
                        </div>
                        <div className="space-between">
                            <div>hst:</div>
                            <div>{formatCart(hst)}</div>
                        </div>
                        <hr />
                        <div className="space-between">
                            <div>Total:</div>
                            <div>{formatCart(total)}</div>
                        </div>
                        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                        <div className="checkout-btn-container">
                            <button className="checkout-btn" onClick={handleCheckoutClick}>
                                Proceed To Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Cart;
