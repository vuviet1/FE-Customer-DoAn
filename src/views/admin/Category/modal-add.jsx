import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAlert } from '@utils/AlertContext';

import request from "@utils/request";

function AddCategoryModal({ show, handleClose, onAddCategory }) {
    const [category, setCategory] = useState({
        category_name: "",
        status: 1,
    });
    const { showSuccessAlert, showErrorAlert } = useAlert();

    const addCategory = async (e) => {
        e.preventDefault();
        try {
            await request.post("category", {
                category_name: category.category_name,
                status: category.status,
            });
            showSuccessAlert('Thành công!', 'Thêm danh mục thành công!');
            onAddCategory();
            handleClose();
        } catch (error) {
            showErrorAlert('Lỗi!', 'Thêm danh mục thất bại');
            handleClose();
        }
    };

    return (
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm mới danh mục</Modal.Title>
                </Modal.Header>
                <Form onSubmit={addCategory}>
                    <Modal.Body>
                        <Form.Group controlId="categoryName">
                            <Form.Label>Tên danh mục</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Tên danh mục mới ..."
                                value={category.category_name}
                                onChange={(e) =>
                                    setCategory({
                                        ...category,
                                        category_name: e.target.value,
                                    })
                                }
                            />
                        </Form.Group>
                        <Form.Group controlId="status">
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
                            Thêm mới
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
    );
}

export default AddCategoryModal;
