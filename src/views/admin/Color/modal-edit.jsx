/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAlert } from '@utils/AlertContext';

import request from "@utils/request";

function EditColorModal({ show, handleClose, selectedColorId, onUpdateColor }) {
    const [color, setColor] = useState({
        color: "",
        status: 1,
    });
    const { showSuccessAlert, showErrorAlert } = useAlert();

    useEffect(() => {
        const fetchColor = async () => {
            try {
                const response = await request.get(
                    `color/${selectedColorId}`
                );
                if (response.data.data) {
                    setColor(response.data.data);
                } else {
                    console.error("No data returned from the API");
                }
            } catch (error) {
                showErrorAlert('Lỗi!', 'Lấy dữ liệu thất bại');
            }
        };

            fetchColor();
    }, []);

    const updateColor = async (e) => {
        e.preventDefault();
        try {
            await request.put(`color/${selectedColorId}`, {
                color: color.color,
                status: color.status,
            });
            onUpdateColor();
            handleClose();
            showSuccessAlert('Thành công!', 'Cập nhật màu thành công!');
        } catch (error) {
            showErrorAlert('Lỗi!', 'Cập nhật màu thất bại');
            handleClose();
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
                        Cập nhật
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default EditColorModal;
