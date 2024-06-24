import React, { useEffect, useState } from "react";
import { Form, Modal, Button, InputGroup } from "react-bootstrap";
import request from "../../../../utils/request";
import ProductModal from "./modal-cart";

function EditOrderModal({ show, handleClose, onEditOrder, selectedOrderId }) {
    const [orders, setOrders] = useState({
        order_id: 1,
        address: "",
        phone_number: "",
        status: 0,
        total: "",
        payment_method_id: 0,
        shipping_method_id: 0,
        user_id: "",
        employee_id: 1,
        voucher_id: "",
    });

    const [showCartModal, setShowCartModal] = useState(false);
    const token_type = localStorage.getItem("token_type");
    const access_token = localStorage.getItem("access_token");
    const user_data = JSON.parse(localStorage.getItem("user_data"));

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                request.defaults.headers.common[
                    "Authorization"
                ] = `${token_type} ${access_token}`;
                // Fetch the existing order data
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
                            paymentMethodId: orderData.payment_method_id,
                            shippingMethodId: orderData.shipping_method_id,
                        });
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchOrder();
    }, [selectedOrderId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const orderData = {
            status: orders.status,
        };

        request.defaults.headers.common[
            "Authorization"
        ] = `${token_type} ${access_token}`;

        try {
            const response = await request.put(
                `order/${selectedOrderId}`,
                orderData
            );
            console.log("Order updated successfully:", response.data);
            onEditOrder();
            handleClose();
        } catch (error) {
            console.error("Failed to update order:", error);
        }
    };

    const handleShowCartModal = () => setShowCartModal(true);

    const handleChange = (field, value) => {
        setOrders((prevOrders) => ({
            ...prevOrders,
            [field]: value,
        }));
    };

    return (
        <>
            <Modal show={show} onHide={handleClose} size="xl" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Chỉnh sửa đơn hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <h5>Thông tin đơn hàng</h5>
                        <div className="row">
                            <div className="col-6">
                                <Form.Group controlId="inputUser">
                                    <Form.Label>Người tạo</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Người tạo ..."
                                        value={user_data.name}
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
                                <Form.Group controlId="inputStatus">
                                    <Form.Label>Trạng thái</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={orders.status}
                                        onChange={(e) =>
                                            handleChange(
                                                "status",
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="0">Chờ duyệt</option>
                                        <option value="1">Đang giao hàng</option>
                                        <option value="2">Hoàn thành</option>
                                        <option value="3">Đã hủy</option>
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-6">
                                <Form.Group controlId="inputPayment">
                                    <Form.Label>Phương thức thanh toán</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Phương thức thanh toán ..."
                                        value={orders.paymentMethodId}
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
                                        value={orders.shippingMethodId}
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
                            </div>
                            <div className="col-12">
                                <Form.Group controlId="inputAddress">
                                    <Form.Label>Địa chỉ</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Địa chỉ ..."
                                        value={orders.address}
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
                        <Modal.Footer>
                            <Button
                                variant="outline-primary"
                                onClick={handleClose}
                            >
                                Hủy bỏ
                            </Button>
                            <Button variant="primary" type="submit">
                                Cập nhật
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal giỏ hàng */}
            <ProductModal
                show={showCartModal}
                handleClose={() => setShowCartModal(false)}
                selectedOrderId={selectedOrderId}
            />
        </>
    );
}

export default EditOrderModal;
