import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import request from "../../../utils/request";

function AddShippingModal({ show, handleClose, onAddShipping }) {
    const [shippingMethod, setShippingMethod] = useState("");
    const [status, setStatus] = useState(1);

    const addShipping = async (e) => {
        e.preventDefault();
        try {
            const response = await request.post("shipping", {
                shipping_method: shippingMethod,
                status: status,
            });
            console.log("Shipping method added successfully:", response.data);
            onAddShipping();
            handleClose();
        } catch (error) {
            console.error("Failed to add shipping method:", error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Thêm mới phương thức vận chuyển</Modal.Title>
            </Modal.Header>
            <Form onSubmit={addShipping}>
                <Modal.Body>
                    <Form.Group controlId="shippingMethod">
                        <Form.Label>Tên phương thức</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Tên phương thức vận chuyển mới ..."
                            value={shippingMethod}
                            onChange={(e) => setShippingMethod(e.target.value)}
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
    );
}

export default AddShippingModal;
