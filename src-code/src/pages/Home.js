import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PostData } from '../utils/PostData';
import { Row, Col, Modal, Button, Alert, Spinner } from 'react-bootstrap';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { MdOutlineArrowBackIos } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";
import "../assets/css/home.css";

function Home() {
    const [items, setItems] = useState([]);
    const [itemsError, setItemsError] = useState(null);
    const [itemsLoading, setItemsLoading] = useState(true);
    const productsContainerRef = useRef(null); // Ref to access the products container
    const [show, setShow] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [modalError, setModalError] = useState('');
    const [modalSuccess, setModalSuccess] = useState('');
    const [modalSubmitBtn, setModalSubmitBtn] = useState("Submit");
    const modalSubmitBtnRef = useRef(null);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function handleModalSubmit() {

        setModalError('');
        setModalSuccess('');
        setModalSubmitBtn(<Spinner></Spinner>);
        modalSubmitBtnRef.current.disabled = true;

        if (!name) {
            setModalError("Please enter your name.");
            resetSubmitBtn();
            return;
        }
        if (!email) {
            setModalError("Please enter your email.");
            resetSubmitBtn();
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setModalError("Please enter a valid email.");
            resetSubmitBtn();
            return;
        }

        PostData('add-email.php', { name, email })
            .then((result) => {
                if (!result.status) {
                    setModalError(result.error);
                    resetSubmitBtn();
                } else {
                    setModalSuccess(result.message);
                    resetSubmitBtn();
                }
            })
            .catch((error) => {
                console.error("Error in handleModalSubmit:", error);
                setModalError("Network Error. Please Try Again.");
                resetSubmitBtn();
            });

    }

    function resetSubmitBtn() {
        setModalSubmitBtn("Submit");
        modalSubmitBtnRef.current.disabled = false;
    }

    useEffect(() => {
        setTimeout(() => {
            handleShow();
        }, 1000);
    }, []);

    useEffect(() => {
        PostData('get-all-products.php', {})
            .then((result) => {
                if (!result.status) {
                    setItemsError(result.message);
                }
                setItems(result.data);
                setItemsLoading(false);
            })
            .catch((error) => {
                console.error("Error in Home useEffect:", error);
                setItemsError("Network Error. Please Try Again.");
                setItemsLoading(false);
            });
    }, []);

    const scrollProducts = (direction) => {
        const container = productsContainerRef.current;
        if (container) {
            const scrollAmount = 300; // Amount to scroll
            container.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
        }
    };

    return (
        <>
            <Header />
            <center style={{ flex: '1' }}>
                <main className='home-main'>
                    <p className='home-message'>
                        "We have been the local garage in Port Dover since 1994
                        <br /> helping generations of our neighbors with reliable service."
                    </p>

                    <div className='list-of-services-wrapper'>
                        <img className='home-page-img' src="/assets/images/garage.png" alt="garage" />
                    </div>

                    <div className='advertisement-container'>
                        <img className="home-img" src="/assets/images/home-img.png" alt="Rank #1 customer satisfaction and winter tires" />
                    </div>

                    <div className='product-banner'>
                        GIANT WHEEL RIM SALE
                    </div>

                    <div className='square-items-wrapper'>
                        <Row className='products-container' ref={productsContainerRef}>
                            {itemsLoading ? (
                                <p>Loading products...</p>
                            ) : itemsError ? (
                                <p className='error-message'>{itemsError}</p>
                            ) : (
                                items.map((item, index) => (
                                    <Col lg={3} md={4} sm={6}
                                        key={index}
                                    >
                                        <div
                                            className="square-item"
                                            style={{
                                                backgroundImage: `url(${item.images && item.images.length > 0 ? item.images[0].url : "/assets/images/placeholder.png"
                                                    })`,
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                            }}>
                                            <div className='square-item-name'>
                                                {item.name || "Square Item"}
                                            </div>
                                            <Link to={`/product/${item.id}`} className="buy-button">View</Link>
                                        </div>
                                    </Col>
                                ))
                            )}
                        </Row>
                    </div>
                </main>
            </center>
            <Modal show={show} onHide={handleClose} centered className='home-signup-modal'>
                <Modal.Header closeButton>
                    <Modal.Title></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <center>
                        <h1>Welcome to our new website </h1>
                        <p>
                            If you would like to get updates on specials and contests please leave your name and  email
                        </p>
                        {modalError && (
                            <Alert variant='danger'>
                                {modalError}
                            </Alert>
                        )}
                        {modalSuccess && (
                            <Alert variant='success'>
                                {modalSuccess}
                            </Alert>
                        )}
                        <input type="text" className='form-control' placeholder='Name' onChange={(e) => setName(e.target.value)} />
                        <br />
                        <input type="text" className='form-control' placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
                        <br />
                        <button className='modal-signup-btn' ref={modalSubmitBtnRef} onClick={() => handleModalSubmit()}>{modalSubmitBtn}</button>
                        <p>You can unsubscribe at any time</p>
                    </center>
                </Modal.Body>
            </Modal>
            <Footer />
        </>
    );
}

export default Home;
