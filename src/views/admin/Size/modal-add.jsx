import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAlert } from '@utils/AlertContext';

import request from "../../../utils/request";

function AddSizeModal({ show, handleClose, onAddSize }) {
    const [size, setSize] = useState({
        size: "",
        status: 1,
    });
    const { showSuccessAlert, showErrorAlert } = useAlert();

    const addSize = async (e) => {
        e.preventDefault();
        try {
            if (!size.size) {
                showErrorAlert('Lỗi!', 'Trường kích cỡ là bắt buộc');
                return;
            }

            await request.post("size", {
                size: size.size,
                status: size.status,
            });
            showSuccessAlert('Thành công!', 'Thêm kích cỡ thành công!');
            onAddSize();
            handleClose();
        } catch (error) {
            showErrorAlert('Lỗi!', 'Thêm kích cỡ thất bại');
            handleClose();
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
                                value={size.size}
                                onChange={(e) =>
                                    setSize({
                                        ...size,
                                        size: e.target.value,
                                    })
                                }
                            />
                        </Form.Group>
                        <Form.Group controlId="status">
                            <Form.Label>Trạng thái</Form.Label>
                            <Form.Control
                                as="select"
                                value={size.status}
                                onChange={(e) =>
                                    setSize({
                                        ...size,
                                        status: e.target.value,
                                    })
                                }
                            >
                                <option value="1" defaultValue={1}>
                                    Sử dụng
                                </option>
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
