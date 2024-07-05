import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAlert } from '@utils/AlertContext';

import request from "@utils/request";

function AddColorModal({ show, handleClose, onAddColor }) {
    const [color, setColor] = useState({
        color: "",
        status: 1,
    });
    const { showSuccessAlert, showErrorAlert } = useAlert();

    const addColor = async (e) => {
        e.preventDefault();
        try {
            await request.post("color", {
                color: color.color,
                status: color.status,
            });
            showSuccessAlert('Thành công!', 'Thêm màu thành công!');
            onAddColor();
            handleClose();
        } catch (error) {
            showErrorAlert('Lỗi!', 'Thêm màu thất bại');
            handleClose();
        }
    };

    return (
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm mới màu</Modal.Title>
                </Modal.Header>
                <Form onSubmit={addColor}>
                    <Modal.Body>
                        <Form.Group controlId="color">
                            <Form.Label>Tên màu</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Tên màu mới ..."
                                value={color.color}
                                onChange={(e) =>
                                    setColor({
                                        ...color,
                                        color: e.target.value,
                                    })
                                }
                            />
                        </Form.Group>
                        <Form.Group controlId="status">
                            <Form.Label>Trạng thái</Form.Label>
                            <Form.Control
                                as="select"
                                value={color.status}
                                onChange={(e) =>
                                    setColor({
                                        ...color,
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
                            Thêm mới
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
    );
}

export default AddColorModal;
