import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import request from "../../../utils/request";

function EditCategoryModal({ show, handleClose, selectedCategoryId, onUpdateCategory }) {
    const [category, setCategory] = useState({
        category_name: "",
        status: "",
    });

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await request.get(`category/${selectedCategoryId}`);
                if (response.data.data) {
                    setCategory(response.data.data);
                } else {
                    console.error("No data returned from the API");
                }
            } catch (error) {
                console.error("Error while fetching category data:", error);
            }
        };

        if (selectedCategoryId) {
            fetchCategory();
        }
    }, [selectedCategoryId]);

    const updateCategory = async (e) => {
        e.preventDefault();
        try {
            if (!category.category_name) {
                console.error("Trường danh mục là bắt buộc.");
                return;
            }

            await request.put(`category/${selectedCategoryId}`, {
                category_name: category.category_name,
                status: category.status,
            });
            onUpdateCategory();
            handleClose();
        } catch (error) {
            console.error("Error updating category:", error);
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
