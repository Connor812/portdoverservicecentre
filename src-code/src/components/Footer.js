import React from 'react';
import { Link } from 'react-router-dom';
import "../assets/css/footer.css";

import { IoLocationSharp } from "react-icons/io5";

function Footer() {
    return (
        <nav className='footer'>
            <div className='footer-images-container'>
                <img className="footer-logo" src="/assets/images/md-auto-logo.png" alt="Logo" />
                <img className="footer-service-center" src="/assets/images/service-center-logo.png" alt="Service Center" />
                <img className="footer-napa-logo" src="/assets/images/napa-logo.png" alt="Service Center" />
                <div className='footer-location-link'>
                    <a href="https://www.google.com/maps/place/119+St+Andrew+St,+Port+Dover,+ON+N0A+1N0/data=!4m2!3m1!1s0x882c53716bd60e17:0xd4dc6e7192d5b30d?sa=X&ved=1t:242&ictx=111">
                        <IoLocationSharp className="footer-location" />
                    </a>
                </div>
            </div>
            <div className='nav-book-app'>
                <a href="https://portdoverservicecentre.mechanicnet.com/apps/shops/display?page=appointment">
                    Book <br />
                    Appointment
                </a>
            </div>
            <div className='footer-address'>
                <a href="https://www.google.com/maps/place/119+St+Andrew+St,+Port+Dover,+ON+N0A+1N0/data=!4m2!3m1!1s0x882c53716bd60e17:0xd4dc6e7192d5b30d?sa=X&ved=1t:242&ictx=111">119 St. Andrews St.</a>
                <a href="tel:519-583-0996">519-583-0996</a>
            </div>
        </nav>
    )
}


export default Footer