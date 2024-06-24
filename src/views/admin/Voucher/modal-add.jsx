import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import request from "../../../utils/request";

function AddVoucherModal({ show, handleClose, onAddVoucher }) {
    const [voucher, setVoucher] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [startDay, setStartDay] = useState("");
    const [endDay, setEndDay] = useState("");
    const [status, setStatus] = useState(1);

    const addVoucher = async (e) => {
        e.preventDefault();
        if (new Date(endDay) < new Date(startDay)) {
            alert("Ngày kết thúc không thể nhỏ hơn ngày bắt đầu.");
            return;
        }

        try {
            const response = await request.post("voucher", {
                voucher,
                quantity,
                start_day: startDay,
                end_day: endDay,
                status,
            });
            console.log("Voucher added successfully:", response.data);
            onAddVoucher();
            handleClose();
        } catch (error) {
            console.error("Failed to add voucher:", error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Thêm mới voucher</Modal.Title>
            </Modal.Header>
            <Form onSubmit={addVoucher}>
                <Modal.Body>
                    <Form.Group controlId="voucher">
                        <Form.Label>Tên mã giảm giá</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Tên mã giảm giá ..."
                            value={voucher}
                            onChange={(e) => setVoucher(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="quantity">
                        <Form.Label>Số lượng</Form.Label>
                        <Form.Control
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="startDay">
                        <Form.Label>Ngày bắt đầu</Form.Label>
                        <Form.Control
                            type="date"
                            value={startDay}
                            onChange={(e) => setStartDay(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="endDay">
                        <Form.Label>Ngày kết thúc</Form.Label>
                        <Form.Control
                            type="date"
                            value={endDay}
                            onChange={(e) => setEndDay(e.target.value)}
                            disabled={!startDay}
                        />
                    </Form.Group>
                    <Form.Group controlId="status">
                        <Form.Label>Trạng thái</Form.Label>
                        <Form.Control
                            as="select"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
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
    );
}

export default AddVoucherModal;
