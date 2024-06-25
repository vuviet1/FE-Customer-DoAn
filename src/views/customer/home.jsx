/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */
import React, { Fragment, useState, useEffect } from "react";
import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import Cart from "./components/cart";
import Slider from "./components/slider";
import Banner from "./components/banner";
import Footer from "./components/footer";
import ProductModal from "./components/modal";
import request from "../../utils/request";

function Home() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleProductClick = (productId) => {
        // Lưu productId vào session storage
        sessionStorage.setItem("productId", productId);
        window.location.href = `/product-detail`;
    };

    const handleQuickView = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
        sessionStorage.setItem("productId", product.product_id);
    };

    useEffect(() => {
        const fetchProduct = async (retryCount = 0) => {
            try {
                // Product
                const response = await request.get("product");
                setProducts(response.data.data);
            } catch (error) {
                if (
                    error.response &&
                    error.response.status === 429 &&
                    retryCount < 3
                ) {
                    setTimeout(() => fetchProduct(retryCount + 1), 2000); // Retry after 2 seconds
                } else {
                    console.error("Error fetching data:", error);
                }
            }
        };

        fetchProduct();
    }, []);

    return (
        <Fragment>
            <Header />
            <Sidebar />
            <Cart />
            <Slider />
            <Banner />
            {/* Content */}
            <section className="bg0 p-t-23 p-b-130">
                <div className="container">
                    <div className="p-b-10">
                        <h3 className="ltext-103 cl5">Sản phẩm bán chạy</h3>
                    </div>
                    <div
                        className="row isotope-grid"
                        style={{ minHeight: "450px", position: "relative" }}
                        display="flex"
                        flexwrap="wrap"
                    >
                        {products.map((product) => (
                            <div
                                key={product.product_id}
                                className="col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item"
                            >
                                <div className="block2">
                                    <div
                                        className="block2-pic hov-img0"
                                        style={{ height: "300px" }}
                                    >
                                        <Image
                                            src={
                                                "http://127.0.0.1:8000/uploads/product/" +
                                                product.image
                                            }
                                            style={{
                                                height: "300px",
                                                width: "300px",
                                            }}
                                            alt="IMG-PRODUCT"
                                        />
                                        <Link
                                            className="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04 js-show-modal1"
                                            onClick={() =>
                                                handleQuickView(product)
                                            }
                                        >
                                            Xem nhanh
                                        </Link>
                                    </div>
                                    <div className="block2-txt flex-w flex-t p-t-14">
                                        <div className="block2-txt-child1 flex-col-l ">
                                            <Link
                                                key={product.product_id}
                                                onClick={() =>
                                                    handleProductClick(
                                                        product.product_id
                                                    )
                                                }
                                                className="stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6"
                                            >
                                                {product.product_name}
                                            </Link>
                                            <span className="stext-105 cl3">
                                                {product.price} VNĐ
                                            </span>
                                        </div>
                                        <div className="block2-txt-child2 flex-r p-t-3">
                                            <a
                                                href="#"
                                                className="btn-addwish-b2 dis-block pos-relative js-addwish-b2"
                                            >
                                                <img
                                                    className="icon-heart1 dis-block trans-04"
                                                    src="assets/customer/images/icons/icon-heart-01.png"
                                                    alt="ICON"
                                                />
                                                <img
                                                    className="icon-heart2 dis-block trans-04 ab-t-l"
                                                    src="assets/customer/images/icons/icon-heart-02.png"
                                                    alt="ICON"
                                                />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            {/* End Content */}
            <Footer />
            {selectedProduct && (
                <ProductModal
                    showModal={showModal}
                    handleClose={() => setShowModal(false)}
                    product={selectedProduct}
                />
            )}
        </Fragment>
    );
}

export default Home;
