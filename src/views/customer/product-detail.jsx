/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */
import React, { Fragment, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

import Header from "./components/header";
import Sidebar from "./components/sidebar";
import Cart from "./components/cart";
import Footer from "./components/footer";
import request from "../../utils/request";
import ScriptManager from "../../utils/ScriptManager";
import {customerScripts} from "../../App";

function ProductDetail() {
    const navigate = useNavigate();
    const productId = sessionStorage.getItem("productId");
    const cartRef = useRef(null);
    const wrapperCartRef = useRef(null);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDetailId, setSelectedDetailId] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (!productId) {
            console.error("Product id là undefined không tồn tại");
            navigate('/product');
            return;
        }

        const fetchProduct = async () => {
            try {
                const response = await request.get(`/product/${productId}`);
                setProduct(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching product data:", error);
                setError("Failed to load product data");
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId, navigate]);

    const handleSelectProductDetail = (e) => {
        setSelectedDetailId(e.target.value);
    };

    const handleQuantityChange = (e) => {
        const newQuantity = Math.max(1, Number(e.target.value));
        setQuantity(newQuantity);
    };

    const incrementQuantity = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    const decrementQuantity = () => {
        setQuantity(prevQuantity => Math.max(1, prevQuantity - 1));
    };

    const handleAddToCart = async (e) => {
        e.preventDefault();
        const token_type = localStorage.getItem("token_type");
        const access_token = localStorage.getItem("access_token");
        request.defaults.headers.common["Authorization"] = `${token_type} ${access_token}`;

        if (!selectedDetailId || quantity < 1) {
            alert("Please select a product detail and enter a valid quantity.");
            return;
        }

        try {
            const response = await request.post("add-to-cart", [{
                product_detail_id: selectedDetailId,
                quantity: quantity
            }]);
            console.log(response);
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!product) {
        return <div>Product not found</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <Fragment>
            <Header cartRef={cartRef} />
            <Sidebar />
            <Cart wrapperCartRef={wrapperCartRef} />
            {/* Content */}
            <section
                className="bg-img1 txt-center p-lr-15 p-tb-92"
                style={{
                    backgroundImage: 'url("assets/customer/images/bg-01.jpg")',
                }}
            >
                <h2 className="ltext-105 cl0 txt-center">SẢN PHẨM</h2>
            </section>
            <>
                {/* breadcrumb */}
                <div className="container">
                    <div className="bread-crumb flex-w p-l-25 p-r-15 p-t-30 p-lr-0-lg">
                        <Link
                            to="/"
                            className="stext-109 cl8 hov-cl1 trans-04"
                        >
                            Home
                            <i
                                className="fa fa-angle-right m-l-9 m-r-10"
                                aria-hidden="true"
                            />
                        </Link>
                        <Link
                            to="/product"
                            className="stext-109 cl8 hov-cl1 trans-04"
                        >
                            {product.category.category_name}
                            <i
                                className="fa fa-angle-right m-l-9 m-r-10"
                                aria-hidden="true"
                            />
                        </Link>
                        <span className="stext-109 cl4">
                            {product.product_name}
                        </span>
                    </div>
                </div>
                {/* Product Detail */}
                <section className="sec-product-detail bg0 p-t-65 p-b-60">
                    <div className="container">
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
                                                        className="flex-c-m size-108 hov-btn3 trans-04"
                                                        href={`http://127.0.0.1:8000/uploads/product/${product.image}`}
                                                    >
                                                        {/* <i className="fa fa-expand" /> */}
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
                                    {/*  */}
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
                                                        onChange={handleSelectProductDetail}
                                                    >
                                                        <option>
                                                            Chọn
                                                        </option>
                                                        {product.product_details.map(
                                                            (detail) => (
                                                                <option
                                                                    key={
                                                                        detail
                                                                            .product_detail_id
                                                                    }
                                                                    value={
                                                                        detail
                                                                            .product_detail_id
                                                                    }
                                                                >
                                                                    Màu: {
                                                                        detail
                                                                            .color
                                                                            .color
                                                                    }
                                                                    --  
                                                                    Kích cỡ: {
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
                                                    <div className="btn-num-product-down cl8 hov-btn3 trans-04 flex-c-m" onClick={decrementQuantity}>
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
                                                    <div className="btn-num-product-up cl8 hov-btn3 trans-04 flex-c-m" onClick={incrementQuantity}>
                                                        <i className="fs-16 zmdi zmdi-plus" />
                                                    </div>
                                                </div>
                                                <Button
                                                    className="flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn1 p-lr-15 trans-04 js-addcart-detail"
                                                    onClick={handleAddToCart}
                                                >
                                                    Thêm vào giỏ hàng
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    {/*  */}
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
                </section>
            </>
            {/* Footer */}
            <Footer />
            {/* Back to top */}
            <div className="btn-back-to-top" id="myBtn">
                <span className="symbol-btn-back-to-top">
                    <i className="zmdi zmdi-chevron-up" />
                </span>
            </div>
            <ScriptManager urls={customerScripts} idPrefix="customer" />
        </Fragment>
    );
}

export default ProductDetail;
