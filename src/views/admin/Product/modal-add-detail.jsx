import React, { useEffect, useState } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";

import request from "../../../utils/request";
import { getErrorMessage } from "../../../utils/errorMessages";

function AddProductDetailModal({
    show,
    onAddProductDetail,
    productId,
    handleClose,
}) {
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [colorId, setColorId] = useState("");
    const [sizeId, setSizeId] = useState("");
    const [quantity, setQuantity] = useState("");
    const [status, setStatus] = useState(1);

    useEffect(() => {
        const fetchColors = async () => {
            try {
                const response = await request.get("color");
                setColors(response.data.data);
            } catch (error) {
                let errorMessage = "Hiển thị danh sách màu thất bại: ";
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

        const fetchSizes = async () => {
            try {
                const response = await request.get("size");
                setSizes(response.data.data);
            } catch (error) {
                let errorMessage = "Hiển thị danh sách kích cỡ thất bại: ";
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

        fetchColors();
        fetchSizes();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const productDetailData = {
                color_id: parseInt(colorId),
                size_id: parseInt(sizeId),
                product_id: productId,
                quantity: parseInt(quantity),
                status: parseInt(quantity),
            };
            await request.post(
                "productdetail",
                productDetailData
            );
            toast.success("Thêm phân loại sản phẩm thành công!", {
                position: "top-right"
            });
            onAddProductDetail();
            handleClose();
        } catch (error) {
            let errorMessage = "Thêm phương thức thanh toán thất bại: ";
            if (error.response && error.response.status) {
                errorMessage += getErrorMessage(error.response.status);
            } else {
                errorMessage += error.message;
            }
            toast.error(errorMessage, {
                position: "top-right"
            });
            console.error("Thêm phương thức thất bại:", error);
            handleClose();
        }
    };

    return (
        <>
            <ToastContainer />
            <Modal show={show} onHide={handleClose} size="xl" centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Thêm phân loại của sản phẩm
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-6">
                                <Form.Group controlId="inputColor">
                                    <Form.Label>Màu sắc</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={colorId}
                                        onChange={(e) =>
                                            setColorId(e.target.value)
                                        }
                                    >
                                        <option value="">Chọn màu sắc</option>
                                        {colors.map((color) => (
                                            <option
                                                key={color.color_id}
                                                value={color.color_id}
                                            >
                                                {color.color}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-6">
                                <Form.Group controlId="inputSize">
                                    <Form.Label>Kích thước</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={sizeId}
                                        onChange={(e) =>
                                            setSizeId(e.target.value)
                                        }
                                    >
                                        <option value="">
                                            Chọn kích thước
                                        </option>
                                        {sizes.map((size) => (
                                            <option
                                                key={size.size_id}
                                                value={size.size_id}
                                            >
                                                {size.size}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-6">
                                <Form.Group controlId="inputStatus">
                                    <Form.Label>Trạng thái</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={status}
                                        onChange={(e) =>
                                            setStatus(e.target.value)
                                        }
                                    >
                                        <option value="1">Sử dụng</option>
                                        <option value="0">Không sử dụng</option>
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-6">
                                <Form.Group controlId="inputQuantity">
                                    <Form.Label>Số lượng</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Số lượng ..."
                                        value={quantity}
                                        onChange={(e) =>
                                            setQuantity(e.target.value)
                                        }
                                    />
                                </Form.Group>
                            </div>
                        </div>
                        <Modal.Footer>
                            <Button
                                variant="outline-primary"
                                onClick={handleClose}
                            >
                                Hủy bỏ
                            </Button>
                            <Button variant="primary" type="submit">
                                Thêm mới
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default AddProductDetailModal;
