import React, { useEffect, useState } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";

import request from "../../../utils/request";
import { getErrorMessage } from "../../../utils/errorMessages";

function EditProductDetailModal({
    show,
    onEditProductDetail,
    productDetail,
    handleClose,
    selectedProductId
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

    useEffect(() => {
        if (productDetail) {
            setColorId(productDetail.color_id || "");
            setSizeId(productDetail.size_id || "");
            setQuantity(productDetail.quantity || "");
            setStatus(productDetail.status !== undefined ? productDetail.status : 1);
        }
    }, [productDetail, show]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!productDetail) {
            toast.error("Không tồn tại phân loại sản phẩm này.", {
                position: "top-right",
            });
            return;
        }
        try {
            const updatedProductDetail = {
                color_id: parseInt(colorId),
                size_id: parseInt(sizeId),
                product_id: selectedProductId,
                quantity: parseInt(quantity),
                status: parseInt(status),
            };

            await request.post(
                `productdetail/${productDetail.product_detail_id}?_method=PUT`,
                updatedProductDetail
            );

            onEditProductDetail();
            handleClose();
            toast.success("Cập nhật phân loại sản phẩm thành công!", {
                position: "top-right",
            });
        } catch (error) {
            let errorMessage = "Cập nhật phân loại sản phẩm thất bại: ";
            if (error.response && error.response.status) {
                errorMessage += getErrorMessage(error.response.status);
            } else {
                errorMessage += error.message;
            }
            toast.error(errorMessage, {
                position: "top-right",
            });
            console.error("Cập nhật phân loại sản phẩm thất bại:", error);
            handleClose();
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="xl" centered>
            <Modal.Header closeButton>
                <Modal.Title>Sửa thông tin chi tiết của sản phẩm</Modal.Title>
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
                                    onChange={(e) => setColorId(e.target.value)}
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
                                    onChange={(e) => setSizeId(e.target.value)}
                                >
                                    <option value="">Chọn kích thước</option>
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
                                    onChange={(e) => setStatus(e.target.value)}
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
                                    onChange={(e) => setQuantity(e.target.value)}
                                />
                            </Form.Group>
                        </div>
                    </div>
                    <Modal.Footer>
                        <Button variant="outline-primary" onClick={handleClose}>
                            Hủy bỏ
                        </Button>
                        <Button variant="primary" type="submit">
                            Cập nhật
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default EditProductDetailModal;
