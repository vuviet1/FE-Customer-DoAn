import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import request from "../../../utils/request";

function EditSizeModal({ show, handleClose, selectedSizeId, onUpdateSize }) {
    const [size, setSize] = useState({
        size: "",
        status: "",
    });

    useEffect(() => {
        const fetchSize = async () => {
            try {
                const response = await request.get(`size/${selectedSizeId}`);
                if (response.data) {
                    setSize(response.data);
                } else {
                    console.error("No data returned from the API");
                }
            } catch (error) {
                console.error("Error while fetching size data:", error);
            }
        };

        if (selectedSizeId) {
            fetchSize();
        }
    }, [selectedSizeId]);

    const updateSize = async (e) => {
        e.preventDefault();
        try {
            if (!size.size) {
                console.error("Trường kích thước là bắt buộc.");
                return;
            }

            await request.put(`size/${selectedSizeId}`, {
                size: size.size,
                status: size.status,
            });
            onUpdateSize();
            handleClose();
        } catch (error) {
            console.error("Error updating size:", error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Cập nhật kích thước</Modal.Title>
            </Modal.Header>
            <Form onSubmit={updateSize}>
                <Modal.Body>
                    <Form.Group controlId="sizeEdit">
                        <Form.Label>Kích thước</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Cập nhật kích thước mới ..."
                            value={size.size}
                            onChange={(e) =>
                                setSize({
                                    ...size,
                                    size: e.target.value,
                                })
                            }
                        />
                    </Form.Group>
                    <Form.Group controlId="statusEdit">
                        <Form.Label>Trạng thái</Form.Label>
                        <Form.Control
                            as="select"
                            value={size.status}
                            onChange={(e) =>
                                setSize({
                                    ...size,
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

export default EditSizeModal;
