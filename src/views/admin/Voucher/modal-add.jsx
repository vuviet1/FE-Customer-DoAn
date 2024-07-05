import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAlert } from '@utils/AlertContext';

import request from "@utils/request";

function AddVoucherModal({ show, handleClose, onAddVoucher }) {
    const [voucher, setVoucher] = useState({
        voucher: "",
        voucher_code: "",
        quantity: 0,
        start_day: "",
        end_day: "",
        status: 1,
    });
    const { showSuccessAlert, showErrorAlert } = useAlert();

    const addVoucher = async (e) => {
        e.preventDefault();
        if (new Date(voucher.end_day) < new Date(voucher.start_day)) {
            alert("Ngày kết thúc không thể nhỏ hơn ngày bắt đầu.");
            return;
        }

        try {
            if (!voucher.voucher) {
                showErrorAlert('Lỗi!', 'Trường mã giảm giá là bắt buộc');
                return;
            }

            await request.post("voucher", {
                voucher_code: voucher.voucher_code,
                voucher: Number(voucher.voucher),
                quantity: Number(voucher.quantity),
                start_day: voucher.start_day,
                end_day: voucher.end_day,
                status: voucher.status,
            });
            showSuccessAlert('Thành công!', 'Thêm mã giảm giá thành công!');
            onAddVoucher();
            handleClose();
        } catch (error) {
            showErrorAlert('Lỗi!', 'Thêm mã giảm giá thất bại');
            handleClose();
        }
    };

    return (
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm mới voucher</Modal.Title>
                </Modal.Header>
                <Form onSubmit={addVoucher}>
                    <Modal.Body>
                        <Form.Group controlId="voucherCode">
                            <Form.Label>Tên mã giảm giá</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Tên mã giảm giá ..."
                                value={voucher.voucher_code}
                                onChange={(e) =>
                                    setVoucher({
                                        ...voucher,
                                        voucher_code: e.target.value,
                                    })
                                }
                            />
                        </Form.Group>
                        <Form.Group controlId="voucher">
                            <Form.Label>Mức giảm giá</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="% giảm giá ..."
                                value={voucher.voucher}
                                onChange={(e) =>
                                    setVoucher({
                                        ...voucher,
                                        voucher: e.target.value,
                                    })
                                }
                            />
                        </Form.Group>
                        <Form.Group controlId="quantity">
                            <Form.Label>Số lượng</Form.Label>
                            <Form.Control
                                type="number"
                                value={voucher.quantity}
                                onChange={(e) =>
                                    setVoucher({
                                        ...voucher,
                                        quantity: e.target.value,
                                    })
                                }
                            />
                        </Form.Group>
                        <Form.Group controlId="startDay">
                            <Form.Label>Ngày bắt đầu</Form.Label>
                            <Form.Control
                                type="date"
                                value={voucher.start_day}
                                onChange={(e) =>
                                    setVoucher({
                                        ...voucher,
                                        start_day: e.target.value,
                                    })
                                }
                            />
                        </Form.Group>
                        <Form.Group controlId="endDay">
                            <Form.Label>Ngày kết thúc</Form.Label>
                            <Form.Control
                                type="date"
                                value={voucher.end_day}
                                onChange={(e) =>
                                    setVoucher({
                                        ...voucher,
                                        end_day: e.target.value,
                                    })
                                }
                                disabled={!voucher.start_day}
                            />
                        </Form.Group>
                        <Form.Group controlId="status">
                            <Form.Label>Trạng thái</Form.Label>
                            <Form.Control
                                as="select"
                                value={voucher.status}
                                onChange={(e) =>
                                    setVoucher({
                                        ...voucher,
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
                            Thêm mới
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
    );
}

export default AddVoucherModal;
