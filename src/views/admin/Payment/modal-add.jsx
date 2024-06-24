import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import request from "../../../utils/request";

function AddPaymentModal({ show, handleClose, onAddPayment }) {
    const [paymentMethod, setPaymentMethod] = useState("");
    const [status, setStatus] = useState(1);

    const addPayment = async (e) => {
        e.preventDefault();
        try {
            const response = await request.post("payment", {
                payment_method: paymentMethod,
                status: status,
            });
            console.log("Payment method added successfully:", response.data);
            toast.success("Payment method added successfully!", {
                position: "top-right"
            });
            onAddPayment();
            handleClose();
        } catch (error) {
            toast.error("Failed to add payment method: " + error.message, {
                position: "top-right"
            });
            console.error("Failed to add payment method:", error);
        }
    };

    return (
        <>
            <ToastContainer />
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm mới phương thức thanh toán</Modal.Title>
                </Modal.Header>
                <Form onSubmit={addPayment}>
                    <Modal.Body>
                        <Form.Group controlId="paymentMethod">
                            <Form.Label>Tên phương thức</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Tên phương thức thanh toán mới ..."
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="status">
                            <Form.Label>Trạng thái</Form.Label>
                            <Form.Control
                                as="select"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="1" defaultValue={1}>Sử dụng</option>
                                <option value="0">Không sử dụng</option>
                            </Form.Control>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Hủy bỏ
                        </Button>
                        <Button type="submit" variant="primary">
                            Thêm mới
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}

export default AddPaymentModal;
