import React, { useState } from "react";
import { Button, Form, Modal, Alert } from "react-bootstrap";
import ImageUploader from "../components/ImageUploader";
import request from "../../../utils/request";

function AddImageModal({ show, handleClose, productDetailId, handleAddImage }) {
    const [images, setImages] = useState([]);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (images.length === 0) {
            setError("Vui lòng chọn ít nhất một hình ảnh.");
            return;
        }

        const data = {
            image: images,
            product_detail_id: productDetailId,
        };

        console.log(data);
        try {
            const response = await request.post("library", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            handleAddImage()
            if (response.status === 200) {
                setSuccessMessage(response.data.message);
                setImages([]);
                setTimeout(() => {
                    setSuccessMessage(null);
                    handleClose();
                }, 3000);
            }
        } catch (error) {
            setError("Đã xảy ra lỗi khi tải lên hình ảnh.");
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Thêm Ảnh</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {successMessage && (
                    <Alert variant="success">{successMessage}</Alert>
                )}
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Chọn Ảnh</Form.Label>
                        <ImageUploader images={images} setImages={setImages} />
                    </Form.Group>
                    <Modal.Footer>
                        <Button variant="outline-primary" onClick={handleClose}>
                            Hủy bỏ
                        </Button>
                        <Button variant="primary" type="submit">
                            Thêm mới
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default AddImageModal;
