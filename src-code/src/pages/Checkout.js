import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { Spinner, Alert } from 'react-bootstrap';
import { PaymentForm, CreditCard } from "react-square-web-payments-sdk";
import { PostData } from '../utils/PostData';
import { Collapse } from 'react-bootstrap';
import "../assets/css/checkout.css";

function Checkout() {

    const navigate = useNavigate();
    const shippingForm = useRef();
    const pickupForm = useRef();
    const [openShipping, setOpenShipping] = useState(false);
    const [openPickup, setOpenPickup] = useState(false);
    const [cartItems, setCartItems] = useState(localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : []);
    const [subtotal, setSubtotal] = useState(
        cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    );
    const [hst, setHst] = useState(() => {
        let hstTotal = 0;
        cartItems.forEach((item) => {
            console.log(item.is_taxable);

            if (item.is_taxable) {
                hstTotal += (item.price * 0.13) * item.quantity;
            }
        });
        return hstTotal;
    });

    const [shipping, setShipping] = useState(0);
    const [total, setTotal] = useState(subtotal + hst + shipping);
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    const [proceedToPayment, setProceedToPayment] = useState("Proceed To Payment");
    const proceedToPaymentRef = useRef();
    const [error, setError] = useState(null);
    const [order, setOrder] = useState(null);
    const [stage, setStage] = useState("checkout");
    const [orderId, setOrderId] = useState(null);
    const [orderTotal, setOrderTotal] = useState(null);

    function formatPrice(price) {
        return `$${(price / 100).toFixed(2)}`;
    }

    useEffect(() => {
        // Calculate taxable subtotal
        const taxableSubtotal = cartItems.reduce((acc, item) => {
            if (item.is_taxable) {
                return acc + (item.price * item.quantity);
            }
            return acc;
        }, 0);

        // Calculate HST only on taxable items
        const newHst = Math.round((taxableSubtotal + shipping) * 0.13);

        // Calculate the total
        const newTotal = subtotal + newHst + shipping;

        // Update states
        setHst(newHst);
        setTotal(newTotal);
    }, [cartItems, subtotal, shipping]);

    function handleOpenShipping() {
        setOpenShipping(!openShipping);
        setOpenPickup(false);

        if (!openShipping) {
            setShipping(2000);
        } else {
            setShipping(0);
        }
    }

    function handleOpenPickup() {
        setOpenPickup(!openPickup);
        setOpenShipping(false);
        setShipping(0);
    }

    function validateForm(formData) {
        const data = Object.fromEntries(formData.entries());
        let isValid = true;

        for (const [key, value] of Object.entries(data)) {
            if (!value && key !== "apt") {
                setError(`The field ${key} is required`);
                setProceedToPayment("Proceed To Payment");
                proceedToPaymentRef.current.disabled = false;
                isValid = false;
                break;
            }
        }
        return isValid ? data : null;
    }

    function handleSubmit() {

        setError(null);
        setProceedToPayment(<Spinner animation="border" size="sm" />);
        proceedToPaymentRef.current.disabled = true;

        if (openShipping) {
            const formData = new FormData(shippingForm.current);
            const customer_info = validateForm(formData);
            if (customer_info) {
                sendOrder(customer_info);
            }
        } else if (openPickup) {
            const formData = new FormData(pickupForm.current);
            const customer_info = validateForm(formData);
            if (customer_info) {
                sendOrder(customer_info);
            }
        } else {
            setError("Please select a shipping method");
            proceedToPaymentRef.current.disabled = false;
            setProceedToPayment("Proceed To Payment");
        }
    }

    async function sendOrder(customer_info) {

        const fulfillmentType = openShipping ? 'SHIPMENT' : 'PICKUP';
        customer_info.fulfillmentType = fulfillmentType;

        PostData('create-order.php', { customer_info: customer_info, cart: cartItems })
            .then((response) => {
                if (!response.status) {
                    setError(response.error);
                    setProceedToPayment("Proceed To Payment");
                    proceedToPaymentRef.current.disabled = false;
                } else {

                    setOrderId(response.order_id);
                    setOrderTotal(response.order_total);
                    setStage("payment");
                }
            })
            .catch((error) => {
                setError(error.message);
                proceedToPaymentRef.current.disabled = false;
            });

    }

    const cardTokenizeResponseReceived = (tokenReceived) => {
        if (tokenReceived.status !== "OK") {
            setError(tokenReceived.errors[0].detail);
            return;
        }

        const token = tokenReceived.token;

        PostData('process-payment.php', {
            order_id: orderId,
            token: token,
            order_amount: orderTotal,
        }).then((result) => {
            if (!result.status) {
                setError(result.error);
            } else {
                navigate(`/thankyou/${orderId}`);
            }
        })
    }


    if (stage === "checkout") {
        return (
            <main>
                <Header />
                <center>
                    <section className='checkout-form'>
                        <h1 className='time-regular'>
                            Billing Information
                        </h1>
                        <hr className='w-100' />
                        {/* <div className='checkout-options'>
                            <input
                                type="checkbox"
                                id="shipping"
                                checked={openShipping}
                                onChange={handleOpenShipping}
                            />
                            <label htmlFor="shipping">Shipping + $20.00</label>
                        </div> */}
                        <div className='checkout-options mb-3'>
                            <input
                                type="checkbox"
                                id="pickup"
                                checked={openPickup}
                                onChange={handleOpenPickup}
                            />
                            <label htmlFor="pickup">Pickup</label>
                        </div>
                        {error && <Alert variant="danger" style={{ width: '100%' }}>{error}</Alert>}
                        <Collapse className='shipping-form-info' in={openShipping}>
                            <div id="example-collapse-text">
                                <form className="w-100" id="shipping-form" ref={shippingForm}>
                                    <div className="row">
                                        <div
                                            className="input-container col-6"
                                            id="address-form"
                                        >
                                            <input
                                                required
                                                type="text"
                                                id="first-name"
                                                className="checkout-input"
                                                placeholder="First Name"
                                                name="first-name"
                                                aria-label="First Name"
                                            />
                                        </div>

                                        <div className="input-container col-6">
                                            <input
                                                required
                                                type="text"
                                                id="last-name"
                                                className="checkout-input"
                                                placeholder="Last Name"
                                                name="last-name"
                                                aria-label="Last Name"
                                            />
                                        </div>
                                    </div>

                                    <div className="input-container">
                                        <input
                                            required
                                            type="text"
                                            id="email"
                                            className="checkout-input"
                                            placeholder="Email"
                                            name="email"
                                            aria-label="Email"
                                        />
                                    </div>

                                    <div className="input-container">
                                        <input
                                            required
                                            type="text"
                                            id="phone"
                                            className="checkout-input"
                                            placeholder="Phone"
                                            name="phone"
                                            aria-label="Phone Number"
                                        />
                                    </div>

                                    <div className="input-container">
                                        <input
                                            required
                                            type="text"
                                            id="street"
                                            className="checkout-input"
                                            placeholder="Street"
                                            name="street"
                                            aria-label="Street Address"
                                        />
                                    </div>
                                    <div className="input-container">
                                        <input
                                            type="text"
                                            id="Apt / Suite / Unit"
                                            className="checkout-input"
                                            placeholder="Apt / Suite / Unit (optional)"
                                            name="apt"
                                            aria-label="Apt / Suite / Unit (optional)"
                                        />
                                    </div>
                                    <div className="row">
                                        <div className="input-container col-6">
                                            <input
                                                required
                                                type="text"
                                                id="city"
                                                className="checkout-input"
                                                placeholder="City"
                                                name="city"
                                                aria-label="City"
                                            />
                                        </div>

                                        <div className="input-container col-6">
                                            <select
                                                data-field="country_id"
                                                name="country"
                                                className="checkout-input"
                                                id="country_id"
                                                defaultValue=""
                                                aria-label="Country"
                                            >
                                                <option
                                                    value=""
                                                    disabled=""
                                                >
                                                    Select Country
                                                </option>
                                                <option value="CA">Canada</option>
                                                <option value="US">United States</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="input-container col-6">
                                            <input
                                                required
                                                type="text"
                                                id="postal-code"
                                                className="checkout-input"
                                                placeholder="Postal Code"
                                                name="postal-code"
                                                aria-label="Postal Code"
                                            />
                                        </div>
                                        <div className="input-container col-6">
                                            <input
                                                required
                                                type="text"
                                                id="province"
                                                className="checkout-input"
                                                placeholder="Province/State"
                                                name="province"
                                                aria-label="Province/State"
                                            />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </Collapse>

                        <Collapse in={openPickup}>
                            <div id="example-collapse-text">
                                <form id="pickup-form" ref={pickupForm}>
                                    <div>
                                        <div className="row">
                                            <div
                                                className="input-container col-6"
                                                id="address-form"
                                            >
                                                <input
                                                    required
                                                    type="text"
                                                    id="first-name"
                                                    className="checkout-input"
                                                    placeholder="First Name"
                                                    name="first-name"
                                                    aria-label="First Name"
                                                />
                                            </div>

                                            <div className="input-container col-6">

                                                <input
                                                    required
                                                    type="text"
                                                    id="last-name"
                                                    className="checkout-input"
                                                    placeholder="Last Name"
                                                    name="last-name"
                                                    aria-label="Last Name"
                                                />
                                            </div>
                                        </div>

                                        <div className="input-container">
                                            <input
                                                required
                                                type="text"
                                                id="email"
                                                className="checkout-input"
                                                placeholder="Email"
                                                name="email"
                                                aria-label="Email"
                                            />
                                        </div>

                                        <div className="input-container">
                                            <input
                                                required
                                                type="text"
                                                id="phone"
                                                className="checkout-input"
                                                placeholder="Phone"
                                                name="phone"
                                                aria-label="Phone Number"
                                            />
                                        </div>
                                        <center>
                                            Billing Address
                                        </center>
                                        <hr />
                                        <div className="input-container">
                                            <input
                                                required
                                                type="text"
                                                id="street"
                                                className="checkout-input"
                                                placeholder="Street"
                                                name="street"
                                                aria-label="Street Address"
                                            />
                                        </div>
                                        <div className="input-container">
                                            <input
                                                type="text"
                                                id="Apt / Suite / Unit"
                                                className="checkout-input"
                                                placeholder="Apt / Suite / Unit (optional)"
                                                name="apt"
                                                aria-label="Apt / Suite / Unit (optional)"
                                            />
                                        </div>
                                        <div className="row">
                                            <div className="input-container col-6">
                                                <input
                                                    required
                                                    type="text"
                                                    id="city"
                                                    className="checkout-input"
                                                    placeholder="City"
                                                    name="city"
                                                    aria-label="City"
                                                />
                                            </div>

                                            <div className="input-container col-6">
                                                <select
                                                    data-field="country_id"
                                                    name="country"
                                                    className="checkout-input"
                                                    id="country_id"
                                                    defaultValue=""
                                                    aria-label="Country"
                                                >
                                                    <option
                                                        value=""
                                                        disabled=""
                                                    >
                                                        Select Country
                                                    </option>
                                                    <option value="">Select a country</option>
                                                    <option value="CA">Canada</option>
                                                    <option value="US">United States</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="input-container col-6">
                                                <input
                                                    required
                                                    type="text"
                                                    id="postal-code"
                                                    className="checkout-input"
                                                    placeholder="Postal Code"
                                                    name="postal-code"
                                                    aria-label="Postal Code"
                                                />
                                            </div>
                                            <div className="input-container col-6">
                                                <input
                                                    required
                                                    type="text"
                                                    id="province"
                                                    className="checkout-input"
                                                    placeholder="Province/State"
                                                    name="province"
                                                    aria-label="Province/State"
                                                />
                                            </div>
                                            <div className="input-container">
                                                <label
                                                    className="checkout-label"
                                                    htmlFor="pickup-date"
                                                >
                                                    Pick Up Data:
                                                </label>
                                                <input
                                                    required
                                                    id="pickup-date"
                                                    className="checkout-input mb-3"
                                                    type="date"
                                                    name="pickup-date"
                                                    min={formattedToday}
                                                    aria-label="Pick Up Date"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </Collapse>

                    </section>
                    <section className='checkout-cart-total'>
                        <div className='checkout-prices'>
                            <div>SubTotal:</div>
                            <div>{formatPrice(subtotal)}</div>
                        </div>
                        <hr />
                        <div className='checkout-prices'>
                            <div>HST:</div>
                            <div>{formatPrice(hst)}</div>
                        </div>
                        <div className='checkout-prices'>
                            <div>Shipping:</div>
                            <div>{formatPrice(shipping)}</div>
                        </div>
                        <hr />
                        <div className='checkout-prices'>
                            <div>Total:</div>
                            <div>{formatPrice(total)}</div>
                        </div>
                    </section>
                    <center>
                        <button className='proceed-to-payment-btn my-3' ref={proceedToPaymentRef} onClick={handleSubmit}>{proceedToPayment}</button>
                    </center>
                </center>
                <Footer />
            </main>
        );
    } else if (stage === "payment") {
        return (
            <main>
                <Header />
                <center>
                    <section className='checkout-form'>
                        <h1 className='time-regular'>
                            Payment
                        </h1>
                        <hr className='w-100' />

                        {/* Production: sq0idp-04Q7ksf5V5bFIo4cR1mJlg */}
                        {/* Sandbox: sandbox-sq0idb-yaQ8IUhCq3WnVXDqRLCV4A */}
                        {/* Production: LF85JM2RFQ48Y */}
                        {/* Sandbox: LZSNQVTYG0CP7 */}
                        <PaymentForm className="payment-form" applicationId='sq0idp-04Q7ksf5V5bFIo4cR1mJlg' locationId='LF85JM2RFQ48Y' cardTokenizeResponseReceived={cardTokenizeResponseReceived}>
                            <CreditCard />
                        </PaymentForm>

                        <section className='checkout-cart-total'>
                            <div className='checkout-prices'>
                                <div>SubTotal:</div>
                                <div>{formatPrice(subtotal)}</div>
                            </div>
                            <hr />
                            <div className='checkout-prices'>
                                <div>HST:</div>
                                <div>{formatPrice(hst)}</div>
                            </div>
                            <div className='checkout-prices'>
                                <div>Shipping:</div>
                                <div>{formatPrice(shipping)}</div>
                            </div>
                            <hr />
                            <div className='checkout-prices'>
                                <div>Total:</div>
                                <div>{formatPrice(total)}</div>
                            </div>
                        </section>
                    </section>
                </center>
                <Footer />
            </main>
        )
    }
}

export default Checkout;
