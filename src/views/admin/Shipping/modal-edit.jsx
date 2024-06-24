import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import request from "../../../utils/request";

function EditShippingModal({ show, handleClose, selectedShippingId, onUpdateShipping }) {
    const [shipping, setShipping] = useState({
        shipping_method: "",
        status: "",
    });

    useEffect(() => {
        const fetchShipping = async () => {
            try {
                const response = await request.get(`shipping/${selectedShippingId}`);
                if (response.data.data) {
                    setShipping(response.data.data);
                } else {
                    console.error("No data returned from the API");
                }
            } catch (error) {
                console.error("Error while fetching shipping data:", error);
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
                console.error("Trường phương thức vận chuyển là bắt buộc.");
                return;
            }

            await request.put(`shipping/${selectedShippingId}`, {
                shipping_method: shipping.shipping_method,
                status: shipping.status,
            });
            onUpdateShipping();
            handleClose();
        } catch (error) {
            console.error("Error updating shipping:", error);
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
