/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAlert } from '@utils/AlertContext';

import request from "@utils/request";

function EditShippingModal({ show, handleClose, selectedShippingId, onUpdateShipping }) {
    const [shipping, setShipping] = useState({
        shipping_method: "",
        status: 1,
    });
    const { showSuccessAlert, showErrorAlert } = useAlert();

    useEffect(() => {
        const fetchShipping = async () => {
            try {
                const response = await request.get(`shipping/${selectedShippingId}`);
                    setShipping(response.data.data);
            } catch (error) {
                showErrorAlert('Lỗi!', 'Hiển thị phương thức thanh toán thất bại');
            }
        };

        if (selectedShippingId) {
            fetchShipping();
        }
    }, [selectedShippingId]);

    const updateShipping = async (e) => {
        e.preventDefault();
        try {
            if (!shipping.shipping_method) {
                showErrorAlert('Lỗi!', 'Trường tên phương thức là bắt buộc');
                return;
            }

            await request.put(`shipping/${selectedShippingId}?_method=PUT`, {
                shipping_method: shipping.shipping_method,
                status: shipping.status,
            });
            onUpdateShipping();
            handleClose();
            showSuccessAlert('Thành công!', 'Cập nhật phương thức thanh toán thành công!');
        } catch (error) {
            showErrorAlert('Lỗi!', 'Cập nhật phương thức thất bại');
            handleClose();
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Cập nhật phương thức vận chuyển</Modal.Title>
            </Modal.Header>
            <Form onSubmit={updateShipping}>
                <Modal.Body>
                    <Form.Group controlId="shippingMethodEdit">
                        <Form.Label>Tên phương thức</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Cập nhật tên phương thức vận chuyển mới ..."
                            value={shipping.shipping_method}
                            onChange={(e) =>
                                setShipping({
                                    ...shipping,
                                    shipping_method: e.target.value,
                                })
                            }
                        />
                    </Form.Group>
                    <Form.Group controlId="statusEdit">
                        <Form.Label>Trạng thái</Form.Label>
                        <Form.Control
                            as="select"
                            value={shipping.status}
                            onChange={(e) =>
                                setShipping({
                                    ...shipping,
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

export default EditShippingModal;
