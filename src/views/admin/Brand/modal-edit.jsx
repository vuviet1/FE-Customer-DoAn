import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

import request from "../../../utils/request";
import { getErrorMessage } from "../../../utils/errorMessages";

function EditBrandModal({ show, handleClose, selectedBrandId, onUpdateBrand }) {
    const [brand, setBrand] = useState({
        brand_name: "",
        status: 1,
    });

    useEffect(() => {
        const fetchBrand = async () => {
            try {
                const response = await request.get(`brand/${selectedBrandId}`);
                if (response.data.data) {
                    setBrand(response.data.data);
                } else {
                    console.error("No data returned from the API");
                }
            } catch (error) {
                let errorMessage = "Hiển thị thương hiệu thất bại: ";
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

        if (selectedBrandId) {
            fetchBrand();
        }
    }, [selectedBrandId]);

    const updateBrand = async (e) => {
        e.preventDefault();
        try {
            if (!brand.brand_name) {
                toast.error("Trường tên thương hiệu là bắt buộc.", {
                    position: "top-right",
                });
                return;
            }

            await request.put(`brand/${selectedBrandId}?_method=PUT`, {
                brand_name: brand.brand_name,
                status: brand.status,
            });
            onUpdateBrand();
            handleClose();
            toast.success("Cập nhật thương hiệu thành công!", {
                position: "top-right",
            });
        } catch (error) {
            let errorMessage = "Cập nhật thương hiệu thất bại: ";
            if (error.response && error.response.status) {
                errorMessage += getErrorMessage(error.response.status);
            } else {
                errorMessage += error.message;
            }
            toast.error(errorMessage, {
                position: "top-right",
            });
            console.error("Cập nhật thương hiệu thất bại:", error);
            handleClose();
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Cập nhật thương hiệu</Modal.Title>
            </Modal.Header>
            <Form onSubmit={updateBrand}>
                <Modal.Body>
                    <Form.Group controlId="brandNameEdit">
                        <Form.Label>Tên thương hiệu</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Cập nhật tên thương hiệu ..."
                            value={brand.brand_name}
                            onChange={(e) =>
                                setBrand({
                                    ...brand,
                                    brand_name: e.target.value,
                                })
                            }
                        />
                    </Form.Group>
                    <Form.Group controlId="statusEdit">
                        <Form.Label>Trạng thái</Form.Label>
                        <Form.Control
                            as="select"
                            value={brand.status}
                            onChange={(e) =>
                                setBrand({ ...brand, status: e.target.value })
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

export default EditBrandModal;
