/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, Fragment } from "react";
import { Modal, Button } from "react-bootstrap";
import request from "../../../utils/request";

const ProductModal = ({ showModal, handleClose, product }) => {
    const [productDetails, setProductDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDetailId, setSelectedDetailId] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await request.get(
                    `/product/${product.product_id}`
                );
                setProductDetails(response.data.data.product_details);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching product details:", error);
                setError("Failed to load product details");
                setLoading(false);
            }
        };

        if (product && showModal) {
            fetchProductDetails();
        }
    }, [product, showModal]);

    const handleSelectProductDetail = (e) => {
        setSelectedDetailId(e.target.value);
    };

    const handleQuantityChange = (e) => {
        const newQuantity = Math.max(1, Number(e.target.value));
        setQuantity(newQuantity);
    };

    const incrementQuantity = () => {
        setQuantity((prevQuantity) => prevQuantity + 1);
    };

    const decrementQuantity = () => {
        setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1));
    };

    const handleAddToCart = async (e) => {
        e.preventDefault();
        const token_type = localStorage.getItem("token_type");
        const access_token = localStorage.getItem("access_token");
        request.defaults.headers.common[
            "Authorization"
        ] = `${token_type} ${access_token}`;

        if (!selectedDetailId || quantity < 1) {
            alert("Please select a product detail and enter a valid quantity.");
            return;
        }

        try {
            const response = await request.post("add-to-cart", {
                product_detail_id: Number(selectedDetailId),
                quantity: quantity,
            });
            console.log("Add to cart response:", response);
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Failed to add item to cart. Please try again.");
        }
    };

    return (
        <Fragment>
            {/* <Modal show={showModal} onHide={handleClose} size="xl">
                <div className="wrap-modal1 js-modal1 p-t-60 p-b-20">
                    <div className="overlay-modal1 js-hide-modal1" />
                    <div className="container">
                        <div className="bg0 p-t-60 p-b-30 p-lr-15-lg how-pos3-parent">
                            <button className="how-pos3 hov3 trans-04 js-hide-modal1">
                                <img
                                    src="assets/customer/images/icons/icon-close.png"
                                    alt="CLOSE"
                                />
                            </button>
                            <div className="row">
                                <div className="col-md-6 col-lg-7 p-b-30">
                                    <div className="p-l-25 p-r-30 p-lr-0-lg">
                                        <div className="wrap-slick3 flex-sb flex-w">
                                            <div className="wrap-slick3-dots" />
                                            <div className="wrap-slick3-arrows flex-sb-m flex-w" />
                                            <div className="slick3 gallery-lb">
                                                <div
                                                    className="item-slick3"
                                                    data-thumb={`http://127.0.0.1:8000/uploads/product/${product.image}`}
                                                >
                                                    <div className="wrap-pic-w pos-relative">
                                                        <img
                                                            src={`http://127.0.0.1:8000/uploads/product/${product.image}`}
                                                            alt="IMG-PRODUCT"
                                                        />
                                                        <a
                                                            className="flex-c-m size-108 how-pos1 bor0 fs-16 cl10 bg0 hov-btn3 trans-04"
                                                            href={`http://127.0.0.1:8000/uploads/product/${product.image}`}
                                                        >
                                                            <i className="fa fa-expand" />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-5 p-b-30">
                                    <div className="p-r-50 p-t-5 p-lr-0-lg">
                                        <h4 className="mtext-105 cl2 js-name-detail p-b-14">
                                            {product.product_name}
                                        </h4>
                                        <span className="mtext-106 cl2">
                                            {product.price} VNĐ
                                        </span>
                                        <p className="stext-102 cl3 p-t-23">
                                            {product.description}
                                        </p>
                                        <div className="p-t-33">
                                            <div className="flex-w flex-r-m p-b-10">
                                                <div className="size-203 flex-c-m respon6">
                                                    Các loại sản phẩm
                                                </div>
                                                <div className="size-204 respon6-next">
                                                    <div className="rs1-select2 bor8 bg0">
                                                        <select
                                                            className="js-select2"
                                                            name="color"
                                                            onChange={
                                                                handleSelectProductDetail
                                                            }
                                                        >
                                                            <option>
                                                                Chọn
                                                            </option>
                                                            {product.product_details.map(
                                                                (detail) => (
                                                                    <option
                                                                        key={
                                                                            detail.product_detail_id
                                                                        }
                                                                        value={
                                                                            detail.product_detail_id
                                                                        }
                                                                    >
                                                                        Màu:{" "}
                                                                        {
                                                                            detail
                                                                                .color
                                                                                .color
                                                                        }
                                                                        -- Kích
                                                                        cỡ:{" "}
                                                                        {
                                                                            detail
                                                                                .size
                                                                                .size
                                                                        }
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                        <div className="dropDownSelect2" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-w flex-r-m p-b-10">
                                                <div className="size-204 flex-w flex-m respon6-next">
                                                    <div className="wrap-num-product flex-w m-r-20 m-tb-10">
                                                        <div
                                                            className="btn-num-product-down cl8 hov-btn3 trans-04 flex-c-m"
                                                            onClick={
                                                                decrementQuantity
                                                            }
                                                        >
                                                            <i className="fs-16 zmdi zmdi-minus" />
                                                        </div>
                                                        <input
                                                            className="mtext-104 cl3 txt-center num-product"
                                                            type="number"
                                                            name="num-product"
                                                            value={quantity}
                                                            onChange={
                                                                handleQuantityChange
                                                            }
                                                            min={1}
                                                        />
                                                        <div
                                                            className="btn-num-product-up cl8 hov-btn3 trans-04 flex-c-m"
                                                            onClick={
                                                                incrementQuantity
                                                            }
                                                        >
                                                            <i className="fs-16 zmdi zmdi-plus" />
                                                        </div>
                                                    </div>
                                                    <Button
                                                        className="flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn1 p-lr-15 trans-04 js-addcart-detail"
                                                        onClick={
                                                            handleAddToCart
                                                        }
                                                    >
                                                        Thêm vào giỏ hàng
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-w flex-m p-l-100 p-t-40 respon7">
                                            <div className="flex-m bor9 p-r-10 m-r-11">
                                                <a
                                                    href="#"
                                                    className="fs-14 cl3 hov-cl1 trans-04 lh-10 p-lr-5 p-tb-2 js-addwish-detail tooltip100"
                                                    data-tooltip="Add to Wishlist"
                                                >
                                                    <i className="zmdi zmdi-favorite" />
                                                </a>
                                            </div>
                                            <a
                                                href="#"
                                                className="fs-14 cl3 hov-cl1 trans-04 lh-10 p-lr-5 p-tb-2 tooltip100"
                                                data-tooltip="Facebook"
                                            >
                                                <i className="fa fa-facebook" />
                                            </a>
                                            <a
                                                href="#"
                                                className="fs-14 cl3 hov-cl1 trans-04 lh-10 p-lr-5 p-tb-2 tooltip100"
                                                data-tooltip="Twitter"
                                            >
                                                <i className="fa fa-twitter" />
                                            </a>
                                            <a
                                                href="#"
                                                className="fs-14 cl3 hov-cl1 trans-04 lh-10 p-lr-5 p-tb-2 tooltip100"
                                                data-tooltip="Google Plus"
                                            >
                                                <i className="fa fa-google-plus" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal> */}

            <Modal show={showModal} onHide={handleClose} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>{product.product_name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loading && <div className="text-center">Loading...</div>}
                    {!loading && !error && (
                        <div className="row">
                            <div className="col-md-6" style={{ display: "flex", justifyContent: "center" }}>
                                <img
                                    src={`http://127.0.0.1:8000/uploads/product/${product.image}`}
                                    alt="Product"
                                    className="img-fluid rounded"
                                />
                            </div>
                            <div className="col-md-6">
                                <p className="text-muted">
                                    Giá sản phẩm: {product.price} VNĐ
                                </p>
                                <p>{product.description}</p>
                                <div className="form-group">
                                    <label htmlFor="productDetail">
                                        Chọn sản phẩm:
                                    </label>
                                    <select
                                        id="productDetail"
                                        className="form-control"
                                        onChange={handleSelectProductDetail}
                                    >
                                        <option value="">Chọn sản phẩm...</option>
                                        {productDetails.map((detail) => (
                                            <option
                                                key={detail.product_detail_id}
                                                value={detail.product_detail_id}
                                            >
                                                Màu sắc: {detail.color.color} -{" "}
                                                Kích cỡ: {detail.size.size}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="wrap-num-product flex-w m-r-20 m-tb-10">
                                    <div
                                        className="btn-num-product-down cl8 hov-btn3 trans-04 flex-c-m"
                                        onClick={decrementQuantity}
                                    >
                                        <i className="fs-16 zmdi zmdi-minus" />
                                    </div>
                                    <input
                                        className="mtext-104 cl3 txt-center num-product"
                                        type="number"
                                        name="num-product"
                                        value={quantity}
                                        onChange={handleQuantityChange}
                                        min={1}
                                    />
                                    <div
                                        className="btn-num-product-up cl8 hov-btn3 trans-04 flex-c-m"
                                        onClick={incrementQuantity}
                                    >
                                        <i className="fs-16 zmdi zmdi-plus" />
                                    </div>
                                </div>
                                <Button
                                    className="flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn1 p-lr-15 trans-04 js-addcart-detail"
                                    variant="primary"
                                    onClick={handleAddToCart}
                                    disabled={!selectedDetailId || quantity < 1}
                                >
                                    Thêm vào giỏ hàng
                                </Button>
                            </div>
                        </div>
                    )}
                    {error && <div className="text-danger mt-3">{error}</div>}
                </Modal.Body>
            </Modal>
        </Fragment>
    );
};

export default ProductModal;
