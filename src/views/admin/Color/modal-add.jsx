import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";

import request from "../../../utils/request";
import { getErrorMessage } from "../../../utils/errorMessages";

function AddColorModal({ show, handleClose, onAddColor }) {
    const [color, setColor] = useState({
        color: "",
        status: 1,
    });

    const addColor = async (e) => {
        e.preventDefault();
        try {
            if (!color.color) {
                toast.error("Trường màu là bắt buộc.", {
                    position: "top-right",
                });
                return;
            }

            await request.post("color", {
                color: color.color,
                status: color.status,
            });
            toast.success("Thêm màu thành công!", {
                position: "top-right",
            });
            onAddColor();
            handleClose();
        } catch (error) {
            let errorMessage = "Thêm màu thất bại: ";
            if (error.response && error.response.status) {
                errorMessage += getErrorMessage(error.response.status);
            } else {
                errorMessage += error.message;
            }
            toast.error(errorMessage, {
                position: "top-right",
            });
            console.error("Thêm màu thất bại:", error);
            handleClose();
        }
    };

    return (
        <>
            <ToastContainer />
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
        </>
    );
}

export default AddColorModal;
