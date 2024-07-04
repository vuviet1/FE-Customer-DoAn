/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAlert } from '@utils/AlertContext';

import request from "../../../utils/request";

function EditBrandModal({ show, handleClose, selectedBrandId, onUpdateBrand }) {
    const [brand, setBrand] = useState({
        brand_name: "",
        status: 1,
    });
    const { showSuccessAlert, showErrorAlert } = useAlert();

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
                showErrorAlert('Lỗi!', 'Lấy dữ liệu thất bại');
            }
        };

            fetchBrand();
    }, []);

    const updateBrand = async (e) => {
        e.preventDefault();
        try {
            await request.put(`brand/${selectedBrandId}?_method=PUT`, {
                brand_name: brand.brand_name,
                status: brand.status,
            });
            onUpdateBrand();
            handleClose();
            showSuccessAlert('Thành công!', 'Cập nhật thương hiệu thành công!');
        } catch (error) {
            showErrorAlert('Lỗi!', 'Cập nhật thương hiệu thất bại');
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
