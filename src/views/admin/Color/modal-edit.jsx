import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

import request from "../../../utils/request";
import { getErrorMessage } from "../../../utils/errorMessages";

function EditColorModal({ show, handleClose, selectedColorId, onUpdateColor }) {
    const [color, setColor] = useState({
        color: "",
        status: 1,
    });

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
                let errorMessage = "Hiển thị màu thất bại: ";
                if (error.response && error.response.status) {
                    errorMessage += getErrorMessage(error.response.status);
                } else {
                    errorMessage += error.message;
                }
                toast.error(errorMessage, {
                    position: "top-right",
                });
                console.error("Lỗi khi lấy dữ liệu:", error);
            }
        };

        if (selectedColorId) {
            fetchColor();
        }
    }, [selectedColorId]);

    const updateColor = async (e) => {
        e.preventDefault();
        try {
            if (!color.color) {
                toast.error("Trường tên màu là bắt buộc.", {
                    position: "top-right",
                });
                return;
            }

            await request.put(`color/${selectedColorId}`, {
                color: color.color,
                status: color.status,
            });
            onUpdateColor();
            handleClose();
            toast.success("Cập nhật màu thành công!", {
                position: "top-right",
            });
        } catch (error) {
            let errorMessage = "Cập nhật màu thất bại: ";
            if (error.response && error.response.status) {
                errorMessage += getErrorMessage(error.response.status);
            } else {
                errorMessage += error.message;
            }
            toast.error(errorMessage, {
                position: "top-right",
            });
            console.error("Cập nhật màu thất bại:", error);
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
