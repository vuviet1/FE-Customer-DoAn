/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Form, Modal, Button, Image } from "react-bootstrap";
import { useAlert } from '@utils/AlertContext';

import request from "@utils/request";

function ViewCustomerModal({ show, handleClose, selectedCustomerId }) {
    const [customer, setCustomer] = useState({
        name: "",
        email: "",
        password: "",
        role: 0,
        google_id: "",
        avatar: "",
        phone: "",
        address: "",
        status: 1,
    });
    const { showErrorAlert } = useAlert();

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const response = await request.get(`user/${selectedCustomerId}`);
                if (response.data.data) {
                    setCustomer(response.data.data);
                } else {
                    console.error("No data returned from the API");
                }
            } catch (error) {
                showErrorAlert('Lỗi!', 'Lấy dữ liệu thất bại');
            }
        };

            fetchCustomer();
    }, []);

    return (
        <>
            <Modal show={show} onHide={handleClose} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xem thông tin khách hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-6">
                            <Form.Group
                                controlId="customerAvatar"
                                style={{
                                    display: "grid",
                                    textAlign: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Form.Label>Ảnh đại diện</Form.Label>
                                <Image
                                    src={
                                        "http://127.0.0.1:8000/uploads/avatar/" +
                                        customer.avatar
                                    }
                                    alt={customer.name}
                                    style={{
                                        width: "250px",
                                        height: "250px",
                                    }}
                                    thumbnail
                                />
                            </Form.Group>
                        </div>
                        <div className="col-6">
                            <Form.Group controlId="customerName">
                                <Form.Label>Tên khách hàng</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Tên khách hàng"
                                    value={customer.name}
                                    readOnly
                                />
                            </Form.Group>
                            <Form.Group controlId="customerEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Email"
                                    value={customer.email}
                                    readOnly
                                />
                            </Form.Group>
                            <Form.Group controlId="customerPhone">
                                <Form.Label>Số điện thoại</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Số điện thoại"
                                    value={customer.phone}
                                    readOnly
                                />
                            </Form.Group>
                            <Form.Group controlId="customerAddress">
                                <Form.Label>Địa chỉ</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Địa chỉ"
                                    value={customer.address}
                                    readOnly
                                />
                            </Form.Group>
                        </div>

                        <div className="col-12">
                            <Form.Group controlId="customerRole">
                                <Form.Label>Vai trò</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Vai trò"
                                    value={customer.role === 1 ? "Quản trị viên" : "Khách hàng"}
                                    readOnly
                                />
                            </Form.Group>
                            <Form.Group controlId="customerGoogleId">
                                <Form.Label>Google ID</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Google ID"
                                    value={customer.google_id}
                                    readOnly
                                />
                            </Form.Group>
                            <Form.Group controlId="customerStatus">
                                <Form.Label>Trạng thái</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Trạng thái"
                                    value={customer.status === 1 ? "Sử dụng" : "Không sử dụng"}
                                    readOnly
                                />
                            </Form.Group>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ViewCustomerModal;
