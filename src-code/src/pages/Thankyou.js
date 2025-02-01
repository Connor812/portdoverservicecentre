import React from 'react';
import { useParams } from 'react-router-dom';
import { FaCopy } from "react-icons/fa";
import Header from '../components/Header';
import '../assets/css/thankyou.css';

function Thankyou() {
    const { id } = useParams();

    localStorage.removeItem('cart');

    const copyToClipboard = () => {
        navigator.clipboard.writeText(id)
            .then(() => {
                alert("Order ID copied to clipboard!");
            })
            .catch(() => {
                alert("Failed to copy Order ID. Please try again.");
            });
    };

    return (
        <main className='thankyou-wrapper'>
            <Header />
            <div className='center-thankyou-text'>
                <center className='thankyou-container'>
                    <h1>Thank You For Your Order!</h1>
                    <button className="copy-order-id-btn" onClick={copyToClipboard}>
                        <p>Your Order Number Is <strong>{id}</strong>
                            <FaCopy />
                        </p>
                    </button>
                </center>
            </div>
        </main >
    );
}

export default Thankyou;
