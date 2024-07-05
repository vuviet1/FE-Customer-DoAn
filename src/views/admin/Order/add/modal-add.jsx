/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import { useAlert } from "@utils/AlertContext";

import request from "@utils/request";
import CartModal from "./modal-cart";

function AddOrderModal({ show, handleClose, onAddOrder }) {
    const [cartItems, setCartItems] = useState([]);
    // const [paymentMethods, setPaymentMethods] = useState([]);
    const [shippingMethods, setShippingMethods] = useState([]);
    const [address, setAddress] = useState("");
    const [vouchers, setVouchers] = useState("");
    const [voucherCode, setVoucherCode] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [paymentMethodId, setPaymentMethodId] = useState("");
    const [shippingMethodId, setShippingMethodId] = useState("");
    const [name, setName] = useState("");

    const [isVoucherValid, setIsVoucherValid] = useState(false);
    const [showCartModal, setShowCartModal] = useState(false);
    const { showSuccessAlert, showErrorAlert } = useAlert();

    const token_type = localStorage.getItem("token_type");
    const access_token = localStorage.getItem("access_token");
    const user_data = JSON.parse(localStorage.getItem("user_data"));

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [shippingResponse, voucherResponse] =
                    await Promise.all([
                        // request.get("payment"),
                        request.get("shipping"),
                        request.get("voucher"),
                    ]);
                // const activePayments = paymentResponse.data.data.filter(
                //     (payment) => payment.status === 1
                // );
                const activeShippings = shippingResponse.data.data.filter(
                    (shipping) => shipping.status === 1
                );
                const activeVouchers = voucherResponse.data.data.filter(
                    (voucher) => voucher.status === 1
                );
                // setPaymentMethods(activePayments);
                setShippingMethods(activeShippings);
                setVouchers(activeVouchers);
            } catch (error) {
                showErrorAlert("Lỗi!", "Lấy dữ liệu thất bại.");
            }
        };

        fetchAllData();
        fetchCartItems()
    }, []);

    const fetchCartItems = async () => {
        const token_type = localStorage.getItem("token_type");
        const access_token = localStorage.getItem("access_token");
        request.defaults.headers.common[
            "Authorization"
        ] = `${token_type} ${access_token}`;
        try {
            if (!access_token) return;
            const response = await request.get("cart");
            const cartData = response.data.data;
            setCartItems(cartData);
        } catch (error) {
            showErrorAlert("Lỗi!", "Lấy dữ liệu thất bại.");
        }
    };

    // Kiểm tra voucher
    const handleCheckVoucher = async () => {
        try {
            const voucher = vouchers.find(
                (v) => v.voucher_code === voucherCode
            );
            if (voucher && voucher.status === 1) {
                const currentDate = new Date();
                const startDate = new Date(voucher.start_day);
                const endDate = new Date(voucher.end_day);
                const quantity = voucher.quantity
                if (currentDate >= startDate && currentDate <= endDate && quantity > 0) {
                    setIsVoucherValid(true);
                    showSuccessAlert(
                        "Thành công!",
                        "Mã giảm giá sử dụng được!"
                    );
                    return;
                }
            }
            setIsVoucherValid(false);
            showErrorAlert("Lỗi!", "Mã giảm giá không hợp lệ hoặc đã hết hạn");
        } catch (error) {
            setIsVoucherValid(false);
            showErrorAlert("Lỗi!", "Kiểm tra mã giảm giá thất bại");
        }
    };

    // Tạo hóa đơn
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isVoucherValid && voucherCode) {
            showErrorAlert("Lỗi!", "Mã giảm giá không hợp lệ hoặc đã hết hạn");
            return;
        }

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
            address,
            name: name ? name : user_data.name,
            phone_number: phoneNumber,
            payment_method_id: paymentMethodId,
            shipping_method_id: shippingMethodId,
            voucher_code: voucherCode,
            shipping_code: "",
        };

        request.defaults.headers.common[
            "Authorization"
        ] = `${token_type} ${access_token}`;

        try {
            await request.post("order", orderData);
            showSuccessAlert("Thành công!", "Đã tạo hóa đơn thành công!");
            onAddOrder();
            handleClose();
        } catch (error) {
            showErrorAlert("Lỗi!", "Thêm hóa đơn thất bại");
            handleClose();
        }
    };

    const handleShowCartModal = () => setShowCartModal(true);

    return (
        <>
            <Modal show={show} onHide={handleClose} size="xl" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm mới đơn hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <h5>Thông tin đơn hàng</h5>
                        <div className="row">
                            <div className="col-6">
                                <Form.Group controlId="inputUser">
                                    <Form.Label>Tên khách hàng</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Tên khách hàng ..."
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                    />
                                </Form.Group>
                                <Form.Group controlId="inputPhoneNumber">
                                    <Form.Label>Số điện thoại</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Số điện thoại ..."
                                        value={phoneNumber}
                                        onChange={(e) =>
                                            setPhoneNumber(e.target.value)
                                        }
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-6">
                                <Form.Group controlId="inputPaymentMethod">
                                    <Form.Label>
                                        Phương thức thanh toán
                                    </Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={paymentMethodId}
                                        onChange={(e) =>
                                            setPaymentMethodId(e.target.value)
                                        }
                                    >
                                        <option value="">
                                            Chọn phương thức thanh toán
                                        </option>
                                        <option value="1">
                                            COD
                                        </option>
                                        {/* {paymentMethods.map((method) => (
                                            <option
                                                key={method.payment_method_id}
                                                value={method.payment_method_id}
                                            >
                                                {method.payment_method}
                                            </option>
                                        ))} */}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="inputShippingMethod">
                                    <Form.Label>
                                        Phương thức vận chuyển
                                    </Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={shippingMethodId}
                                        onChange={(e) =>
                                            setShippingMethodId(e.target.value)
                                        }
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
                                </Form.Group>
                            </div>
                            <div className="col-12">
                                <div className="row">
                                    <div className="col-8">
                                        <Form.Group controlId="inputVoucher">
                                            <Form.Label>
                                                Mã giảm giá(nếu có)
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Mã giảm giá ..."
                                                value={voucherCode}
                                                onChange={(e) =>
                                                    setVoucherCode(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </Form.Group>
                                    </div>
                                    <div
                                        className="col-4"
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Button
                                            onClick={handleCheckVoucher}
                                            className="col-6"
                                            style={{
                                                justifyContent: "center",
                                                margin: "0 auto",
                                            }}
                                        >
                                            Kiểm tra mã giảm giá
                                        </Button>
                                    </div>
                                </div>
                                <Form.Group controlId="inputAddress">
                                    <Form.Label>Địa chỉ</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Địa chỉ ..."
                                        value={address}
                                        onChange={(e) =>
                                            setAddress(e.target.value)
                                        }
                                    />
                                </Form.Group>
                            </div>
                        </div>
                        <hr />
                        <h5 style={{ marginTop: "15px" }}>
                            Thông tin chi tiết đơn hàng
                        </h5>
                        <div
                            className="row"
                            style={{ marginTop: "15px", marginBottom: "20px" }}
                        >
                            <Button
                                onClick={handleShowCartModal}
                                className="col-6"
                                style={{
                                    justifyContent: "center",
                                    margin: "0 auto",
                                }}
                            >
                                <i className="fas fa-shopping-cart"></i>
                                <span> Giỏ hàng</span>
                            </Button>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col-6">{/*  */}</div>
                        </div>
                        <Modal.Footer>
                            <Button
                                variant="outline-primary"
                                onClick={handleClose}
                            >
                                Hủy bỏ
                            </Button>
                            <Button variant="primary" type="submit">
                                Thêm mới
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal giỏ hàng */}
            <CartModal
                show={showCartModal}
                handleClose={() => setShowCartModal(false)}
            />
        </>
    );
}

export default AddOrderModal;
