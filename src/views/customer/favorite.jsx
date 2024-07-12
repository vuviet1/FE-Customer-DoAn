/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */
import React, { Fragment, useState, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import { Image, Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAlert } from "@utils/AlertContext";

import Header from "./components/header";
import Sidebar from "./components/sidebar";
import Cart from "./components/cart";
import Footer from "./components/footer";
import FavoriteButton from "./components/FavoriteButton";
import request from "@utils/request";

function Favorite() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isSearchOpen, setSearchOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; // Number of products per page

    const toggleSearch = () => setSearchOpen(!isSearchOpen);
    const [searchTerm, setSearchTerm] = useState("");

    const { showErrorAlert } = useAlert();

    const handleProductClick = (productId) => {
        sessionStorage.setItem("productId", productId);
        window.location.href = `/product-detail`;
    };

    const fetchProduct = async () => {
        const access_token = localStorage.getItem("access_token");
        try {
            const response = await request.get("favourite");
            const productsData = response.data.data.map((item) => item.product);
            setProducts(productsData);
            setFilteredProducts(productsData);
        } catch (error) {
            if (!access_token) {
                showErrorAlert("Chưa đăng nhập!", "Hãy đăng nhập để sử dụng chức năng.");
            } else{
                showErrorAlert("Lỗi!", "Lấy dữ liệu thất bại.");
            }
        }
    };

    useEffect(() => {
        fetchProduct();
    }, []);

    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = filteredProducts.slice(
        indexOfFirstProduct,
        indexOfLastProduct
    );

    // Phân trang
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleFirstPage = () => {
        setCurrentPage(1);
    };

    const handleLastPage = () => {
        setCurrentPage(totalPages);
    };

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    // TÌm kiếm
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Lọc
    useEffect(() => {
        let updatedProducts = products;

        if (searchTerm) {
            updatedProducts = updatedProducts.filter((product) =>
                product.product_name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            );
        }

        setFilteredProducts(updatedProducts);
        setCurrentPage(1);
    }, [products, searchTerm]);

    return (
        <Fragment>
            <Header />
            <Sidebar />
            <Cart />
            <section
                className="bg-img1 txt-center p-lr-15 p-tb-92"
                style={{
                    backgroundImage: 'url("assets/customer/images/bg-01.jpg")',
                }}
            >
                <h2 className="ltext-105 cl0 txt-center">SẢN PHẨM YÊU THÍCH</h2>
            </section>

            <div className="bg0 m-t-23 p-b-140">
                <div className="container">
                    <div className="flex-w flex-sb-m p-b-52">
                        <div className="flex-w flex-l-m filter-tope-group m-tb-10"></div>
                        <div className="flex-w flex-c-m m-tb-10">
                            <div
                                className={`flex-c-m stext-106 cl6 size-105 bor4 pointer hov-btn3 trans-04 m-tb-4 ${
                                    isSearchOpen ? "" : "js-show-search"
                                }`}
                                onClick={toggleSearch}
                            >
                                <i
                                    className={`icon-search cl2 m-r-6 fs-15 trans-04 zmdi ${
                                        isSearchOpen
                                            ? "zmdi-close"
                                            : "zmdi-search"
                                    }`}
                                />
                                Tìm kiếm
                            </div>
                        </div>
                        {/* Search product */}
                        <CSSTransition
                            in={isSearchOpen}
                            timeout={300}
                            classNames="panel-search"
                            unmountOnExit
                        >
                            <div className="w-full p-t-10 p-b-15">
                                <div className="bor8 dis-flex p-l-15">
                                    <button className="size-113 flex-c-m fs-16 cl2 hov-cl1 trans-04">
                                        <i className="zmdi zmdi-search" />
                                    </button>
                                    <input
                                        className="mtext-107 cl2 size-114 plh2 p-r-15"
                                        type="text"
                                        name="search-product"
                                        placeholder="Tìm kiếm"
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                    />
                                </div>
                            </div>
                        </CSSTransition>
                    </div>
                    <div
                        className="row isotope-grid"
                        style={{ minHeight: "450px", position: "relative" }}
                        display="flex"
                        flexwrap="wrap"
                    >
                        {currentProducts.length > 0 ? (
                            currentProducts.map((product) => (
                                <div
                                    key={product.product_id}
                                    className="col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item women"
                                >
                                    <div className="block2">
                                        <div className="block2-pic hov-img0">
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
                                                fluid
                                            />
                                            {!product.discount ||
                                                (product.discount !== 0 && (
                                                    <span className="discount-badge">
                                                        {product.discount}% Off
                                                    </span>
                                                ))}
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
                                                        {Number(
                                                            product.price
                                                        ).toLocaleString(
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
                                                            {Number(
                                                                product.price
                                                            ).toLocaleString(
                                                                "vi-VN",
                                                                {
                                                                    style: "currency",
                                                                    currency:
                                                                        "VND",
                                                                }
                                                            )}
                                                        </span>
                                                        <span className="arrow">
                                                            →
                                                        </span>
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
                                                                    currency:
                                                                        "VND",
                                                                }
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="block2-txt-child2 flex-r p-t-3">
                                                <FavoriteButton
                                                    productId={
                                                        product.product_id
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-12">
                                <p className="stext-105 cl3 text-center">
                                    Không có sản phẩm nào
                                </p>
                            </div>
                        )}
                    </div>
                    {/* Pagination */}
                    <div className="flex-c-m flex-w w-full p-t-38">
                        <Pagination className="pagination">
                            <Pagination.First onClick={handleFirstPage} />
                            <Pagination.Prev onClick={handlePrevPage} />
                            {[...Array(totalPages).keys()].map((page) => (
                                <Pagination.Item
                                    key={page + 1}
                                    active={page + 1 === currentPage}
                                    onClick={() => handlePageChange(page + 1)}
                                >
                                    {page + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next onClick={handleNextPage} />
                            <Pagination.Last onClick={handleLastPage} />
                        </Pagination>
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
}

export default Favorite;
