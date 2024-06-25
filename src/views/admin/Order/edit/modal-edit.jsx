import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import request from "../../../../utils/request";
import { getErrorMessage } from "../../../../utils/errorMessages";

function StatusOrderModal({ show, handleClose, onUpdateStatus, selectedOrderId }) {
    const [order, setOrder] = useState({ status: 1 });
    const token_type = localStorage.getItem("token_type");
    const access_token = localStorage.getItem("access_token");

    useEffect(() => {
        const fetchOrder = async () => {
            if (selectedOrderId) {
                try {
                    request.defaults.headers.common["Authorization"] = `${token_type} ${access_token}`;
                    const orderResponse = await request.get(`order/${selectedOrderId}`);
                    const orderData = orderResponse.data.data;
                    if (orderData) {
                        setOrder({ status: orderData.status });
                    }
                } catch (error) {
                    let errorMessage = "Lấy dữ liệu thất bại: ";
                    if (error.response && error.response.status) {
                        errorMessage += getErrorMessage(error.response.status);
                    } else {
                        errorMessage += error.message;
                    }
                    toast.error(errorMessage, { position: "top-right" });
                    console.error("Lấy dữ liệu thất bại:", error);
                }
            }
        };
        fetchOrder();
    }, [selectedOrderId, token_type, access_token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const orderData = { status: Number(order.status) };
        request.defaults.headers.common["Authorization"] = `${token_type} ${access_token}`;

        try {
            await request.put(`order/${selectedOrderId}`, orderData);
            onUpdateStatus();
            handleClose();
            toast.success("Cập nhật hóa đơn thành công!", { position: "top-right" });
        } catch (error) {
            let errorMessage = "Cập nhật hóa đơn thất bại: ";
            if (error.response && error.response.status) {
                errorMessage += getErrorMessage(error.response.status);
            } else {
                errorMessage += error.message;
            }
            toast.error(errorMessage, { position: "top-right" });
            console.error("Cập nhật hóa đơn thất bại:", error);
        }
    };

    const handleChange = (field, value) => {
        setOrder((prevOrder) => ({ ...prevOrder, [field]: value }));
    };

    return (
        <Modal show={show} onHide={handleClose} size="md" centered>
            <Modal.Header closeButton>
                <Modal.Title>Chỉnh sửa trạng thái đơn hàng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="inputStatus">
                        <Form.Label>Trạng thái</Form.Label>
                        <Form.Control
                            as="select"
                            value={order.status}
                            onChange={(e) => handleChange("status", e.target.value)}
                        >
                            <option value="1">Chờ duyệt</option>
                            <option value="2">Chờ lấy hàng</option>
                            <option value="3">Đang giao hàng</option>
                            <option value="4">Hoàn thành</option>
                            <option value="0">Đã hủy</option>
                        </Form.Control>
                    </Form.Group>
                    <Modal.Footer>
                        <Button variant="outline-primary" onClick={handleClose}>
                            Hủy bỏ
                        </Button>
                        <Button variant="primary" type="submit">
                            Cập nhật
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default StatusOrderModal;
