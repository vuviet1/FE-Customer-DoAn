/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAlert } from '@utils/AlertContext';

import request from "@utils/request";

function EditCategoryModal({ show, handleClose, selectedCategoryId, onUpdateCategory }) {
    const [category, setCategory] = useState({
        category_name: "",
        status: 1,
    });
    const { showSuccessAlert, showErrorAlert } = useAlert();

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await request.get(`category/${selectedCategoryId}`);
                    setCategory(response.data.data);
            } catch (error) {
                showErrorAlert('Lỗi!', 'Lấy dữ liệu thất bại');
            }
        };

            fetchCategory();
    }, []);

    const updateCategory = async (e) => {
        e.preventDefault();
        try {
            await request.put(`category/${selectedCategoryId}?_method=PUT`, {
                category_name: category.category_name,
                status: category.status,
            });
            onUpdateCategory();
            handleClose();
            showSuccessAlert('Thành công!', 'Cập nhật danh mục thành công!');
        } catch (error) {
            showErrorAlert('Lỗi!', 'Cập nhật danh mục thất bại');
            handleClose();
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Cập nhật danh mục</Modal.Title>
            </Modal.Header>
            <Form onSubmit={updateCategory}>
                <Modal.Body>
                    <Form.Group controlId="categoryNameEdit">
                        <Form.Label>Tên danh mục</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Cập nhật tên danh mục mới ..."
                            value={category.category_name}
                            onChange={(e) =>
                                setCategory({
                                    ...category,
                                    category_name: e.target.value,
                                })
                            }
                        />
                    </Form.Group>
                    <Form.Group controlId="statusEdit">
                        <Form.Label>Trạng thái</Form.Label>
                        <Form.Control
                            as="select"
                            value={category.status}
                            onChange={(e) =>
                                setCategory({
                                    ...category,
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

export default EditCategoryModal;
