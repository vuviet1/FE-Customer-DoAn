import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import request from "../../../utils/request";

function AddCategoryModal({ show, handleClose, onAddCategory }) {
    const [category_name, setCategoryName] = useState("");
    const [status, setStatus] = useState(1);

    const addCategory = async (e) => {
        e.preventDefault();
        try {
            const response = await request.post("category", {
                category_name: category_name,
                status: status,
            });
            console.log("Category added successfully:", response.data);
            onAddCategory();
            handleClose();
        } catch (error) {
            console.error("Failed to add category:", error);
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
                            value={category_name}
                            onChange={(e) => setCategoryName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="status">
                        <Form.Label>Trạng thái</Form.Label>
                        <Form.Control
                            as="select"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
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
