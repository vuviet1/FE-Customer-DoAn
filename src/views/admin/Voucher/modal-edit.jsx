import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import request from "../../../utils/request";

function EditVoucherModal({ show, handleClose, selectedVoucherId, onUpdateVoucher }) {
    const [voucher, setVoucher] = useState({
        voucher: "",
        quantity: "",
        start_day: "",
        end_day: "",
        status: "",
    });

    useEffect(() => {
        const fetchVoucher = async () => {
            try {
                const response = await request.get(`voucher/${selectedVoucherId}`);
                if (response.data.data) {
                    setVoucher(response.data.data);
                } else {
                    console.error("No data returned from the API");
                }
            } catch (error) {
                console.error("Error while fetching voucher data:", error);
            }
        };

        if (selectedVoucherId) {
            fetchVoucher();
        }
    }, [selectedVoucherId]);

    const updateVoucher = async (e) => {
        e.preventDefault();
        if (new Date(voucher.end_day) < new Date(voucher.start_day)) {
            alert("Ngày kết thúc không thể nhỏ hơn ngày bắt đầu.");
            return;
        }

        try {
            await request.put(`voucher/${selectedVoucherId}`, {
                voucher: voucher.voucher,
                quantity: voucher.quantity,
                start_day: voucher.start_day,
                end_day: voucher.end_day,
                status: voucher.status,
            });
            onUpdateVoucher();
            handleClose();
        } catch (error) {
            console.error("Error updating voucher:", error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Cập nhật mã giảm giá</Modal.Title>
            </Modal.Header>
            <Form onSubmit={updateVoucher}>
                <Modal.Body>
                    <Form.Group controlId="voucherEdit">
                        <Form.Label>Voucher</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Cập nhật mã giảm giá ..."
                            value={voucher.voucher}
                            onChange={(e) =>
                                setVoucher({ ...voucher, voucher: e.target.value })
                            }
                        />
                    </Form.Group>
                    <Form.Group controlId="quantityEdit">
                        <Form.Label>Số lượng</Form.Label>
                        <Form.Control
                            type="number"
                            value={voucher.quantity}
                            onChange={(e) =>
                                setVoucher({ ...voucher, quantity: e.target.value })
                            }
                        />
                    </Form.Group>
                    <Form.Group controlId="startDayEdit">
                        <Form.Label>Ngày bắt đầu</Form.Label>
                        <Form.Control
                            type="date"
                            value={voucher.start_day}
                            onChange={(e) =>
                                setVoucher({ ...voucher, start_day: e.target.value })
                            }
                        />
                    </Form.Group>
                    <Form.Group controlId="endDayEdit">
                        <Form.Label>Ngày kết thúc</Form.Label>
                        <Form.Control
                            type="date"
                            value={voucher.end_day}
                            onChange={(e) =>
                                setVoucher({ ...voucher, end_day: e.target.value })
                            }
                        />
                    </Form.Group>
                    <Form.Group controlId="statusEdit">
                        <Form.Label>Trạng thái</Form.Label>
                        <Form.Control
                            as="select"
                            value={voucher.status}
                            onChange={(e) =>
                                setVoucher({ ...voucher, status: e.target.value })
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

export default EditVoucherModal;
