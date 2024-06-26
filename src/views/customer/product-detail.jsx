/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";

import Header from "./components/header";
import Sidebar from "./components/sidebar";
import Cart from "./components/cart";
import Footer from "./components/footer";
import request from "../../utils/request";
import { getErrorMessage } from "../../utils/errorMessages";

import ScriptManager from "../../utils/ScriptManager";
import { customerScripts } from "../../App";

function ProductDetail() {
    const navigate = useNavigate();
    const productId = sessionStorage.getItem("productId");

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDetailId, setSelectedDetailId] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (!productId) {
            console.error("Product id là undefined không tồn tại");
            navigate("/product");
            return;
        }

        const fetchProduct = async () => {
            try {
                const response = await request.get(`/product/${productId}`);
                setProduct(response.data.data);
                setLoading(false);
            } catch (error) {
                let errorMessage = "Hiển thị sản phẩm thất bại: ";
                if (error.response && error.response.status) {
                    errorMessage += getErrorMessage(error.response.status);
                } else {
                    errorMessage += error.message;
                }
                toast.error(errorMessage, { position: "top-right" });
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
        setQuantity((prevQuantity) => prevQuantity + 1);
    };

    const decrementQuantity = () => {
        setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1));
    };

    const handleAddToCart = async (e) => {
        e.preventDefault();
        const token_type = localStorage.getItem("token_type");
        const access_token = localStorage.getItem("access_token");
        
        if (!selectedDetailId || quantity < 1) {
            toast.error("Hãy chọn phân loại sản phẩm và số lượng hợp lệ.", {
                position: "top-right"
            });
            return;
        }
    
        try {
            request.defaults.headers.common[
                "Authorization"
            ] = `${token_type} ${access_token}`;
            await request.post("add-to-cart", [
                {
                    product_detail_id: Number(selectedDetailId),
                    quantity: quantity,
                },
            ]);
            toast.success("Thêm sản phẩm vào giỏ hàng thành công!", {
                position: "top-right"
            });
        } catch (error) {
            let errorMessage = "Thêm sản phẩm vào giỏ hàng thất bại: ";
            if (error.response && error.response.status) {
                errorMessage += getErrorMessage(error.response.status);
            } else {
                errorMessage += error.message;
            }
            toast.error(errorMessage, {
                position: "top-right"
            });
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
            <ToastContainer />
            <Header />
            <Sidebar />
            <Cart />
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
                        <Link to="/" className="stext-109 cl8 hov-cl1 trans-04">
                            Home
                            <i
                                className="fa fa-angle-right m-l-9 m-r-10"
                                aria-hidden="true"
                            />
                        </Link>
                        <span className="stext-109 cl8 hov-cl1 trans-04">
                            {product.category.category_name}
                            <i
                                className="fa fa-angle-right m-l-9 m-r-10"
                                aria-hidden="true"
                            />
                        </span>
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
                                                <Form.Select
                                                    className="form-select"
                                                    onChange={
                                                        handleSelectProductDetail
                                                    }
                                                >
                                                    <option value="">
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
                                                                    detail.color
                                                                        .color
                                                                }{" "}
                                                                -- Kích cỡ:{" "}
                                                                {
                                                                    detail.size
                                                                        .size
                                                                }
                                                            </option>
                                                        )
                                                    )}
                                                </Form.Select>
                                                <div className="select-dropdown" />
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
                                                data-tooltip="Thêm vào yêu thích"
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
