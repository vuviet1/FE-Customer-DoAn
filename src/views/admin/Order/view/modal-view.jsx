/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Form, Modal, Button, InputGroup } from "react-bootstrap";
import { useAlert } from '@utils/AlertContext';

import request from "@utils/request";
import ProductModal from "./modal-product";

function ViewOrderModal({ show, handleClose, selectedOrderId }) {
    const [orders, setOrders] = useState({
        address: "",
        phone_number: "",
        status: 1,
        total: "",
        payment_method_id: 0,
        shipping_method_id: 0,
        voucher_id: "",
        payment_status: 0,
    });

    const [showProductModal, setShowProductModal] = useState(false);
    const token_type = localStorage.getItem("token_type");
    const access_token = localStorage.getItem("access_token");
    const { showErrorAlert } = useAlert();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                request.defaults.headers.common[
                    "Authorization"
                ] = `${token_type} ${access_token}`;
                if (selectedOrderId) {
                    const orderResponse = await request.get(
                        `order/${selectedOrderId}`
                    );
                    const orderData = orderResponse.data.data;
                    if (orderData) {
                        setOrders({
                            ...orderData,
                            status: orderData.status,
                            phoneNumber: orderData.phone_number,
                            paymentStatus: orderData.payment_status,
                            paymentMethodName: orderData.payment.payment_method,
                            shippingMethodName:
                                orderData.shipping.shipping_method,
                        });
                    }
                }
            } catch (error) {
                showErrorAlert('Lỗi!', 'Lấy dữ liệu thất bại');
            }
        };

        fetchOrder();
    }, [selectedOrderId]);

    const handleShowProductModal = () => setShowProductModal(true);

    const getStatusText = (status) => {
        switch (status) {
            case 0:
                return "Đã hủy";
            case 1:
                return "Chờ duyệt";
            case 2:
                return "Chờ lấy hàng";
            case 3:
                return "Đang giao hàng";
            case 4:
                return "Hoàn thành";
            default:
                return "Không xác định";
        }
    };

    const getPaymentStatusText = (paymentStatus) => {
        switch (paymentStatus) {
            case 0:
                return "Chưa thanh toán";
            case 1:
                return "Đã thanh toán";
            default:
                return "Không xác định";
        }
    };

    return (
        <>
            <Modal show={show} onHide={handleClose} size="xl" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xem hóa đơn</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <h5>Thông tin đơn hàng</h5>
                        <div className="row">
                            <div className="col-6">
                                <Form.Group controlId="inputUser">
                                    <Form.Label>Tên khách hàng</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Tên khách hàng ..."
                                        value={orders.name}
                                        readOnly
                                    />
                                </Form.Group>
                                <Form.Group controlId="inputPhoneNumber">
                                    <Form.Label>Số điện thoại</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Số điện thoại ..."
                                        value={orders.phoneNumber}
                                        readOnly
                                    />
                                </Form.Group>
                                <Form.Group controlId="inputAddress">
                                    <Form.Label>Địa chỉ</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Địa chỉ ..."
                                        value={orders.address}
                                        readOnly
                                    />
                                </Form.Group>
                                <Form.Group controlId="inputStatus">
                                    <Form.Label>Trạng thái</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={getStatusText(orders.status)}
                                        placeholder="Trạng thái đơn hàng ..."
                                        readOnly
                                    ></Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-6">
                                <Form.Group controlId="inputPayment">
                                    <Form.Label>
                                        Phương thức thanh toán
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Phương thức thanh toán ..."
                                        value={orders.paymentMethodName}
                                        readOnly
                                    />
                                </Form.Group>
                                <Form.Group controlId="inputShipping">
                                    <Form.Label>
                                        Phương thức vận chuyển
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Phương thức vận chuyển ..."
                                        value={orders.shippingMethodName}
                                        readOnly
                                    />
                                </Form.Group>
                                <Form.Group controlId="inputTotal">
                                    <Form.Label>Tổng tiền</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type="number"
                                            placeholder="Tổng tiền ..."
                                            value={orders.total}
                                            readOnly
                                        />
                                        <InputGroup.Text>VNĐ</InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group controlId="inputShipping">
                                    <Form.Label>
                                        Trạng thái thanh toán
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Phương thức vận chuyển ..."
                                        value={getPaymentStatusText(orders.paymentStatus)}
                                        readOnly
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
                                onClick={handleShowProductModal}
                                className="col-6"
                                style={{
                                    justifyContent: "center",
                                    margin: "0 auto",
                                }}
                            >
                                <i className="fas fa-shopping-cart"></i>
                                <span> Hiển thị sản phẩm</span>
                            </Button>
                        </div>
                        <hr />
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-primary" onClick={handleClose}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal hiển thị sản phẩm */}
            <ProductModal
                show={showProductModal}
                handleClose={() => setShowProductModal(false)}
                selectedOrderId={selectedOrderId}
            />
        </>
    );
}

export default ViewOrderModal;
