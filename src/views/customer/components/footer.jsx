/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Fragment } from "react";
import { Link } from "react-router-dom";

function Footer() {
    return (
        <Fragment>
            <footer className="bg3 p-t-75 p-b-32">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-6 col-lg-3 p-b-50">
                            <h4 className="stext-301 cl0 p-b-30">Thông tin chung</h4>
                            <ul>
                                <li className="p-b-10">
                                    <Link 
                                        to={"/about"}
                                        className="stext-107 cl7 hov-cl1 trans-04"
                                    >
                                        Giới thiệu
                                    </Link>
                                </li>
                                <li className="p-b-10">
                                    <a
                                        href="#"
                                        className="stext-107 cl7 hov-cl1 trans-04"
                                    >
                                        Chính sách bảo mật
                                    </a>
                                </li>
                                <li className="p-b-10">
                                    <a
                                        href="#"
                                        className="stext-107 cl7 hov-cl1 trans-04"
                                    >
                                        Chính sách giao hàng
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="col-sm-6 col-lg-3 p-b-50">
                            <h4 className="stext-301 cl0 p-b-30">Hỗ trợ</h4>
                            <ul>
                                <li className="p-b-10">
                                    <a
                                        href="#"
                                        className="stext-107 cl7 hov-cl1 trans-04"
                                    >
                                        Chương trình khuyến mãi
                                    </a>
                                </li>
                                <li className="p-b-10">
                                    <a
                                        href="#"
                                        className="stext-107 cl7 hov-cl1 trans-04"
                                    >
                                        Hướng dẫn đặt hàng
                                    </a>
                                </li>
                                <li className="p-b-10">
                                    <Link
                                        to={"/contact"}
                                        className="stext-107 cl7 hov-cl1 trans-04"
                                    >
                                        Liên hệ
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="col-sm-6 col-lg-3 p-b-50">
                            <h4 className="stext-301 cl0 p-b-30">
                                Kết nối với chúng tôi
                            </h4>
                            <div className="p-t-27">
                                <a
                                    href="https://www.facebook.com/"
                                    className="fs-18 cl7 hov-cl1 trans-04 m-r-16"
                                >
                                    <i className="fa fa-facebook" />
                                </a>
                                <a
                                    href="https://www.instagram.com/"
                                    className="fs-18 cl7 hov-cl1 trans-04 m-r-16"
                                >
                                    <i className="fa fa-instagram" />
                                </a>
                                <a
                                    href="https://www.pinterest.com/"
                                    className="fs-18 cl7 hov-cl1 trans-04 m-r-16"
                                >
                                    <i className="fa fa-pinterest-p" />
                                </a>
                            </div>
                        </div>
                        <div className="col-sm-6 col-lg-3 p-b-50">
                            <h4 className="stext-301 cl0 p-b-30">Nhận thông tin mới nhất</h4>
                            <form>
                                <div className="wrap-input1 w-full p-b-4">
                                    <input
                                        className="input1 bg-none plh1 stext-107 cl7"
                                        type="text"
                                        name="email"
                                        placeholder="email@example.com"
                                    />
                                    <div className="focus-input1 trans-04" />
                                </div>
                                <div className="p-t-18">
                                    <button 
                                    type="button"
                                    className="flex-c-m stext-101 cl0 size-103 bg1 bor1 hov-btn2 p-lr-15 trans-04">
                                        Đăng ký
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="p-t-40">
                        <div className="flex-c-m flex-w p-b-18">
                            <a href="#" className="m-all-1">
                                <img
                                    src="assets/customer/images/icons/icon-pay-01.png"
                                    alt="ICON-PAY"
                                />
                            </a>
                            <a href="#" className="m-all-1">
                                <img
                                    src="assets/customer/images/icons/icon-pay-02.png"
                                    alt="ICON-PAY"
                                />
                            </a>
                            <a href="#" className="m-all-1">
                                <img
                                    src="assets/customer/images/icons/icon-pay-03.png"
                                    alt="ICON-PAY"
                                />
                            </a>
                            <a href="#" className="m-all-1">
                                <img
                                    src="assets/customer/images/icons/icon-pay-04.png"
                                    alt="ICON-PAY"
                                />
                            </a>
                            <a href="#" className="m-all-1">
                                <img
                                    src="assets/customer/images/icons/icon-pay-05.png"
                                    alt="ICON-PAY"
                                />
                            </a>
                        </div>
                        <p className="stext-107 cl6 txt-center">
                            Copyright © All rights reserved 
                        </p>
                    </div>
                </div>
            </footer>

            {/* Back to top  */}
            <div className="btn-back-to-top" id="myBtn">
                <span className="symbol-btn-back-to-top">
                    <i className="zmdi zmdi-chevron-up" />
                </span>
            </div>
        </Fragment>
    );
}
export default Footer;
