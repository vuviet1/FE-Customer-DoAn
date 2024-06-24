import React from "react";
import { Modal, Button, Image } from "react-bootstrap";

function ViewImageModal({ show, handleClose, images, detail }) {
    return (
        <Modal show={show} onHide={handleClose} size="xl" centered>
            <Modal.Header closeButton>
                <Modal.Title>Ảnh của sản phẩm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {images.length > 0 ? (
                    <div className="image-gallery">
                        {images.map((image, index) => (
                            <Image
                                key={index}
                                src={
                                    "http://127.0.0.1:8000/uploads/library/" +
                                    image.image
                                }
                                style={{
                                    width: "150px",
                                    height: "150px",
                                }}
                                alt={`Image ${index + 1}`}
                                thumbnail
                                className="m-2"
                            />
                        ))}
                    </div>
                ) : (
                    <p>Không có ảnh cho sản phẩm này</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ViewImageModal;
