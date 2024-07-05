import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAlert } from '@utils/AlertContext';

import request from "@utils/request";

function AddBrandModal({ show, handleClose, onAddBrand }) {
    const [brand, setBrand] = useState({
        brand_name: "",
        status: 1,
    });
    const { showSuccessAlert, showErrorAlert } = useAlert();

    const addBrand = async (e) => {
        e.preventDefault();
        try {
            await request.post("brand", {
                brand_name: brand.brand_name,
                status: brand.status,
            });
            showSuccessAlert('Thành công!', 'Thêm thương hiệu thành công!');
            onAddBrand();
            handleClose();
        } catch (error) {
            showErrorAlert('Lỗi!', 'Thêm thương hiệu thất bại');
            handleClose();
        }
    };

    return (
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
    );
}

export default AddBrandModal;
