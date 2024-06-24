/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Fragment } from "react";
import { Link } from "react-router-dom";

function Header() {
    return (
        <Fragment>
            <header className="header-v3">
                {/* Header desktop */}
                <div className="container-menu-desktop trans-03">
                    <div className="wrap-menu-desktop">
                        <nav className="limiter-menu-desktop p-l-45">
                            {/* Logo desktop */}
                            <Link to={"/"} className="logo">
                                <img
                                    src="assets/customer/images/icons/logo-02.png"
                                    alt="IMG-LOGO"
                                />
                            </Link>
                            {/* Menu desktop */}
                            <div className="menu-desktop">
                                <ul className="main-menu">
                                    <li>
                                        <Link to={"/"}>TRANG CHỦ</Link>
                                    </li>
                                    <li>
                                        <Link to={"/product"}>SẢN PHẨM</Link>
                                    </li>
                                    <li 
                                    // className="label1" data-label1="hot"
                                    >
                                        <Link to={"/shopping-cart"}>GIỎ HÀNG</Link>
                                    </li>
                                    <li>
                                        <Link to={"/about"}>GIỚI THIỆU</Link>
                                    </li>
                                    <li>
                                        <Link to={"/contact"}>LIÊN HỆ</Link>
                                    </li>
                                </ul>
                            </div>
                            {/* Icon header */}
                            <div className="wrap-icon-header flex-w flex-r-m h-full">
                                <div className="flex-c-m h-full p-r-25 bor6">
                                    <div
                                        className="icon-header-item cl0 hov-cl1 trans-04 p-lr-11 js-show-cart"
                                    >
                                        <i className="zmdi zmdi-shopping-cart" />
                                    </div>
                                </div>
                                <div className="flex-c-m h-full p-lr-19">
                                    <div className="icon-header-item cl0 hov-cl1 trans-04 p-lr-11 js-show-sidebar">
                                        <i className="zmdi zmdi-menu" />
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
            </header>
        </Fragment>
    );
}
export default Header;
