/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */
import React, { Fragment, useState, useEffect } from "react";
import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import Header from "./components/header";
import Sidebar from "./components/sidebar";
import Cart from "./components/cart";
import Slider from "./components/slider";
import Banner from "./components/banner";
import Footer from "./components/footer";
import ProductModal from "./components/modal";
import request from "../../utils/request";
import FavoriteButton from "./components/FavoriteButton";

function Home() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchData = async () => {
        try {
            // Sản phẩm mới nhất
            const response = await request.get("product");
            const latestProducts = response.data.data.slice(0, 4);
            setProducts(latestProducts);
        } catch (error) {
            toast.error("Lấy dữ liệu thất bại.", {
                position: "top-right",
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleProductClick = (productId) => {
        sessionStorage.setItem("productId", productId);
        window.location.href = `/product-detail`;
    };

    const handleQuickView = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
        sessionStorage.setItem("productId", product.product_id);
    };

    return (
        <Fragment>
            <ToastContainer />
            <Header />
            <Sidebar />
            <Cart />
            <Slider />
            <Banner />
            {/* Content */}
            <section className="bg0 p-t-23 p-b-130">
                <div className="container">
                    <div className="p-b-10">
                        <h3
                            className="ltext-103 cl5"
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            Sản phẩm mới nhất
                        </h3>
                    </div>
                    <div
                        className="row isotope-grid"
                        style={{
                            minHeight: "450px",
                            position: "relative",
                            marginTop: "30px",
                        }}
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
                                        {!product.discount ||
                                            (product.discount !== 0 && (
                                                <span className="discount-badge">
                                                    {product.discount}% Off
                                                </span>
                                            ))}
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
                                            {!product.discount ? (
                                                <span className="discounted-price">
                                                    {product.price.toLocaleString(
                                                        "vi-VN",
                                                        {
                                                            style: "currency",
                                                            currency: "VND",
                                                        }
                                                    )}
                                                </span>
                                            ) : (
                                                <div className="price-container">
                                                    <span className="original-price">
                                                        {product.price.toLocaleString(
                                                            "vi-VN",
                                                            {
                                                                style: "currency",
                                                                currency: "VND",
                                                            }
                                                        )}
                                                    </span>
                                                    <span className="arrow">→</span>
                                                    <span className="discounted-price">
                                                        {(
                                                            product.price *
                                                            (1 -
                                                                product.discount /
                                                                    100)
                                                        ).toLocaleString(
                                                            "vi-VN",
                                                            {
                                                                style: "currency",
                                                                currency: "VND",
                                                            }
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="block2-txt-child2 flex-r p-t-3">
                                            <FavoriteButton
                                                productId={product.product_id}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <Link
                            to={"/product"}
                            className="flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn1 p-lr-15 trans-04 js-addcart-detail"
                            style={{ width: "25%" }}
                        >
                            Hiển thị thêm
                        </Link>
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
