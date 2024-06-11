/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./header.css"; // Tạo file CSS riêng để thêm các style tùy chỉnh

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

    const handleLogout = () => {
        // Xóa token khỏi localStorage
        localStorage.removeItem("access_token");
        localStorage.removeItem("token_type");

        // Điều hướng đến trang đăng nhập
        window.location.href = 'http://localhost:3002/login'
    };

    return (
        <>
            <header className={`header_area ${isScrolled ? "scrolled" : ""}`}>
                <Navbar
                    expand="lg"
                    fixed="top"
                    className={`main_menu ${isScrolled ? "scrolled" : ""}`}
                    variant="dark"
                    style={{
                        height: "80px",
                        transition: "background-color 0.3s ease-in-out",
                        backgroundColor: isScrolled
                            ? "rgba(0, 0, 0, 0.4)"
                            : "transparent",
                    }}
                >
                    <Container>
                        <Navbar.Brand
                            as={Link}
                            to="/"
                            className="navbar-brand logo_h"
                        >
                            <img src="/assets/images/logo.png" alt="Logo" />
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="navbarResponsive" />
                        <Navbar.Collapse id="navbarResponsive">
                            <Nav className="mr-auto">
                                <Nav.Link
                                    as={Link}
                                    to="/"
                                    className={`nav-item nav-link ${isScrolled ? "scrolled" : ""}`}
                                >
                                    Home
                                </Nav.Link>
                                <NavDropdown
                                    title="Shop"
                                    id="shopDropdown"
                                    className={`nav-item submenu dropdown ${isScrolled ? "scrolled" : ""}`}
                                >
                                    <NavDropdown.Item
                                        as={Link}
                                        to="/category"
                                        className={`nav-item nav-link ${isScrolled ? "scrolled" : ""}`}
                                    >
                                        Shop Category
                                    </NavDropdown.Item>
                                    <NavDropdown.Item
                                        as={Link}
                                        to="/product-detail"
                                        className={`nav-item nav-link ${isScrolled ? "scrolled" : ""}`}
                                    >
                                        Product Detail
                                    </NavDropdown.Item>
                                    <NavDropdown.Item
                                        as={Link}
                                        to="/cart"
                                        className={`nav-item nav-link ${isScrolled ? "scrolled" : ""}`}
                                    >
                                        Shopping Cart
                                    </NavDropdown.Item>
                                    <NavDropdown.Item
                                        as={Link}
                                        to="/checkout"
                                        className={`nav-item nav-link ${isScrolled ? "scrolled" : ""}`}
                                    >
                                        Product Checkout
                                    </NavDropdown.Item>
                                </NavDropdown>
                                <NavDropdown
                                    title="Blog"
                                    id="blogDropdown"
                                    className={`nav-item submenu dropdown ${isScrolled ? "scrolled" : ""}`}
                                >
                                    <NavDropdown.Item
                                        as={Link}
                                        to="/blog"
                                        className={`nav-item nav-link ${isScrolled ? "scrolled" : ""}`}
                                    >
                                        Blog
                                    </NavDropdown.Item>
                                    <NavDropdown.Item
                                        as={Link}
                                        to="/blog-detail"
                                        className={`nav-item nav-link ${isScrolled ? "scrolled" : ""}`}
                                    >
                                        Blog Detail
                                    </NavDropdown.Item>
                                </NavDropdown>
                                <NavDropdown
                                    title="Pages"
                                    id="pagesDropdown"
                                    className={`nav-item submenu dropdown ${isScrolled ? "scrolled" : ""}`}
                                >
                                    <NavDropdown.Item
                                        as={Link}
                                        to="/tracking"
                                        className={`nav-item nav-link ${isScrolled ? "scrolled" : ""}`}
                                    >
                                        Tracking
                                    </NavDropdown.Item>
                                </NavDropdown>
                                <Nav.Link
                                    as={Link}
                                    to="/contact"
                                    className={`nav-item nav-link ${isScrolled ? "scrolled" : ""}`}
                                >
                                    Contact
                                </Nav.Link>
                            </Nav>
                            <Nav className="ml-auto">
                                <Nav.Link
                                    as={Link}
                                    to="/search"
                                    className={`nav-item icons ${isScrolled ? "scrolled" : ""}`}
                                >
                                    <i
                                        className="ti-search text-white"
                                        aria-hidden="true"
                                    ></i>
                                </Nav.Link>
                                <Nav.Link
                                    as={Link}
                                    to="/cart"
                                    className={`nav-item icons ${isScrolled ? "scrolled" : ""}`}
                                >
                                    <i className="ti-shopping-cart text-white"></i>
                                </Nav.Link>
                                <Nav.Link
                                    as={Link}
                                    to="/profile"
                                    className={`nav-item icons ${isScrolled ? "scrolled" : ""}`}
                                >
                                    <i
                                        className="ti-user text-white"
                                        aria-hidden="true"
                                    ></i>
                                </Nav.Link>
                                <Nav.Link
                                    as={Link}
                                    to="/wishlist"
                                    className={`nav-item icons ${isScrolled ? "scrolled" : ""}`}
                                >
                                    <i
                                        className="ti-heart text-white"
                                        aria-hidden="true"
                                    ></i>
                                </Nav.Link>
                                <Nav.Link
                                    as={Link}
                                    onClick={handleLogout}
                                    // to="/login"
                                    className={`nav-item icons ${isScrolled ? "scrolled" : ""}`}
                                >
                                    <i
                                        className="fas fa-sign-out-alt text-white"
                                        aria-hidden="true"
                                    ></i>
                                </Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
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
