import React, { useEffect, useState } from "react";
import { Form, Modal, Button, InputGroup } from "react-bootstrap";

import request from "../../../../utils/request";
import CartModal from "./modal-cart";

function AddOrderModal({ show, handleClose, onAddOrder }) {
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [shippingMethods, setShippingMethods] = useState([]);
    const [vouchers, setVouchers] = useState([]);
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [total, setTotal] = useState("");
    const [paymentMethodId, setPaymentMethodId] = useState("");
    const [shippingMethodId, setShippingMethodId] = useState("");
    const [userId, setUserId] = useState("");
    const [voucherId, setVoucherId] = useState("");

    const [showCartModal, setShowCartModal] = useState(false);
    const token_type = localStorage.getItem("token_type");
    const access_token = localStorage.getItem("access_token");
    const user_data = JSON.parse(localStorage.getItem("user_data"));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const paymentResponse = await request.get("payment");
                setPaymentMethods(paymentResponse.data.data);

                const shippingResponse = await request.get("shipping");
                setShippingMethods(shippingResponse.data.data);

                const vouchersResponse = await request.get("voucher");
                setVouchers(vouchersResponse.data.data);
                
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const orderData = {
            address,
            phone_number: phoneNumber,
            payment_method_id: paymentMethodId,
            shipping_method_id: shippingMethodId,
            // user_id: userId,
            // voucher_id: voucherId,
        };

        request.defaults.headers.common[
            "Authorization"
        ] = `${token_type} ${access_token}`;

        try {
            const response = await request.post("order", orderData);
            console.log("Order added successfully:", response.data);
            onAddOrder();
            handleClose();
        } catch (error) {
            console.error("Failed to add order:", error);
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
                                    <Form.Label>Người tạo</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Người tạo ..."
                                        value={user_data.name}
                                        // onChange={(e) =>
                                        //     setPhoneNumber(e.target.value)
                                        // }
                                        readOnly
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
                                        {paymentMethods.map((method) => (
                                            <option
                                                key={method.payment_method_id}
                                                value={method.payment_method_id}
                                            >
                                                {method.payment_method}
                                            </option>
                                        ))}
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
                                <Form.Group controlId="inputTotal">
                                    <Form.Label>Tổng tiền</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type="number"
                                            placeholder="Tổng tiền ..."
                                            value={total}
                                            onChange={(e) =>
                                                setTotal(e.target.value)
                                            }
                                            readOnly
                                        />
                                        <InputGroup.Text>VNĐ</InputGroup.Text>
                                    </InputGroup>
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
                                <i class="fas fa-shopping-cart"></i>
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
