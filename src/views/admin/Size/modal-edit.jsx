/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAlert } from '@utils/AlertContext';

import request from "../../../utils/request";

function EditSizeModal({ show, handleClose, selectedSizeId, onUpdateSize }) {
    const [size, setSize] = useState({
        size: "",
        status: 1,
    });
    const { showSuccessAlert, showErrorAlert } = useAlert();

    useEffect(() => {
        const fetchSize = async () => {
            try {
                const response = await request.get(`size/${selectedSizeId}`);
                if (response.data.data) {
                    setSize(response.data.data);
                } else {
                    console.error("No data returned from the API");
                }
            } catch (error) {
                showErrorAlert('Lỗi!', 'Hiển thị kích cỡ thất bại');
            }
        };

        if (selectedSizeId) {
            fetchSize();
        }
    }, [selectedSizeId]);

    const updateSize = async (e) => {
        e.preventDefault();
        try {
            if (!size.size) {
                showErrorAlert('Lỗi!', 'Trường kích cỡ là bắt buộc');
                return;
            }

            await request.post(`size/${selectedSizeId}?_method=PUT`, {
                size: size.size,
                status: size.status,
            });
            onUpdateSize();
            handleClose();
            showSuccessAlert('Thành công!', 'Cập nhật kích cỡ thành công!');
        } catch (error) {
            showErrorAlert('Lỗi!', 'Cập nhật kích cỡ thất bại');
            handleClose();
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Cập nhật kích thước</Modal.Title>
            </Modal.Header>
            <Form onSubmit={updateSize}>
                <Modal.Body>
                    <Form.Group controlId="sizeEdit">
                        <Form.Label>Kích thước</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Cập nhật kích thước mới ..."
                            value={size.size}
                            onChange={(e) =>
                                setSize({
                                    ...size,
                                    size: e.target.value,
                                })
                            }
                        />
                    </Form.Group>
                    <Form.Group controlId="statusEdit">
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

export default EditSizeModal;
