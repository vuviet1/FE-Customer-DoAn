import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

import request from "../../../utils/request";
import { getErrorMessage } from "../../../utils/errorMessages";

function EditCategoryModal({ show, handleClose, selectedCategoryId, onUpdateCategory }) {
    const [category, setCategory] = useState({
        category_name: "",
        status: 1,
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
                let errorMessage = "Hiển thị danh mục thất bại: ";
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

        if (selectedCategoryId) {
            fetchCategory();
        }
    }, [selectedCategoryId]);

    const updateCategory = async (e) => {
        e.preventDefault();
        try {
            if (!category.category_name) {
                toast.error("Trường tên phương thức là bắt buộc.", {
                    position: "top-right",
                });
                return;
            }

            await request.put(`category/${selectedCategoryId}?_method=PUT`, {
                category_name: category.category_name,
                status: category.status,
            });
            onUpdateCategory();
            handleClose();
            toast.success("Cập nhật danh mục thành công!", {
                position: "top-right",
            });
        } catch (error) {
            let errorMessage = "Cập nhật danh mục thất bại: ";
            if (error.response && error.response.status) {
                errorMessage += getErrorMessage(error.response.status);
            } else {
                errorMessage += error.message;
            }
            toast.error(errorMessage, {
                position: "top-right",
            });
            console.error("Cập nhật danh mục thất bại:", error);
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
