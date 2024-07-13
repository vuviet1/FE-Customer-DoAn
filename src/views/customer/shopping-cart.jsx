/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */
import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, Button, Form, Modal, Image } from "react-bootstrap";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { useAlert } from "@utils/AlertContext";

import Header from "./components/header";
import Sidebar from "./components/sidebar";
import Cart from "./components/cart";
import Footer from "./components/footer";
import request from "@utils/request";

function ShoppingCart() {
    const [cartItems, setCartItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(5); // Number of items per page
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [productToRemove, setProductToRemove] = useState(null);

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [paymentMethodId, setPaymentMethodId] = useState("");
    const [shippingMethodId, setShippingMethodId] = useState("");
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [shippingMethods, setShippingMethods] = useState([]);
    const [voucherCode, setVoucherCode] = useState("");
    const [vouchers, setVouchers] = useState([]);
    const [isVoucherValid, setIsVoucherValid] = useState(false);
    const [discountedTotal, setDiscountedTotal] = useState(null);

    const { showSuccessAlert, showErrorAlert, showWarningAlert } = useAlert();

    const token_type = localStorage.getItem("token_type");
    const access_token = localStorage.getItem("access_token");
    const user_data = JSON.parse(localStorage.getItem("user_data")) || {};

    useEffect(() => {
        if (!name) {
            setName(user_data.name || "");
        }
        if (!phoneNumber) {
            setPhoneNumber(user_data.phone || "");
        }
        if (!address) {
            setAddress(user_data.address || "");
        }
    }, [name, phoneNumber, address, user_data]);

    const handleProductClick = (productId) => {
        sessionStorage.setItem("productId", productId);
        window.location.href = `/product-detail`;
    };

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                request.defaults.headers.common[
                    "Authorization"
                ] = `${token_type} ${access_token}`;
                const [paymentResponse, shippingResponse, voucherResponse] =
                    await Promise.all([
                        request.get("payment"),
                        request.get("shipping"),
                        request.get("voucher"),
                    ]);

                setPaymentMethods(paymentResponse.data.data);
                setShippingMethods(shippingResponse.data.data);
                setVouchers(voucherResponse.data.data);
            } catch (error) {
                if (!access_token) {
                    showErrorAlert(
                        "Chưa đăng nhập!",
                        "Hãy đăng nhập để sử dụng chức năng."
                    );
                } else {
                    showErrorAlert("Lỗi!", "Lấy dữ liệu thất bại.");
                }
            }
        };

        fetchAllData();
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        request.defaults.headers.common[
            "Authorization"
        ] = `${token_type} ${access_token}`;
        try {
            if (!access_token) return;
            const response = await request.get("cart");
            const cartData = response.data.data;
            setCartItems(cartData);
            setFilteredItems(cartData);
        } catch (error) {
            showErrorAlert("Lỗi!", "Lấy dữ liệu thất bại.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra sản phẩm trước khi tạo hóa đơn
        const outOfStockItems = cartItems
            .filter((item) => item.product_detail.quantity < 1)
            .map((item) => item.product_detail.product.product_name);

        if (outOfStockItems.length > 0) {
            showErrorAlert(
                "Lỗi!",
                `Sản phẩm ${outOfStockItems.join(", ")} đã hết hàng.`
            );
            return;
        }

        for (const item of cartItems) {
            if (item.quantity > item.product_detail.quantity) {
                showErrorAlert(
                    "Lỗi!",
                    `Sản phẩm ${item.product_detail.product.product_name} đã quá số lượng sản phẩm còn lại.`
                );
                return;
            }
        }

        const orderData = {
            shipping_code: "",
            voucher_code: voucherCode,
            name,
            address,
            phone_number: phoneNumber,
            payment_method_id: Number(paymentMethodId),
            shipping_method_id: Number(shippingMethodId),
        };

        const token_type = localStorage.getItem("token_type");
        const access_token = localStorage.getItem("access_token");
        request.defaults.headers.common[
            "Authorization"
        ] = `${token_type} ${access_token}`;

        try {
            const response = await request.post("order", orderData);
            const paymentURL = response.data;
            onAddOrder();
            fetchCartItems();
            if (paymentURL) {
                if (paymentURL === "Success") {
                    showWarningAlert(
                        "Điều hướng!",
                        "Chuyển hướng về trang hóa đơn"
                    );
                    window.location.href = "/order";
                } else {
                    showWarningAlert(
                        "Điều hướng!",
                        "Chuyển hướng đến trang thanh toán"
                    );
                    window.location.href = paymentURL;
                }
            } else {
                showErrorAlert("Lỗi!", "Không nhận được URL thanh toán");
            }
        } catch (error) {
            showErrorAlert("Lỗi!", "Thêm hóa đơn thất bại");
            fetchCartItems();
        }
    };

    const onAddOrder = () => {
        showSuccessAlert("Thành công!", "Đã tạo hóa đơn thành công!");
    };

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = cartItems.filter((item) =>
            item.product_detail.product.product_name
                .toLowerCase()
                .includes(query)
        );
        setFilteredItems(filtered);
        setCurrentPage(0);
    };

    const handleQuantityChange = (product_detail_id, newQuantity) => {
        if (newQuantity < 0) return;

        if (newQuantity === 0) {
            setProductToRemove(product_detail_id);
            setShowModal(true);
            return;
        }

        const updatedCartItems = cartItems.map((item) => {
            if (item.product_detail_id === product_detail_id) {
                return { ...item, quantity: newQuantity };
            }
            return item;
        });
        setCartItems(updatedCartItems);
        setFilteredItems(updatedCartItems);
    };

    const confirmRemoveProduct = async () => {
        const token_type = localStorage.getItem("token_type");
        const access_token = localStorage.getItem("access_token");
        request.defaults.headers.common[
            "Authorization"
        ] = `${token_type} ${access_token}`;
        try {
            await request.delete(`cart/${productToRemove}`);
            const updatedCartItems = cartItems.filter(
                (item) => item.product_detail_id !== productToRemove
            );
            setCartItems(updatedCartItems);
            setFilteredItems(updatedCartItems);
            setShowModal(false);
            showSuccessAlert(
                "Thành công!",
                "Xóa sản phẩm khỏi giỏ hàng thành công!"
            );
        } catch (error) {
            showErrorAlert("Lỗi!", "Xóa sản phẩm khỏi giỏ hàng thất bại");
        }
    };

    const removeFromCart = async (product_detail_id) => {
        setProductToRemove(product_detail_id);
        setShowModal(true);
    };

    const offset = currentPage * itemsPerPage;
    const currentPageItems = filteredItems.slice(offset, offset + itemsPerPage);

    // Voucher và tổng tiền
    const handleVoucherApply = () => {
        try {
            const voucher = vouchers.find(
                (v) => v.voucher_code === voucherCode
            );
            if (voucher && voucher.status === 1) {
                const currentDate = new Date();
                const startDate = new Date(voucher.start_day);
                const endDate = new Date(voucher.end_day);
                const quantity = voucher.quantity;
                if (
                    currentDate >= startDate &&
                    currentDate <= endDate &&
                    quantity > 0
                ) {
                    setIsVoucherValid(true);
                    const originalTotal = calculateTotalPrice(false);
                    const discountAmount =
                        originalTotal * (voucher.voucher / 100);
                    const newTotal = originalTotal - discountAmount;
                    setDiscountedTotal({
                        original: originalTotal.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        }),
                        discounted: newTotal.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        }),
                    });
                    showSuccessAlert(
                        "Thành công!",
                        "Áp dụng mã giảm giá thành công!"
                    );
                    return;
                }
            }
            setIsVoucherValid(false);
            showErrorAlert("Lỗi!", "Mã giảm giá không hợp lệ hoặc đã hết hạn");
        } catch (error) {
            setIsVoucherValid(false);
            setDiscountedTotal(null);
            showErrorAlert("Lỗi!", "Mã giảm giá không hợp lệ");
        }
    };

    const calculateTotalPrice = (applyDiscount = true) => {
        const total = filteredItems.reduce((total, item) => {
            const discountPrice =
                item.product_detail.product.price *
                (1 - item.product_detail.product.discount / 100);
            return total + item.quantity * discountPrice;
        }, 0);

        if (!applyDiscount || !isVoucherValid) {
            return total;
        }

        const voucher = vouchers.find((v) => v.voucher_code === voucherCode);
        if (voucher) {
            const discountAmount = total * (voucher.voucher / 100);
            const newTotal = total - discountAmount;

            return {
                originalTotal: total,
                newTotal: newTotal,
            };
        }

        return total;
    };

    return (
        <Fragment>
            <Header />
            <Sidebar />
            <Cart />
            {/* Content */}
            <>
                <section
                    className="bg-img1 txt-center p-lr-15 p-tb-92"
                    style={{
                        backgroundImage:
                            'url("assets/customer/images/bg-01.jpg")',
                    }}
                >
                    <h2 className="ltext-105 cl0 txt-center">THANH TOÁN</h2>
                </section>
                {/* breadcrumb */}
                <div className="container">
                    <div className="bread-crumb flex-w p-l-25 p-r-15 p-t-30 p-lr-0-lg">
                        <Link
                            to={"/"}
                            className="stext-109 cl8 hov-cl1 trans-04"
                        >
                            Trang chủ
                            <i
                                className="fa fa-angle-right m-l-9 m-r-10"
                                aria-hidden="true"
                            />
                        </Link>
                        <span className="stext-109 cl4">Thanh toán</span>
                    </div>
                </div>
                {/* Giỏ hàng */}
                <div className="bg0 p-t-75 p-b-85">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 m-lr-auto m-b-50">
                                <div className="m-l-25 m-r--38 m-lr-0-xl">
                                    <Form.Group controlId="searchQuery">
                                        <Form.Control
                                            type="text"
                                            placeholder="Tìm kiếm sản phẩm..."
                                            value={searchQuery}
                                            onChange={handleSearch}
                                            style={{ marginBottom: "20px" }}
                                        />
                                    </Form.Group>
                                    <div className="wrap-table-shopping-cart">
                                        <Table responsive="sm">
                                            <thead>
                                                <tr>
                                                    <th>Sản phẩm</th>
                                                    <th>Tên sản phẩm</th>
                                                    <th>Giá</th>
                                                    <th>Kích cỡ</th>
                                                    <th>Màu sắc</th>
                                                    <th>Số lượng</th>
                                                    <th>Tổng tiền</th>
                                                    <th>Hành động</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentPageItems.length > 0 ? (
                                                    currentPageItems.map(
                                                        (item) => (
                                                            <tr
                                                                key={
                                                                    item.product_detail_id
                                                                }
                                                            >
                                                                <td>
                                                                    <div className="">
                                                                        <Link
                                                                            key={
                                                                                item
                                                                                    .product_detail
                                                                                    .product
                                                                                    .product_id
                                                                            }
                                                                            onClick={() =>
                                                                                handleProductClick(
                                                                                    item
                                                                                        .product_detail
                                                                                        .product
                                                                                        .product_id
                                                                                )
                                                                            }
                                                                        >
                                                                            <Image
                                                                                src={`http://127.0.0.1:8000/uploads/product/${item.product_detail.product.image}`}
                                                                                alt="IMG"
                                                                                style={{
                                                                                    width: "100px",
                                                                                    height: "100px",
                                                                                }}
                                                                            />
                                                                        </Link>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    {
                                                                        item
                                                                            .product_detail
                                                                            .product
                                                                            .product_name
                                                                    }
                                                                </td>
                                                                <td
                                                                    style={{
                                                                        color: "red",
                                                                    }}
                                                                >
                                                                    {(
                                                                        item
                                                                            .product_detail
                                                                            .product
                                                                            .price *
                                                                        (1 -
                                                                            item
                                                                                .product_detail
                                                                                .product
                                                                                .discount /
                                                                                100)
                                                                    ).toLocaleString(
                                                                        "vi-VN",
                                                                        {
                                                                            style: "currency",
                                                                            currency:
                                                                                "VND",
                                                                        }
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {
                                                                        item
                                                                            .product_detail
                                                                            .size
                                                                            .size
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        item
                                                                            .product_detail
                                                                            .color
                                                                            .color
                                                                    }
                                                                </td>
                                                                <td>
                                                                    <div className="wrap-num-product flex-w m-r-20 m-tb-10">
                                                                        <div
                                                                            className="btn-num-product-down cl8 hov-btn3 trans-04 flex-c-m"
                                                                            onClick={() =>
                                                                                handleQuantityChange(
                                                                                    item.product_detail_id,
                                                                                    item.quantity -
                                                                                        1
                                                                                )
                                                                            }
                                                                        >
                                                                            <i className="fs-16 zmdi zmdi-minus" />
                                                                        </div>
                                                                        <input
                                                                            className="mtext-104 cl3 txt-center num-product"
                                                                            type="number"
                                                                            name="num-product"
                                                                            value={
                                                                                item.quantity
                                                                            }
                                                                            onChange={
                                                                                handleQuantityChange
                                                                            }
                                                                            min={
                                                                                1
                                                                            }
                                                                        />
                                                                        <div
                                                                            className="btn-num-product-up cl8 hov-btn3 trans-04 flex-c-m"
                                                                            onClick={() =>
                                                                                handleQuantityChange(
                                                                                    item.product_detail_id,
                                                                                    item.quantity +
                                                                                        1
                                                                                )
                                                                            }
                                                                        >
                                                                            <i className="fs-16 zmdi zmdi-plus" />
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td
                                                                    style={{
                                                                        color: "red",
                                                                    }}
                                                                >
                                                                    {(
                                                                        item.quantity *
                                                                        (item
                                                                            .product_detail
                                                                            .product
                                                                            .price *
                                                                            (1 -
                                                                                item
                                                                                    .product_detail
                                                                                    .product
                                                                                    .discount /
                                                                                    100))
                                                                    ).toLocaleString(
                                                                        "vi-VN",
                                                                        {
                                                                            style: "currency",
                                                                            currency:
                                                                                "VND",
                                                                        }
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    <Button
                                                                        variant="danger"
                                                                        onClick={() =>
                                                                            removeFromCart(
                                                                                item.product_detail_id
                                                                            )
                                                                        }
                                                                    >
                                                                        Xóa
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    )
                                                ) : (
                                                    <tr>
                                                        <td
                                                            colSpan="6"
                                                            className="text-center"
                                                        >
                                                            Không có sản phẩm
                                                            nào
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    </div>
                                    <div className="d-flex justify-content-center">
                                        <ReactPaginate
                                            previousLabel={
                                                <FaAngleDoubleLeft />
                                            }
                                            nextLabel={<FaAngleDoubleRight />}
                                            breakLabel={"..."}
                                            breakClassName={"break-me"}
                                            pageCount={Math.ceil(
                                                filteredItems.length /
                                                    itemsPerPage
                                            )}
                                            marginPagesDisplayed={2}
                                            pageRangeDisplayed={5}
                                            onPageChange={handlePageClick}
                                            containerClassName={"pagination"}
                                            subContainerClassName={
                                                "pages pagination"
                                            }
                                            activeClassName={"active"}
                                            pageClassName={"page-item"}
                                            pageLinkClassName={"page-link"}
                                            previousClassName={"page-item"}
                                            previousLinkClassName={"page-link"}
                                            nextClassName={"page-item"}
                                            nextLinkClassName={"page-link"}
                                            breakLinkClassName={"page-link"}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Tổng quan hóa đơn */}
                <div
                    className="col-12 m-lr-auto m-b-50"
                    style={{ marginTop: "-100px" }}
                >
                    <div className="bor10 p-lr-40 p-t-30 p-b-40 m-l-63 m-r-40 m-lr-0-xl p-lr-15-sm">
                        <h4 className="mtext-109 cl2 p-b-30">
                            Tổng quan hóa đơn
                        </h4>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="flex-w flex-t bor12 p-b-13">
                                <Form.Label className="size-208 stext-110 cl2">
                                    Tổng tiền:
                                </Form.Label>
                                <Form.Label
                                    className="size-209 mtext-110 cl2"
                                    style={{ color: "red" }}
                                >
                                    <div className="total-price">
                                        {isVoucherValid && discountedTotal ? (
                                            <>
                                                <span
                                                    className="original-price"
                                                    style={{
                                                        textDecoration:
                                                            "line-through",
                                                    }}
                                                >
                                                    {discountedTotal.original}
                                                </span>
                                                <span className="arrow">→</span>
                                                <span className="discounted-price">
                                                    {discountedTotal.discounted}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="total">
                                                {calculateTotalPrice(
                                                    false
                                                ).toLocaleString("vi-VN", {
                                                    style: "currency",
                                                    currency: "VND",
                                                })}
                                            </span>
                                        )}
                                    </div>
                                </Form.Label>
                            </Form.Group>
                            <div className="row">
                                <div className="col-6">
                                    <Form.Group>
                                        <Form.Label className="size-208 w-full-ssm stext-110 cl2">
                                            Tên người nhận:
                                        </Form.Label>
                                        <Form.Control
                                            className="rs1-select2 rs2-select2 bor8 bg0 m-b-12 m-t-9"
                                            type="text"
                                            name="name"
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                            placeholder="Tên người nhận hàng"
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label className="size-208 w-full-ssm stext-110 cl2">
                                            Số điện thoại
                                        </Form.Label>
                                        <Form.Control
                                            className="rs1-select2 rs2-select2 bor8 bg0 m-b-12 m-t-9"
                                            type="text"
                                            name="phone_number"
                                            value={phoneNumber}
                                            onChange={(e) => {
                                                const numericValue =
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        ""
                                                    );
                                                setPhoneNumber(numericValue);
                                            }}
                                            maxlength="10"
                                            placeholder="Số điện thoại"
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label className="size-208 w-full-ssm stext-110 cl2">
                                            Phương thức thanh toán:
                                        </Form.Label>
                                        <Form.Control
                                            as="select"
                                            className="rs1-select2 rs2-select2 bor8 bg0 m-b-12 m-t-9"
                                            name="payment_method_id"
                                            value={paymentMethodId}
                                            onChange={(e) =>
                                                setPaymentMethodId(
                                                    e.target.value
                                                )
                                            }
                                            required
                                        >
                                            <option value="">
                                                Chọn phương thức thanh toán
                                            </option>
                                            {paymentMethods.map((method) => (
                                                <option
                                                    key={
                                                        method.payment_method_id
                                                    }
                                                    value={
                                                        method.payment_method_id
                                                    }
                                                >
                                                    {method.payment_method}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                </div>
                                <div className="col-6">
                                    <Form.Group>
                                        <Form.Label className="size-208 w-full-ssm stext-110 cl2">
                                            Mã giảm giá:
                                        </Form.Label>
                                        <div className="row">
                                            <div className="col-8">
                                                <Form.Control
                                                    className="rs1-select2 rs2-select2 bor8 bg0 m-b-12 m-t-9"
                                                    type="text"
                                                    name="voucherCode"
                                                    value={voucherCode}
                                                    onChange={(e) =>
                                                        setVoucherCode(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Mã giảm giá"
                                                />
                                            </div>
                                            <div className="col-4">
                                                <Button
                                                    type="button"
                                                    className="flex-c-m stext-101 cl0 size-102 bg3 bor2 hov-btn3 p-lr-15 trans-04"
                                                    onClick={handleVoucherApply}
                                                >
                                                    Áp dụng
                                                </Button>
                                            </div>
                                        </div>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label className="size-208 w-full-ssm stext-110 cl2">
                                            Địa chỉ giao hàng:
                                        </Form.Label>
                                        <Form.Control
                                            className="rs1-select2 rs2-select2 bor8 bg0 m-b-12 m-t-9"
                                            type="text"
                                            name="address"
                                            value={address}
                                            onChange={(e) =>
                                                setAddress(e.target.value)
                                            }
                                            placeholder="Địa chỉ giao hàng"
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Label className="size-208 w-full-ssm stext-110 cl2">
                                        Phương thức vận chuyển:
                                    </Form.Label>
                                    <Form.Control
                                        as="select"
                                        className="rs1-select2 rs2-select2 bor8 bg0 m-b-12 m-t-9"
                                        name="shipping_method_id"
                                        value={shippingMethodId}
                                        onChange={(e) =>
                                            setShippingMethodId(e.target.value)
                                        }
                                        required
                                    >
                                        <option value="">
                                            Chọn phương thức vận chuyển
                                        </option>
                                        {shippingMethods.map((method) => (
                                            <option
                                                key={method.shipping_method_id}
                                                value={
                                                    method.shipping_method_id
                                                }
                                            >
                                                {method.shipping_method}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </div>
                            </div>
                            <Form.Group className="flex-w flex-t bor12 p-t-15 p-b-30">
                                <Button
                                    type="submit"
                                    className="flex-c-m stext-101 cl0 size-116 bg3 bor14 hov-btn3 p-lr-15 trans-04 pointer"
                                >
                                    Xác nhận hóa đơn
                                </Button>
                            </Form.Group>
                        </Form>
                    </div>
                </div>
            </>
            <Footer />

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowModal(false)}
                    >
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={confirmRemoveProduct}>
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
}

export default ShoppingCart;
