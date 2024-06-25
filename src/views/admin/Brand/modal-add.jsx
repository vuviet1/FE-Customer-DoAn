import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";

import request from "../../../utils/request";
import { getErrorMessage } from "../../../utils/errorMessages";

function AddBrandModal({ show, handleClose, onAddBrand }) {
    const [brand, setBrand] = useState({
        brand_name: "",
        status: 1,
    });

    const addBrand = async (e) => {
        e.preventDefault();
        try {
            if (!brand.brand_name) {
                toast.error("Trường thương hiệu là bắt buộc.", {
                    position: "top-right"
                });
                return;
            }
            await request.post("brand", {
                brand_name: brand.brand_name,
                status: brand.status,
            });
            toast.success("Thêm thương hiệu thành công!", {
                position: "top-right"
            });
            onAddBrand();
            handleClose();
        } catch (error) {
            let errorMessage = "Thêm thương hiệu thất bại: ";
            if (error.response && error.response.status) {
                errorMessage += getErrorMessage(error.response.status);
            } else {
                errorMessage += error.message;
            }
            toast.error(errorMessage, {
                position: "top-right"
            });
            console.error("Thêm thương hiệu thất bại:", error);
            handleClose();
        }
    };

    return (
        <>
        <ToastContainer />
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Thêm mới thương hiệu</Modal.Title>
            </Modal.Header>
            <Form onSubmit={addBrand}>
                <Modal.Body>
                    <Form.Group controlId="brandName">
                        <Form.Label>Tên thương hiệu</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Tên thương hiệu mới ..."
                            value={brand.brand_name}
                            onChange={(e) =>
                                setBrand({
                                    ...brand,
                                    brand_name: e.target.value,
                                })
                            }
                        />
                    </Form.Group>
                    <Form.Group controlId="status">
                        <Form.Label>Trạng thái</Form.Label>
                        <Form.Control
                            as="select"
                            value={brand.status}
                            onChange={(e) =>
                                setBrand({
                                    ...brand,
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
        </>
    );
}

export default AddBrandModal;
