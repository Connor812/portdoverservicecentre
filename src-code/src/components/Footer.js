import React from 'react';
import { Link } from 'react-router-dom';
import { TbCalendarCheck } from "react-icons/tb";
import "../assets/css/footer.css";

import { IoLocationSharp } from "react-icons/io5";

function Footer() {
    return (
        <nav className='footer'>
            <div className='footer-top'>
                <ul className='footer-service-list'>
                    <li>Oil & Filter Change</li>
                    <li>Vehicle Health Inspection</li>
                    <li>Filters</li>
                    <li>Brakes</li>
                    <li>Tires & Wheels</li>
                    <li>Wheel Alignment</li>
                    <li>Safety Checks</li>
                    <li>Maintenance Tune-Up</li>
                    <li>Fluid Exchanges</li>
                    <li>Belts & Hoses</li>
                    <li>Fleet Maintenance</li>
                    <li>Wiper Blade Replacement</li>
                    <li>Headlights</li>
                </ul>
                <div className='footer-map'>
                    <div className='footer-open-time'>
                        OPEN MONDAY TO FRIDAY 8am-5pm <br />
                        519-583-0996
                    </div>
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2928.0439581992114!2d-80.20576882407539!3d42.78742057115632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882c53716bd60e17%3A0xd4dc6e7192d5b30d!2s119%20St%20Andrew%20St%2C%20Port%20Dover%2C%20ON%20N0A%201N0!5e0!3m2!1sen!2sca!4v1738562223854!5m2!1sen!2sca" width="100%" height="300" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                </div>
                <ul className='footer-service-list'>
                    <li>Brake Repair</li>
                    <li>Tires & Wheels Replacement</li>
                    <li>Check Warning Lights</li>
                    <li>Diagnostic Testing</li>
                    <li>Steering & Front-End Repairs</li>
                    <li>Suspension Repairs</li>
                    <li>Air Conditioning & Heating</li>
                    <li>Radiator & Hose Repairs</li>
                    <li>Mufflers & Exhaust</li>
                    <li>Battery Replacement</li>
                    <li>Transmission & Drive-Train</li>
                    <li>Fuel System Repairs</li>
                    <li>Trailer Installation</li>
                    <li>Electrical</li>
                </ul>
            </div>
            <div className='footer-bottom'>
                <div className='footer-images-container'>
                    <img className="footer-logo" src="/assets/images/md-auto-logo.png" alt="Logo" />
                    <img className="footer-service-center" src="/assets/images/service-center-logo.png" alt="Service Center" />
                </div>
                <div className='nav-book-app'>
                    <a href="https://portdoverservicecentre.mechanicnet.com/apps/shops/display?page=appointment">
                        <div className='calendar-icon-container'>
                            <TbCalendarCheck className='calendar-icon' />
                        </div>
                        <div>
                            Book <br />
                            Appointment
                        </div>
                    </a>
                </div>
                <img className="footer-napa-logo" src="/assets/images/napa-logo.png" alt="Service Center" />
            </div>
        </nav>
    )
}


export default Footer