import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";

import request from "../../../utils/request";
import { getErrorMessage } from "../../../utils/errorMessages";

function AddShippingModal({ show, handleClose, onAddShipping }) {
    const [shipping, setShipping] = useState({
        shipping_method: "",
        status: 1,
    });

    const addShipping = async (e) => {
        e.preventDefault();
        try {
            if (!shipping.shipping_method) {
                toast.error("Trường tên phương thức vận chuyển là bắt buộc.", {
                    position: "top-right",
                });
                return;
            }

            await request.post("shipping", {
                shipping_method: shipping.shipping_method,
                status: shipping.status,
            });
            toast.success("Thêm phương thức vận chuyển thành công!", {
                position: "top-right",
            });
            onAddShipping();
            handleClose();
        } catch (error) {
            let errorMessage = "Thêm phương thức thất bại: ";
            if (error.response && error.response.status) {
                errorMessage += getErrorMessage(error.response.status);
            } else {
                errorMessage += error.message;
            }
            toast.error(errorMessage, {
                position: "top-right",
            });
            console.error("Thêm phương thức thất bại:", error);
            handleClose();
        }
    };

    return (
        <>
            <ToastContainer />
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm mới phương thức vận chuyển</Modal.Title>
                </Modal.Header>
                <Form onSubmit={addShipping}>
                    <Modal.Body>
                        <Form.Group controlId="shippingMethod">
                            <Form.Label>Tên phương thức</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Tên phương thức vận chuyển mới ..."
                                value={shipping.shipping_method}
                                onChange={(e) =>
                                    setShipping({
                                        ...shipping,
                                        shipping_method: e.target.value,
                                    })
                                }
                            />
                        </Form.Group>
                        <Form.Group controlId="status">
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
        </>
    );
}

export default AddShippingModal;
