import React from "react";
import { Link } from "react-router-dom";
import { Image, Dropdown } from "react-bootstrap";

const Topbar = () => {
    const userData = JSON.parse(localStorage.getItem("user_data"));

    return (
        <nav className="navbar navbar-expand navbar-light bg-navbar topbar mb-4 static-top">
            <Link
                className="d-flex align-items-center text-decoration-none"
                to={"/admin-home"}
            >
                <div className="">
                    <img
                        src="assets/admin/images/logo/logo2.png"
                        style={{ width: "45px", height: "45px" }}
                        alt="Logo"
                    />
                </div>
                <div
                    className="mx-2 text-white font-weight-bold fs-4"
                    style={{ width: "30px" }}
                >
                    Admin
                </div>
            </Link>
            <ul className="navbar-nav ml-auto">
                <li className="nav-item dropdown no-arrow mx-1">
                    <Link
                        to={"/admin-home"}
                        className="nav-link dropdown-toggle"
                    >
                        Trang chủ
                    </Link>
                </li>
                <li className="nav-item dropdown no-arrow mx-1">
                    <Dropdown>
                        <Dropdown.Toggle
                            id="dropdown-nhansu"
                            className="nav-link dropdown-toggle"
                        >
                            Nhân sự
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item
                                as={Link}
                                to={"/admin-admin"}
                                className="d-flex align-items-center"
                            >
                                <div className="mr-3">
                                    <div className="icon-circle bg-info" style={{ fontSize: "20px" }}>
                                        <i className="fas fa-user-tie text-white" />
                                    </div>
                                </div>
                                <div>Nhân viên</div>
                            </Dropdown.Item>
                            <Dropdown.Item
                                as={Link}
                                to={"/admin-customer"}
                                className="d-flex align-items-center"
                            >
                                <div className="mr-3">
                                    <div className="icon-circle bg-warning">
                                        <i className="fas fa-users text-white" />
                                    </div>
                                </div>
                                <div>Khách hàng</div>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </li>
                <li className="nav-item dropdown no-arrow mx-1">
                    <Dropdown>
                        <Dropdown.Toggle
                            id="dropdown-sanpham"
                            className="nav-link dropdown-toggle"
                        >
                            Sản phẩm
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {/* Các Dropdown.Item cho Sản phẩm */}
                            <Dropdown.Item
                                as={Link}
                                to={"/admin-product"}
                                className="d-flex align-items-center"
                            >
                                <div className="mr-3">
                                    <div className="icon-circle bg-primary">
                                        <i className="fas fa-luggage-cart text-white" />
                                    </div>
                                </div>
                                <div>Sản phẩm</div>
                            </Dropdown.Item>
                            <Dropdown.Item
                                as={Link}
                                to={"/admin-category"}
                                className="d-flex align-items-center"
                            >
                                <div className="mr-3">
                                    <div className="icon-circle bg-dark">
                                        <i className="fas fa-clipboard-list text-white" />
                                    </div>
                                </div>
                                <div>Danh mục</div>
                            </Dropdown.Item>
                            <Dropdown.Item
                                as={Link}
                                to={"/admin-color"}
                                className="d-flex align-items-center"
                            >
                                <div className="mr-3">
                                    <div className="icon-circle bg-warning">
                                        <i className="fas fa-palette text-white" />
                                    </div>
                                </div>
                                <div>Màu</div>
                            </Dropdown.Item>
                            <Dropdown.Item
                                as={Link}
                                to={"/admin-brand"}
                                className="d-flex align-items-center"
                            >
                                <div className="mr-3">
                                    <div className="icon-circle bg-success">
                                        <i className="fas fa-clinic-medical text-white" />
                                    </div>
                                </div>
                                <div>Thương hiệu</div>
                            </Dropdown.Item>
                            <Dropdown.Item
                                as={Link}
                                to={"/admin-size"}
                                className="d-flex align-items-center"
                            >
                                <div className="mr-3">
                                    <div className="icon-circle bg-primary">
                                        <i className="fas fa-sort-amount-up text-white" />
                                    </div>
                                </div>
                                <div>Số đo</div>
                            </Dropdown.Item>
                            <Dropdown.Item
                                as={Link}
                                to={"/admin-voucher"}
                                className="d-flex align-items-center"
                            >
                                <div className="mr-3">
                                    <div className="icon-circle bg-info">
                                        <i className="fas fa-funnel-dollar text-white" />
                                    </div>
                                </div>
                                <div>Mã giảm giá</div>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </li>
                <li className="nav-item dropdown no-arrow mx-1">
                    <Dropdown>
                        <Dropdown.Toggle
                            id="dropdown-hoadon"
                            className="nav-link dropdown-toggle"
                        >
                            Hóa đơn
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item
                                as={Link}
                                to={"/admin-order"}
                                className="d-flex align-items-center"
                            >
                                <div className="mr-3">
                                    <div className="icon-circle bg-danger">
                                        <i className="fas fa-receipt text-white" />
                                    </div>
                                </div>
                                <div>Hóa đơn</div>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </li>
                <li className="nav-item dropdown no-arrow mx-1">
                    <Dropdown>
                        <Dropdown.Toggle
                            id="dropdown-phuongthuc"
                            className="nav-link dropdown-toggle"
                        >
                            Phương thức
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item
                                as={Link}
                                to={"/admin-payment"}
                                className="d-flex align-items-center"
                            >
                                <div className="mr-3">
                                    <div className="icon-circle bg-success">
                                        <i className="fas fa-comments-dollar text-white" />
                                    </div>
                                </div>
                                <div>Thanh toán</div>
                            </Dropdown.Item>
                            <Dropdown.Item
                                as={Link}
                                to={"/admin-shipping"}
                                className="d-flex align-items-center"
                            >
                                <div className="mr-3">
                                    <div className="icon-circle bg-info">
                                        <i className="fas fa-dolly-flatbed" />
                                    </div>
                                </div>
                                <div>Vận chuyển</div>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </li>
            </ul>
            <ul className="navbar-nav ml-auto">
                <li className="nav-item dropdown no-arrow mx-1">
                    <Dropdown>
                        <Dropdown.Toggle
                            id="dropdown-alerts"
                            className="nav-link dropdown-toggle"
                        >
                            <i className="fas fa-bell fa-fw" />
                            <span className="badge badge-danger badge-counter">
                                3+
                            </span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item
                                className="d-flex align-items-center"
                                href="#"
                            >
                                <div className="mr-3">
                                    <div className="icon-circle bg-primary">
                                        <i className="fas fa-file-alt text-white" />
                                    </div>
                                </div>
                                <div>
                                    <div className="small text-gray-500">
                                        December 12, 2019
                                    </div>
                                    <span className="font-weight-bold">
                                        A new monthly report is ready to
                                        download!
                                    </span>
                                </div>
                            </Dropdown.Item>
                            <Dropdown.Item
                                className="d-flex align-items-center"
                                href="#"
                            >
                                <div className="mr-3">
                                    <div className="icon-circle bg-success">
                                        <i className="fas fa-donate text-white" />
                                    </div>
                                </div>
                                <div>
                                    <div className="small text-gray-500">
                                        December 7, 2019
                                    </div>
                                    $290.29 has been deposited into your
                                    account!
                                </div>
                            </Dropdown.Item>
                            <Dropdown.Item
                                className="d-flex align-items-center"
                                href="#"
                            >
                                <div className="mr-3">
                                    <div className="icon-circle bg-warning">
                                        <i className="fas fa-exclamation-triangle text-white" />
                                    </div>
                                </div>
                                <div>
                                    <div className="small text-gray-500">
                                        December 2, 2019
                                    </div>
                                    Spending Alert: We've noticed unusually high
                                    spending for your account.
                                </div>
                            </Dropdown.Item>
                            <Dropdown.Item
                                className="text-center small text-gray-500"
                                href="#"
                            >
                                Show All Alerts
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </li>
                <li className="nav-item dropdown no-arrow mx-1">
                    <Dropdown>
                        <Dropdown.Toggle
                            id="dropdown-messages"
                            className="nav-link dropdown-toggle"
                        >
                            <i className="fas fa-envelope fa-fw" />
                            <span className="badge badge-warning badge-counter">
                                2
                            </span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item
                                className="d-flex align-items-center"
                                href="#"
                            >
                                <div className="dropdown-list-image mr-3">
                                    <img
                                        className="rounded-circle"
                                        src="assets/images/man.png"
                                        style={{ maxWidth: 60 }}
                                        alt=""
                                    />
                                    <div className="status-indicator bg-success" />
                                </div>
                                <div className="font-weight-bold">
                                    <div className="text-truncate">
                                        Hi there! I am wondering if you can help
                                        me with a problem I've been having.
                                    </div>
                                    <div className="small text-gray-500">
                                        Udin Cilok · 58m
                                    </div>
                                </div>
                            </Dropdown.Item>
                            <Dropdown.Item
                                className="d-flex align-items-center"
                                href="#"
                            >
                                <div className="dropdown-list-image mr-3">
                                    <img
                                        className="rounded-circle"
                                        src="assets/images/girl.png"
                                        style={{ maxWidth: 60 }}
                                        alt=""
                                    />
                                    <div className="status-indicator bg-default" />
                                </div>
                                <div>
                                    <div className="text-truncate">
                                        Am I a good boy? The reason I ask is
                                        because someone told me that people say
                                        this to all dogs, even if they aren't
                                        good...
                                    </div>
                                    <div className="small text-gray-500">
                                        Jaenab · 2w
                                    </div>
                                </div>
                            </Dropdown.Item>
                            <Dropdown.Item
                                className="text-center small text-gray-500"
                                href="#"
                            >
                                Read More Messages
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </li>
                <div className="topbar-divider d-none d-sm-block" />
                <li className="nav-item dropdown no-arrow">
                    <Dropdown>
                        <Dropdown.Toggle
                            id="dropdown-user"
                            className="nav-link dropdown-toggle"
                        >
                            <Image
                                className="img-profile rounded-circle"
                                style={{ maxWidth: 60 }}
                                src={
                                    "http://127.0.0.1:8000/uploads/avatar/" +
                                    userData.avatar
                                }
                                alt={userData.name}
                            />
                            <span className="ml-2 d-none d-lg-inline text-white small">
                                {userData.name}
                            </span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item
                                as={Link}
                                to={"/admin-profile"}
                                className="dropdown-item"
                            >
                                <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400" />
                                Trang cá nhân
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                                className="dropdown-item"
                                data-toggle="modal"
                                data-target="#logoutModal"
                            >
                                <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400" />
                                Đăng xuất
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </li>
            </ul>
        </nav>
    );
};

export default Topbar;
