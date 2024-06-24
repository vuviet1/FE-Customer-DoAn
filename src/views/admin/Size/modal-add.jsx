import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import request from "../../../utils/request";

function AddSizeModal({ show, handleClose, onAddSize }) {
    const [size, setSize] = useState("");
    const [status, setStatus] = useState(1);

    const addSize = async (e) => {
        e.preventDefault();
        try {
            const response = await request.post("size", {
                size: size,
                status: status,
            });
            console.log("Size added successfully:", response.data);
            onAddSize();
            handleClose();
        } catch (error) {
            console.error("Failed to add size:", error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Thêm mới kích thước</Modal.Title>
            </Modal.Header>
            <Form onSubmit={addSize}>
                <Modal.Body>
                    <Form.Group controlId="size">
                        <Form.Label>Kích thước</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Tên kích thước mới ..."
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
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

export default AddSizeModal;
