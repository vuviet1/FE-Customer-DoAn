import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

import request from "../../../utils/request";
import { getErrorMessage } from "../../../utils/errorMessages";

function EditPaymentModal({
    show,
    handleClose,
    selectedPaymentId,
    onUpdatePayment,
}) {
    const [payment, setPayment] = useState({
        payment_method: "",
        status: 1,
    });

    useEffect(() => {
        const fetchPayment = async () => {
            try {
                const response = await request.get(
                    `payment/${selectedPaymentId}`
                );
                if (response.data.data) {
                    setPayment(response.data.data);
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

        if (selectedPaymentId) {
            fetchPayment();
        }
    }, [selectedPaymentId]);

    const updatePayment = async (e) => {
        e.preventDefault();
        try {
            if (!payment.payment_method) {
                toast.error("Trường tên phương thức là bắt buộc.", {
                    position: "top-right",
                });
                return;
            }

            await request.post(`payment/${selectedPaymentId}?_method=PUT`, {
                payment_method: payment.payment_method,
                status: payment.status,
            });
            onUpdatePayment();
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
        <>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Cập nhật phương thức thanh toán</Modal.Title>
                </Modal.Header>
                <Form onSubmit={updatePayment}>
                    <Modal.Body>
                        <Form.Group controlId="paymentMethodEdit">
                            <Form.Label>Tên phương thức</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Cập nhật tên phương thức thanh toán mới ..."
                                value={payment.payment_method}
                                onChange={(e) =>
                                    setPayment({
                                        ...payment,
                                        payment_method: e.target.value,
                                    })
                                }
                            />
                        </Form.Group>
                        <Form.Group controlId="statusEdit">
                            <Form.Label>Trạng thái</Form.Label>
                            <Form.Control
                                as="select"
                                value={payment.status}
                                onChange={(e) =>
                                    setPayment({
                                        ...payment,
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
        </>
    );
}

export default EditPaymentModal;
