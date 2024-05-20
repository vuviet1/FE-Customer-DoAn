/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Header() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            setIsScrolled(offset > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <>
            <header className={`header_area ${isScrolled ? 'scrolled' : ''}`}>
                <div className={`top_menu ${isScrolled ? 'top_menu_scrolled' : ''}`}>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-7">
                                <div className="float-left">
                                    <p>Phone: +01 256 25 235</p>
                                    <p>email: info@eiser.com</p>
                                </div>
                            </div>
                            <div className="col-lg-5">
                                <div className="float-right">
                                    <ul className="right_side">
                                        <li>
                                            <Link to="/cart">gift card</Link>
                                        </li>
                                        <li>
                                            <Link to="/tracking">
                                                track order
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/contact">
                                                Contact Us
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="main_menu">
                    <div className="container">
                        <nav className="navbar navbar-expand-lg navbar-light w-100">
                            <Link className="navbar-brand logo_h" to="/">
                                <img src="/assets/images/logo.png" alt="Logo" />
                            </Link>
                            <button
                                className="navbar-toggler"
                                type="button"
                                data-toggle="collapse"
                                data-target="#navbarSupportedContent"
                                aria-controls="navbarSupportedContent"
                                aria-expanded="false"
                                aria-label="Toggle navigation"
                            >
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <div
                                className="collapse navbar-collapse offset w-100"
                                id="navbarSupportedContent"
                            >
                                <div className="row w-100 mr-0">
                                    <div className="col-lg-7 pr-0">
                                        <ul className="nav navbar-nav center_nav pull-right">
                                            <li className="nav-item active">
                                                <Link
                                                    className="nav-link"
                                                    to="/"
                                                >
                                                    Home
                                                </Link>
                                            </li>
                                            <li className="nav-item submenu dropdown">
                                                <a
                                                    href="#"
                                                    className="nav-link dropdown-toggle"
                                                    data-toggle="dropdown"
                                                    role="button"
                                                    aria-haspopup="true"
                                                    aria-expanded="false"
                                                >
                                                    Shop
                                                </a>
                                                <ul className="dropdown-menu">
                                                    <li className="nav-item">
                                                        <Link
                                                            className="nav-link"
                                                            to="/category"
                                                        >
                                                            Shop Category
                                                        </Link>
                                                    </li>
                                                    <li className="nav-item">
                                                        <Link
                                                            className="nav-link"
                                                            to="/product-detail"
                                                        >
                                                            Product Detail
                                                        </Link>
                                                    </li>
                                                    <li className="nav-item">
                                                        <Link
                                                            className="nav-link"
                                                            to="/cart"
                                                        >
                                                            Shopping Cart
                                                        </Link>
                                                    </li>
                                                    <li className="nav-item">
                                                        <Link
                                                            className="nav-link"
                                                            to="/checkout"
                                                        >
                                                            Product Checkout
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </li>
                                            <li className="nav-item submenu dropdown">
                                                <a
                                                    href="#"
                                                    className="nav-link dropdown-toggle"
                                                    data-toggle="dropdown"
                                                    role="button"
                                                    aria-haspopup="true"
                                                    aria-expanded="false"
                                                >
                                                    Blog
                                                </a>
                                                <ul className="dropdown-menu">
                                                    <li className="nav-item">
                                                        <Link
                                                            className="nav-link"
                                                            to="/blog"
                                                        >
                                                            Blog
                                                        </Link>
                                                    </li>
                                                    <li className="nav-item">
                                                        <Link
                                                            className="nav-link"
                                                            to="/blog-detail"
                                                        >
                                                            Blog Detail
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </li>
                                            <li className="nav-item submenu dropdown">
                                                <a
                                                    href="#"
                                                    className="nav-link dropdown-toggle"
                                                    data-toggle="dropdown"
                                                    role="button"
                                                    aria-haspopup="true"
                                                    aria-expanded="false"
                                                >
                                                    Pages
                                                </a>
                                                <ul className="dropdown-menu">
                                                    <li className="nav-item">
                                                        <Link
                                                            className="nav-link"
                                                            to="/tracking"
                                                        >
                                                            Tracking
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </li>
                                            <li className="nav-item">
                                                <Link
                                                    className="nav-link"
                                                    to="/contact"
                                                >
                                                    Contact
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-lg-5 pr-0">
                                        <ul className="nav navbar-nav navbar-right right_nav pull-right">
                                            <li className="nav-item">
                                                <Link
                                                    to="/search"
                                                    className="icons"
                                                >
                                                    <i
                                                        className="ti-search"
                                                        aria-hidden="true"
                                                    ></i>
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link
                                                    to="/cart"
                                                    className="icons"
                                                >
                                                    <i className="ti-shopping-cart"></i>
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link
                                                    to="/profile"
                                                    className="icons"
                                                >
                                                    <i
                                                        className="ti-user"
                                                        aria-hidden="true"
                                                    ></i>
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link
                                                    to="/wishlist"
                                                    className="icons"
                                                >
                                                    <i
                                                        className="ti-heart"
                                                        aria-hidden="true"
                                                    ></i>
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
            </header>
            {/*================Home Banner Area =================*/}
            <section className="home_banner_area mb-40">
                <div className="banner_inner d-flex align-items-center">
                    <div className="container">
                        <div className="banner_content row">
                            <div className="col-lg-12">
                                <p className="sub text-uppercase">
                                    men Collection
                                </p>
                                <h3>
                                    <span>Show</span> Your <br />
                                    Personal <span>Style</span>
                                </h3>
                                <h4>
                                    Fowl saw dry which a above together place.
                                </h4>
                                <a className="main_btn mt-40" href="#">
                                    View Collection
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/*================End Home Banner Area =================*/}
        </>
    );
}

export default Header;
