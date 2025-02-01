import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import { Col, Row, Spinner, DropdownButton, Dropdown } from "react-bootstrap";
import { TiArrowLeftThick } from "react-icons/ti";
import { PostData } from "../utils/PostData";
import { AddToCart } from "../utils/AddToCart";
import { BsCartCheck } from "react-icons/bs";
import "../assets/css/display-product.css";

function Product() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectVariation, setSelectVariation] = useState("Select Variation");
    const [quantity, setQuantity] = useState(1);
    const [subTotal, setSubTotal] = useState(0);
    const [addToCartBtn, setAddToCartBtn] = useState("Add To Cart");

    const [activeVariation, setActiveVariation] = useState(null);

    useEffect(() => {
        setLoading(true);
        PostData('get-product-by-id.php', { product_id: id })
            .then((result) => {
                if (!result.status) {
                    setError(result.error);
                    setLoading(false);
                    return;
                }


                if (result.data) {
                    setProduct(result.data[0]);
                    setActiveVariation(result.data[0].item_variations[0]);
                    setSubTotal(result.data[0].item_variations[0].price);
                } else {
                    setError("No product data found");
                }

                setLoading(false);
            })
            .catch((err) => {
                setError(err.message || "Something went wrong.");
                setLoading(false);
            });
    }, [id]);

    function handleChangeVariation(variation) {
        setActiveVariation(variation);
        setSelectVariation(variation.name);
        setQuantity(1);
        setSubTotal(variation.price);
    }

    function handleChangeQuantity(quantity) {
        setQuantity(quantity);
        setSubTotal(activeVariation.price * quantity);
    }

    function formatPrice(price) {
        return `$${(price / 100).toFixed(2)}`;
    }

    function addToCart() {

        const image = product.images && product.images.length > 0
            ? product.images[0].url
            : "https://via.placeholder.com/150";

        AddToCart(
            activeVariation.id,
            product.name,
            activeVariation.price,
            quantity,
            activeVariation.sku,
            image,
            activeVariation.name,
            product.is_taxable
        );

        // Update the button state
        setAddToCartBtn(<BsCartCheck />);
        setTimeout(() => {
            setAddToCartBtn("Add To Cart");
        }, 2000);
    }

    return (
        <>
            <Header />
            <main className="display-product-wrapper">
                {loading ? (
                    <section className='loading'>
                        <Spinner animation="border" />
                    </section>
                ) : error ? (
                    <section className='loading'>
                        <p>Error: {error}</p>
                    </section>
                ) : product ? (  // Only display product details if product is not null
                    <section className="product-information">
                        <Link to="/" className="back">
                            <TiArrowLeftThick />Back
                        </Link>
                        <Row>
                            <Col className="product-img-container">
                                <img
                                    src={product?.images?.length > 0
                                        ? product.images[0].url
                                        : "/assets/images/product-1.png"} // Fallback placeholder image
                                    alt={product?.name || "Default product image"}
                                    className="display-product-img"
                                />
                            </Col>
                            <Col className="display-product-info">
                                <h2>{product?.name || "No Name"}</h2>
                                <div className="d-flex align-items-center gap-5 mb-2">
                                    <h5 className="m-0">Price: {formatPrice(activeVariation?.price)}</h5>

                                    {product.item_variations.length > 1 && (
                                        <DropdownButton
                                            id={`dropdown-button-drop`}
                                            variant="secondary"
                                            title={selectVariation}
                                            className="product-variation-dropdown"
                                        >
                                            {product.item_variations.map((variation, index) => {
                                                return (
                                                    <Dropdown.Item key={index} onClick={() => handleChangeVariation(variation)}>
                                                        {variation.name}
                                                    </Dropdown.Item>
                                                );
                                            })}
                                        </DropdownButton>
                                    )}
                                </div>
                                <p>{product?.description || "No description available"}</p>
                            </Col>
                        </Row>

                        <h4>Product Details</h4>
                        <hr />
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <label className="mx-3" htmlFor="quantity">Quantity</label>
                                <input id="quantity" type="number" min={1} onChange={(e) => handleChangeQuantity(e.target.value)} value={quantity} placeholder="1" style={{ width: "100px" }} />
                            </div>
                            <div>{formatPrice(subTotal || 0)}</div>
                            <div>
                                <button className="add-to-cart-btn" onClick={() => addToCart()}>{addToCartBtn}</button>
                            </div>
                        </div>
                    </section>
                ) : (
                    <section className="loading">
                        <p>No product data found.</p>
                    </section>
                )}
            </main >
        </>
    );
}

export default Product;
