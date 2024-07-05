import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAlert } from '@utils/AlertContext';

import request from "@utils/request";

function AddPaymentModal({ show, handleClose, onAddPayment }) {
    const [payment, setPayment] = useState({
        payment_method: "",
        status: 1,
    });
    const { showSuccessAlert, showErrorAlert } = useAlert();

    const addPayment = async (e) => {
        e.preventDefault();
        try {
            await request.post("payment", {
                payment_method: payment.payment_method,
                status: payment.status,
            });
            showSuccessAlert('Thành công!', 'Thêm phương thức thanh toán thành công!');
            onAddPayment();
            handleClose();
        } catch (error) {
            showErrorAlert('Lỗi!', 'Thêm phương thức thất bại');
            handleClose();
        }
    };

    return (
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm phương thức thanh toán</Modal.Title>
                </Modal.Header>
                <Form onSubmit={addPayment}>
                    <Modal.Body>
                        <Form.Group controlId="paymentMethodAdd">
                            <Form.Label>Tên phương thức</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập tên phương thức thanh toán ..."
                                value={payment.payment_method}
                                onChange={(e) =>
                                    setPayment({
                                        ...payment,
                                        payment_method: e.target.value,
                                    })
                                }
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="statusAdd">
                            <Form.Label>Trạng thái</Form.Label>
                            <Form.Control
                                as="select"
                                value={payment.status}
                                onChange={(e) =>
                                    setPayment({
                                        ...payment,
                                        status: e.target.value,
                                    })
                                }
                            >
                                <option value="1">Sử dụng</option>
                                <option value="0">Không sử dụng</option>
                            </Form.Control>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Hủy bỏ
                        </Button>
                        <Button type="submit" variant="primary">
                            Thêm
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
    );
}

export default AddPaymentModal;
