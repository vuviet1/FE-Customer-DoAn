/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Image } from "react-bootstrap";

function Sidebar() {
    const [customer, setCustomer] = useState({
        name: "",
        email: "",
        password: "",
        note: "",
        avatar: "",
        phone: "",
        address: "",
        status: 1,
    });

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user_data"));
        if (userData) {
            setCustomer(userData);
        }
    }, []);

    const handleLogout = () => {
        // Xóa token khỏi localStorage
        localStorage.removeItem("access_token");
        localStorage.removeItem("token_type");
        localStorage.removeItem("user_data");

        // Điều hướng đến trang chủ
        window.location.href = "/";
    };

    return (
        <Fragment>
            <aside className="wrap-sidebar js-sidebar">
                <div className="s-full js-hide-sidebar" />
                <div className="sidebar flex-col-l p-t-22 p-b-25">
                    <div className="flex-r w-full p-b-30 p-r-27">
                        <div className="fs-35 lh-10 cl2 p-lr-5 pointer hov-cl1 trans-04 js-hide-sidebar">
                            <i className="zmdi zmdi-close" />
                        </div>
                    </div>
                    <div className="sidebar-content flex-w w-full p-lr-65 js-pscroll">
                        <ul className="sidebar-link w-full">
                            <li className="p-b-13">
                                {customer.avatar && (
                                    <>
                                        <Image
                                            className="img-profile rounded-circle"
                                            src={`http://127.0.0.1:8000/uploads/avatar/${customer.avatar}`}
                                            alt={customer.name}
                                            style={{
                                                width: "60px",
                                                height: "60px",
                                            }}
                                            thumbnail
                                        />
                                        <span> {customer.name}</span>
                                    </>
                                )}
                            </li>
                            {customer.role === 1 && (
                                <li className="p-b-13">
                                    <Link
                                        to={"/admin-home"}
                                        className="stext-102 cl2 hov-cl1 trans-04"
                                    >
                                        Trang Admin
                                    </Link>
                                </li>
                            )}
                            <li className="p-b-13">
                                {customer.name ? (
                                    <Link
                                        to={"/account"}
                                        className="stext-102 cl2 hov-cl1 trans-04"
                                    >
                                        Tài khoản
                                    </Link>
                                ) : (
                                    <div>
                                        <Link
                                            to={"/login"}
                                            className="stext-102 cl2 hov-cl1 trans-04"
                                        >
                                            Đăng nhập
                                        </Link>
                                        <span> | </span>
                                        <Link
                                            to={"/register"}
                                            className="stext-102 cl2 hov-cl1 trans-04"
                                        >
                                            Đăng ký
                                        </Link>
                                    </div>
                                )}
                            </li>

                            {customer.name && (
                                <>
                                    <li className="p-b-13">
                                        <Link
                                            to={"/favorite"}
                                            className="stext-102 cl2 hov-cl1 trans-04"
                                        >
                                            Sản phẩm yêu thích
                                        </Link>
                                    </li>
                                    <li className="p-b-13">
                                        <Link
                                            to={"/order"}
                                            className="stext-102 cl2 hov-cl1 trans-04"
                                        >
                                            Hóa đơn của tôi
                                        </Link>
                                    </li>
                                    <li className="p-b-13">
                                        <Link
                                            onClick={handleLogout}
                                            className="stext-102 cl2 hov-cl1 trans-04"
                                        >
                                            Đăng xuất
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                        <div className="sidebar-gallery w-full p-tb-30">
                            <span className="mtext-101 cl5">@ CozaStore</span>
                            <div className="flex-w flex-sb p-t-36 gallery-lb">
                                {/* item gallery sidebar */}
                                <div className="wrap-item-gallery m-b-10">
                                    <a
                                        className="item-gallery bg-img1"
                                        href="assets/customer/images/gallery-01.jpg"
                                        data-lightbox="gallery"
                                        style={{
                                            backgroundImage:
                                                'url("assets/customer/images/gallery-01.jpg")',
                                        }}
                                    />
                                </div>
                                {/* item gallery sidebar */}
                                <div className="wrap-item-gallery m-b-10">
                                    <a
                                        className="item-gallery bg-img1"
                                        href="assets/customer/images/gallery-02.jpg"
                                        data-lightbox="gallery"
                                        style={{
                                            backgroundImage:
                                                'url("assets/customer/images/gallery-02.jpg")',
                                        }}
                                    />
                                </div>
                                {/* item gallery sidebar */}
                                <div className="wrap-item-gallery m-b-10">
                                    <a
                                        className="item-gallery bg-img1"
                                        href="assets/customer/images/gallery-03.jpg"
                                        data-lightbox="gallery"
                                        style={{
                                            backgroundImage:
                                                'url("assets/customer/images/gallery-03.jpg")',
                                        }}
                                    />
                                </div>
                                {/* item gallery sidebar */}
                                <div className="wrap-item-gallery m-b-10">
                                    <a
                                        className="item-gallery bg-img1"
                                        href="assets/customer/images/gallery-04.jpg"
                                        data-lightbox="gallery"
                                        style={{
                                            backgroundImage:
                                                'url("assets/customer/images/gallery-04.jpg")',
                                        }}
                                    />
                                </div>
                                {/* item gallery sidebar */}
                                <div className="wrap-item-gallery m-b-10">
                                    <a
                                        className="item-gallery bg-img1"
                                        href="assets/customer/images/gallery-05.jpg"
                                        data-lightbox="gallery"
                                        style={{
                                            backgroundImage:
                                                'url("assets/customer/images/gallery-05.jpg")',
                                        }}
                                    />
                                </div>
                                {/* item gallery sidebar */}
                                <div className="wrap-item-gallery m-b-10">
                                    <a
                                        className="item-gallery bg-img1"
                                        href="assets/customer/images/gallery-06.jpg"
                                        data-lightbox="gallery"
                                        style={{
                                            backgroundImage:
                                                'url("assets/customer/images/gallery-06.jpg")',
                                        }}
                                    />
                                </div>
                                {/* item gallery sidebar */}
                                <div className="wrap-item-gallery m-b-10">
                                    <a
                                        className="item-gallery bg-img1"
                                        href="assets/customer/images/gallery-07.jpg"
                                        data-lightbox="gallery"
                                        style={{
                                            backgroundImage:
                                                'url("assets/customer/images/gallery-07.jpg")',
                                        }}
                                    />
                                </div>
                                {/* item gallery sidebar */}
                                <div className="wrap-item-gallery m-b-10">
                                    <a
                                        className="item-gallery bg-img1"
                                        href="assets/customer/images/gallery-08.jpg"
                                        data-lightbox="gallery"
                                        style={{
                                            backgroundImage:
                                                'url("assets/customer/images/gallery-08.jpg")',
                                        }}
                                    />
                                </div>
                                {/* item gallery sidebar */}
                                <div className="wrap-item-gallery m-b-10">
                                    <a
                                        className="item-gallery bg-img1"
                                        href="assets/customer/images/gallery-09.jpg"
                                        data-lightbox="gallery"
                                        style={{
                                            backgroundImage:
                                                'url("assets/customer/images/gallery-09.jpg")',
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="sidebar-gallery w-full">
                            <span className="mtext-101 cl5">About Us</span>
                            <p className="stext-108 cl6 p-t-27">
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Curabitur maximus vulputate
                                hendrerit. Praesent faucibus erat vitae rutrum
                                gravida. Vestibulum tempus mi enim, in molestie
                                sem fermentum quis.
                            </p>
                        </div>
                    </div>
                </div>
            </aside>
        </Fragment>
    );
}
export default Sidebar;
