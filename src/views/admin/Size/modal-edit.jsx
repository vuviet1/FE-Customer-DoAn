import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

import request from "../../../utils/request";
import { getErrorMessage } from "../../../utils/errorMessages";

function EditSizeModal({ show, handleClose, selectedSizeId, onUpdateSize }) {
    const [size, setSize] = useState({
        size: "",
        status: 1,
    });

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
                let errorMessage = "Hiển thị kích cỡ thất bại: ";
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

        if (selectedSizeId) {
            fetchSize();
        }
    }, [selectedSizeId]);

    const updateSize = async (e) => {
        e.preventDefault();
        try {
            if (!size.size) {
                toast.error("Trường kích cỡ là bắt buộc.", {
                    position: "top-right",
                });
                return;
            }

            await request.post(`size/${selectedSizeId}?_method=PUT`, {
                size: size.size,
                status: size.status,
            });
            onUpdateSize();
            handleClose();
            toast.success("Cập nhật kích cỡ thành công!", {
                position: "top-right",
            });
        } catch (error) {
            let errorMessage = "Cập nhật kích cỡ thất bại: ";
            if (error.response && error.response.status) {
                errorMessage += getErrorMessage(error.response.status);
            } else {
                errorMessage += error.message;
            }
            toast.error(errorMessage, {
                position: "top-right",
            });
            console.error("Cập nhật kích cỡ thất bại:", error);
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
