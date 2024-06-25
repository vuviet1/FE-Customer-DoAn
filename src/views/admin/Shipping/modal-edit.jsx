import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

import request from "../../../utils/request";
import { getErrorMessage } from "../../../utils/errorMessages";

function EditShippingModal({ show, handleClose, selectedShippingId, onUpdateShipping }) {
    const [shipping, setShipping] = useState({
        shipping_method: "",
        status: 1,
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
                let errorMessage = "Hiển thị phương thức thanh toán thất bại: ";
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

        if (selectedShippingId) {
            fetchShipping();
        }
    }, [selectedShippingId]);

    const updateShipping = async (e) => {
        e.preventDefault();
        try {
            if (!shipping.shipping_method) {
                toast.error("Trường tên phương thức là bắt buộc.", {
                    position: "top-right",
                });
                return;
            }

            await request.put(`shipping/${selectedShippingId}?_method=PUT`, {
                shipping_method: shipping.shipping_method,
                status: shipping.status,
            });
            onUpdateShipping();
            handleClose();
            toast.success("Cập nhật phương thức thanh toán thành công!", {
                position: "top-right",
            });
        } catch (error) {
            let errorMessage = "Cập nhật phương thức thất bại: ";
            if (error.response && error.response.status) {
                errorMessage += getErrorMessage(error.response.status);
            } else {
                errorMessage += error.message;
            }
            toast.error(errorMessage, {
                position: "top-right",
            });
            console.error("Cập nhật phương thức thất bại:", error);
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
