import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import request from "../../../utils/request";

function EditColorModal({ show, handleClose, selectedColorId, onUpdateColor }) {
    const [color, setColor] = useState("");
    const [status, setStatus] = useState(1);

    useEffect(() => {
        const fetchColor = async () => {
            try {
                const response = await request.get(`color/${selectedColorId}`);
                const data = response.data.data;
                setColor(data.color);
                setStatus(data.status);
            } catch (error) {
                console.error("Error fetching color:", error);
            }
        };

        if (selectedColorId) {
            fetchColor();
        }
    }, [selectedColorId]);

    const updateColor = async (e) => {
        e.preventDefault();
        try {
            await request.put(`color/${selectedColorId}`, {
                color,
                status,
            });
            onUpdateColor();
            handleClose();
        } catch (error) {
            console.error("Failed to update color:", error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Cập nhật màu</Modal.Title>
            </Modal.Header>
            <Form onSubmit={updateColor}>
                <Modal.Body>
                    <Form.Group controlId="color">
                        <Form.Label>Tên màu</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Cập nhật tên màu ..."
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="status">
                        <Form.Label>Trạng thái</Form.Label>
                        <Form.Control
                            as="select"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
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

export default EditColorModal;
