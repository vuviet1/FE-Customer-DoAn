import React, { useState, useEffect } from "react";
import { Modal, Button, Image } from "react-bootstrap";
import request from "@utils/request";
import AddImageModal from "./modal-add";

function ImageLibraryModal({ show, handleClose, productDetailId }) {
    const [images, setImages] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await request.get(
                    `library/${productDetailId}`
                );
                setImages(response.data.data);
            } catch (error) {
                console.error("Error fetching images:", error);
            }
        };

        if (productDetailId) {
            fetchImages();
        }
    }, [productDetailId]);

    const handleAddImageClose = () => {
        setSelectedProductId(null);
        setShowAddModal(false);
    };

    const handleAddImageClick = (productDetailId) => {
        setSelectedProductId(productDetailId);
        setShowAddModal(true);
    };

    const handleAddImage = () => {
        const fetchImages = async () => {
            try {
                const response = await request.get(
                    `library/${productDetailId}`
                );
                setImages(response.data.data);
            } catch (error) {
                console.error("Error fetching images:", error);
            }
        };

        if (productDetailId) {
            fetchImages();
        }
        handleAddImageClose();
    };

    const handleDeleteImage = async (imageId) => {
        if (window.confirm("Bạn có chắc muốn xóa ảnh này không?")) {
            try {
                await request.delete(`library/${imageId}`);
                setImages(images.filter((image) => image.id !== imageId));
            } catch (error) {
                console.error("Error deleting image:", error);
            }
        }
    };

    return (
        <>
            <Modal show={show} onHide={handleClose} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Thư viện ảnh</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Button
                        variant="primary"
                        onClick={() => handleAddImageClick(productDetailId)}
                    >
                        <i className="fas fa-plus" /> Thêm mới
                    </Button>
                    <div className="d-flex flex-wrap">
                        {images.length > 0 ? (
                            images.map((image, index) => (
                                <div
                                    key={index}
                                    className="position-relative m-2"
                                >
                                    <Image
                                        key={index}
                                        src={
                                            "http://127.0.0.1:8000/uploads/library/" +
                                            image.image
                                        }
                                        alt={`Product Detail ${productDetailId}`}
                                        thumbnail
                                        className="m-2"
                                        style={{
                                            width: "150px",
                                            height: "150px",
                                        }}
                                    />
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        className="position-absolute"
                                        style={{ top: "5px", right: "5px" }}
                                        onClick={() =>
                                            handleDeleteImage(image.id)
                                        }
                                    >
                                        <i className="fas fa-trash" />
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <p>Không có ảnh để hiển thị</p>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
            {selectedProductId && (
                <AddImageModal
                    show={showAddModal}
                    handleClose={handleAddImageClose}
                    productDetailId={productDetailId}
                    handleAddImage={handleAddImage}
                />
            )}
        </>
    );
}

export default ImageLibraryModal;
