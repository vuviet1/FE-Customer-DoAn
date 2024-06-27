/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */
import React, { Fragment, useState, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import { Image, Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import Header from "./components/header";
import Sidebar from "./components/sidebar";
import Cart from "./components/cart";
import Footer from "./components/footer";
import ProductModal from "./components/modal";
import FavoriteButton from "./components/FavoriteButton";
import request from "../../utils/request";

function Favorite() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isFilterOpen, setFilterOpen] = useState(false);
    const [isSearchOpen, setSearchOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; // Number of products per page

    const toggleFilter = () => setFilterOpen(!isFilterOpen);
    const toggleSearch = () => setSearchOpen(!isSearchOpen);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Lọc
    const [brands, setBrands] = useState([]);
    const [category, setCategory] = useState([]);

    const [selectedBrand, setSelectedBrand] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    const handleProductClick = (productId) => {
        sessionStorage.setItem("productId", productId);
        window.location.href = `/product-detail`;
    };

    const handleQuickView = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
        sessionStorage.setItem("productId", product.product_id);
    };

    const fetchProduct = async () => {
        try {
            const response = await request.get("favourite");
            const productsData = response.data.data.map(item => item.product);
            setProducts(productsData);
            setFilteredProducts(productsData);
        } catch (error) {
            toast.error("Lấy dữ liệu thất bại.", {
                position: "top-right",
            });
        }
    };

    useEffect(() => {
        fetchProduct();
    }, []);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const response = await request.get("brand");
                setBrands(response.data.data);
            } catch (error) {
                toast.error("Lấy dữ liệu thất bại.", {
                    position: "top-right",
                });
            }
        };

        const fetchColors = async () => {
            try {
                const response = await request.get("category");
                setCategory(response.data.data);
            } catch (error) {
                toast.error("Lấy dữ liệu thất bại.", {
                    position: "top-right",
                });
            }
        };

        fetchBrands();
        fetchColors();
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

        if (selectedBrand) {
            updatedProducts = updatedProducts.filter(
                (product) => product.brand.brand_id === selectedBrand
            );
        }

        if (selectedCategory) {
            updatedProducts = updatedProducts.filter(
                (product) => product.category.category_id === selectedCategory
            );
        }

        if (searchTerm) {
            updatedProducts = updatedProducts.filter((product) =>
                product.product_name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            );
        }

        setFilteredProducts(updatedProducts);
        setCurrentPage(1);
    }, [products, selectedBrand, selectedCategory, searchTerm]);

    // Filter
    const splitArray = (array, size) => {
        const result = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    };

    const brandChunks = splitArray(brands, Math.ceil(brands.length / 2));
    const categoryChunks = splitArray(category, Math.ceil(category.length / 2));

    const handleFavoriteChange = () => {
        fetchProduct();
    };

    return (
        <Fragment>
            <ToastContainer />
            <Header />
            <Sidebar />
            <Cart />
            {/* Title page */}
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
                                className={`flex-c-m stext-106 cl6 size-104 bor4 pointer hov-btn3 trans-04 m-r-8 m-tb-4 ${
                                    isFilterOpen ? "" : "js-show-filter"
                                }`}
                                onClick={toggleFilter}
                            >
                                <i
                                    className={`icon-filter cl2 m-r-6 fs-15 trans-04 zmdi ${
                                        isFilterOpen
                                            ? "zmdi-close"
                                            : "zmdi-filter-list"
                                    }`}
                                />
                                Lọc
                            </div>
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
                        {/* Filter */}
                        <CSSTransition
                            in={isFilterOpen}
                            timeout={300}
                            classNames="panel-filter"
                            unmountOnExit
                        >
                            <div className="w-full p-t-10">
                                <div
                                    className="wrap-filter flex-w bg6 w-full p-lr-40 p-t-27 p-lr-15-sm"
                                    style={{ justifyContent: "space-between" }}
                                >
                                    <div className="filter-col p-r-15 p-b-27">
                                        <div className="mtext-102 cl2 p-b-15">
                                            Thương hiệu
                                        </div>
                                        <ul>
                                            <li className="p-b-6">
                                                <a
                                                    href="#"
                                                    className={`filter-link stext-106 trans-04 ${
                                                        selectedBrand === ""
                                                            ? "filter-link-active"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        setSelectedBrand("")
                                                    }
                                                >
                                                    Tất cả
                                                </a>
                                            </li>
                                            {brandChunks.map(
                                                (chunk, chunkIndex) => (
                                                    <div
                                                        className="filter-col2"
                                                        key={chunkIndex}
                                                    >
                                                        {chunk.map((brand) => (
                                                            <li
                                                                className="p-b-6"
                                                                key={
                                                                    brand.brand_id
                                                                }
                                                            >
                                                                <a
                                                                    href="#"
                                                                    className={`filter-link stext-106 trans-04 ${
                                                                        selectedBrand ===
                                                                        brand.brand_id
                                                                            ? "filter-link-active"
                                                                            : ""
                                                                    }`}
                                                                    onClick={() =>
                                                                        setSelectedBrand(
                                                                            brand.brand_id
                                                                        )
                                                                    }
                                                                >
                                                                    {
                                                                        brand.brand_name
                                                                    }
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </div>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                    <div className="filter-col p-r-15 p-b-27">
                                        <div className="mtext-102 cl2 p-b-15">
                                            Danh mục
                                        </div>
                                        <ul>
                                            <li className="p-b-6">
                                                <a
                                                    href="#"
                                                    className={`filter-link stext-106 trans-04 ${
                                                        selectedCategory === ""
                                                            ? "filter-link-active"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        setSelectedCategory("")
                                                    }
                                                >
                                                    Tất cả
                                                </a>
                                            </li>
                                            {categoryChunks.map(
                                                (chunk, chunkIndex) => (
                                                    <div
                                                        className="filter-col2"
                                                        key={chunkIndex}
                                                    >
                                                        {chunk.map(
                                                            (category) => (
                                                                <li
                                                                    className="p-b-6"
                                                                    key={
                                                                        category.category_id
                                                                    }
                                                                >
                                                                    <a
                                                                        href="#"
                                                                        className={`filter-link stext-106 trans-04 ${
                                                                            selectedCategory ===
                                                                            category.category_id
                                                                                ? "filter-link-active"
                                                                                : ""
                                                                        }`}
                                                                        onClick={() =>
                                                                            setSelectedCategory(
                                                                                category.category_id
                                                                            )
                                                                        }
                                                                    >
                                                                        {
                                                                            category.category_name
                                                                        }
                                                                    </a>
                                                                </li>
                                                            )
                                                        )}
                                                    </div>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                    <div className="filter-col p-r-15 p-b-27">
                                        <div className="mtext-102 cl2 p-b-15">
                                            Giá
                                        </div>
                                        <ul>
                                            <li className="p-b-6">
                                                <a
                                                    href="#"
                                                    className="filter-link stext-106 trans-04 filter-link-active"
                                                >
                                                    Tất cả
                                                </a>
                                            </li>
                                            <li className="p-b-6">
                                                <a
                                                    href="#"
                                                    className="filter-link stext-106 trans-04"
                                                >
                                                    Dưới 50 triệu
                                                </a>
                                            </li>
                                            <li className="p-b-6">
                                                <a
                                                    href="#"
                                                    className="filter-link stext-106 trans-04"
                                                >
                                                    50 triệu - 100 triệu
                                                </a>
                                            </li>
                                            <li className="p-b-6">
                                                <a
                                                    href="#"
                                                    className="filter-link stext-106 trans-04"
                                                >
                                                    Trên 100 triệu
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </CSSTransition>
                    </div>
                    <div className="row isotope-grid">
                        {currentProducts.map((product) => (
                            <div
                                key={product.product_id}
                                className="col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item women"
                            >
                                <div className="block2">
                                    <div className="block2-pic hov-img0">
                                        <Image
                                            src={"http://127.0.0.1:8000/uploads/product/" + product.image}
                                            style={{
                                                height: "300px",
                                                width: "300px",
                                            }}
                                            alt="IMG-PRODUCT"
                                            fluid
                                            // onClick={() =>
                                            //     handleProductClick(
                                            //         product.product_id
                                            //     )
                                            // }
                                        />
                                        {/* <Link
                                            className="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04 js-show-modal1"
                                            onClick={() =>
                                                handleQuickView(product)
                                            }
                                        >
                                            Xem nhanh
                                        </Link> */}
                                    </div>
                                    <div className="block2-txt flex-w flex-t p-t-14">
                                        <div className="block2-txt-child1 flex-col-l ">
                                            <Link
                                                to="#"
                                                className="stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6"
                                                onClick={() =>
                                                    handleProductClick(
                                                        product.product_id
                                                    )
                                                }
                                            >
                                                {product.product_name}
                                            </Link>
                                            <span className="stext-105 cl3">
                                                {product.price
                                                    ? product.price.toLocaleString(
                                                          "vi-VN",
                                                          {
                                                              style: "currency",
                                                              currency: "VND",
                                                          }
                                                      )
                                                    : "N/A"}
                                            </span>
                                        </div>
                                        <div className="block2-txt-child2 flex-r p-t-3">
                                            <FavoriteButton
                                                productId={product.product_id}
                                                isFavorite={product.is_favourite}
                                                onFavoriteChange={
                                                    handleFavoriteChange
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex-c-m flex-w w-full p-t-38">
                        <Pagination>
                            <Pagination.First
                                onClick={handleFirstPage}
                                disabled={currentPage === 1}
                            />
                            <Pagination.Prev
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                            />
                            {Array.from(
                                { length: totalPages },
                                (_, index) => (
                                    <Pagination.Item
                                        key={index + 1}
                                        active={index + 1 === currentPage}
                                        onClick={() =>
                                            handlePageChange(index + 1)
                                        }
                                    >
                                        {index + 1}
                                    </Pagination.Item>
                                )
                            )}
                            <Pagination.Next
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                            />
                            <Pagination.Last
                                onClick={handleLastPage}
                                disabled={currentPage === totalPages}
                            />
                        </Pagination>
                    </div>
                </div>
            </div>
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

export default Favorite;