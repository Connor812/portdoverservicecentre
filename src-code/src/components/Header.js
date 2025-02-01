import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../assets/css/header.css";

import { IoLocationSharp } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";

function Header() {
    // State to hold the total items in the cart
    const [totalAmountInCart, setTotalAmountInCart] = useState(0);

    // Function to get the total items in the cart
    const getTotalAmountInCart = () => {
        const cart = JSON.parse(localStorage.getItem("cart"));
        let total = 0;
        if (cart) {
            cart.forEach(item => {
                total += item.quantity;
            });
        }
        setTotalAmountInCart(total);
    }

    // UseEffect to get the total items in the cart
    useEffect(() => {
        getTotalAmountInCart();
    }, [JSON.parse(localStorage.getItem("cart"))]);



    return (
        <nav className='navbar'>
            <div className='nav-images-container'>
                <img className="nav-logo" src="/assets/images/md-auto-logo.png" alt="Logo" />
                <img className="nav-service-center" src="/assets/images/service-center-logo.png" alt="Service Center" />
                <img className="nav-napa-logo" src="/assets/images/napa-logo.png" alt="NAPA Logo" />
                <div className='nav-location-link'>
                    <a href="https://www.google.com/maps/place/119+St+Andrew+St,+Port+Dover,+ON+N0A+1N0/data=!4m2!3m1!1s0x882c53716bd60e17:0xd4dc6e7192d5b30d?sa=X&ved=1t:242&ictx=111">
                        <IoLocationSharp className="nav-location" />
                    </a>
                </div>
            </div>
            <div className='nav-address'>
                <a href="https://www.google.com/maps/place/119+St+Andrew+St,+Port+Dover,+ON+N0A+1N0/data=!4m2!3m1!1s0x882c53716bd60e17:0xd4dc6e7192d5b30d?sa=X&ved=1t:242&ictx=111">119 St. Andrews St.</a>
                <a href="tel:519-583-0996">519-583-0996</a>
            </div>

            <div className='nav-book-app'>
                <a href="https://portdoverservicecentre.mechanicnet.com/apps/shops/display?page=appointment">
                    Book <br />
                    Appointment
                </a>
            </div>

            <div className='nav-cart-container'>
                <Link to="/cart" className='cart-link'>
                    <FaShoppingCart className="nav-cart" />
                    {totalAmountInCart > 0 &&
                        <div className='items-in-cart'>
                            {totalAmountInCart}
                        </div>
                    }
                </Link>
            </div>
        </nav>
    );
}

export default Header;
