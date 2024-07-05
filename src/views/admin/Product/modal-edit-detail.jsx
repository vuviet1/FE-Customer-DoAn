/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import { useAlert } from '@utils/AlertContext';

import request from "@utils/request";

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
    const { showSuccessAlert, showErrorAlert } = useAlert();

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [colorResponse, sizeResponse] = await Promise.all([
                    request.get("color"),
                    request.get("size"),
                ]);
                const activeColors = colorResponse.data.data.filter(color => color.status === 1);
                const activeSizes = sizeResponse.data.data.filter(size => size.status === 1);
                setColors(activeColors);
                setSizes(activeSizes);
            } catch (error) {
                showErrorAlert('Lỗi!', 'Lấy dữ liệu thất bại.');
            }
        };

        fetchAllData();
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
            showErrorAlert('Lỗi!', 'Không tồn tại phân loại sản phẩm này');
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
            showSuccessAlert('Thành công!', 'Cập nhật phân loại sản phẩm thành công!');
        } catch (error) {
            showErrorAlert('Lỗi!', 'Cập nhật phân loại sản phẩm thất bại');
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
