import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import request from "../../../utils/request";

function EditPaymentModal({ show, handleClose, selectedPaymentId, onUpdatePayment }) {
    const [payment, setPayment] = useState({
        payment_method: "",
        status: "",
    });

    useEffect(() => {
        const fetchPayment = async () => {
            try {
                const response = await request.get(`payment/${selectedPaymentId}`);
                if (response.data.data) {
                    setPayment(response.data.data);
                } else {
                    console.error("No data returned from the API");
                }
            } catch (error) {
                console.error("Error while fetching payment data:", error);
            }
        };

        if (selectedPaymentId) {
            fetchPayment();
        }
    }, [selectedPaymentId]);

    const updatePayment = async (e) => {
        e.preventDefault();
        try {
            if (!payment.payment_method) {
                console.error("Trường phương thức thanh toán là bắt buộc.");
                return;
            }

            await request.put(`payment/${selectedPaymentId}`, {
                payment_method: payment.payment_method,
                status: payment.status,
            });
            onUpdatePayment();
            handleClose();
        } catch (error) {
            console.error("Error updating payment:", error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Cập nhật phương thức thanh toán</Modal.Title>
            </Modal.Header>
            <Form onSubmit={updatePayment}>
                <Modal.Body>
                    <Form.Group controlId="paymentMethodEdit">
                        <Form.Label>Tên phương thức</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Cập nhật tên phương thức thanh toán mới ..."
                            value={payment.payment_method}
                            onChange={(e) =>
                                setPayment({
                                    ...payment,
                                    payment_method: e.target.value,
                                })
                            }
                        />
                    </Form.Group>
                    <Form.Group controlId="statusEdit">
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
                        Cập nhật
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default EditPaymentModal;
