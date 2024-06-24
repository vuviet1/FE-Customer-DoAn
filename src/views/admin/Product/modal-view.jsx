import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Table, Image } from "react-bootstrap";
import request from "../../../utils/request";
import ViewImageModal from "./modal-view-image";

function ViewProductModal({ show, handleClose, selectedProductId }) {
    const [product, setProduct] = useState({
        product_name: "",
        quantity: "",
        price: "",
        brand: { brand_name: "" },
        category: { category_name: ""},
        description: "",
        status: 1,
        image: "",
        product_details: [],
    });

    const [selectedDetail, setSelectedDetail] = useState(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await request.get(`product/${selectedProductId}`);
                if (response.data.data ) {
                    const data = response.data.data;
                    setProduct({
                        product_name: data.product_name || "",
                        quantity: data.quantity || "",
                        price: data.price || "",
                        brand_name: data.brand ? data.brand.brand_name : "",
                        category_name: data.category ? data.category.category_name : "",
                        description: data.description || "",
                        status: data.status || 1,
                        image: data.image || "",
                        product_details: data.product_details.map((detail) => ({
                            product_detail_id: detail.product_detail_id,
                            size: detail.size.size,
                            color: detail.color.color,
                            quantity: detail.quantity,
                        })),
                    });
                } else {
                    console.error("No data returned from the API");
                }
            } catch (error) {
                console.error("Error while fetching product data:", error);
            }
        };

        if (selectedProductId) {
            fetchProduct();
        }
    }, [selectedProductId]);

    const fetchImages = async (productDetailId) => {
        try {
            const response = await request.get(`library/${productDetailId}`);
            setImages(response.data.data);
        } catch (error) {
            console.error("Error fetching images:", error);
        }
    };

    const handleShowImageModal = async (detail) => {
        setSelectedDetail(detail);
        await fetchImages(detail.product_detail_id);
        setShowImageModal(true);
    };

    const handleCloseImageModal = () => {
        setShowImageModal(false);
        setSelectedDetail(null);
    };

    return (
        <>
            <Modal show={show} onHide={handleClose} size="xl" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xem sản phẩm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-6">
                            <Form.Group
                                controlId="productImage"
                                style={{
                                    display: "grid",
                                    textAlign: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Form.Label>Ảnh sản phẩm</Form.Label>
                                <Image
                                    src={
                                        "http://127.0.0.1:8000/uploads/product/" +
                                        product.image
                                    }
                                    alt={product.product_name}
                                    style={{ width: "250px", height: "250px" }}
                                    thumbnail
                                />
                            </Form.Group>
                        </div>
                        <div className="col-6">
                            <Form.Group controlId="productNameEdit">
                                <Form.Label>Tên sản phẩm</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Tên sản phẩm"
                                    value={product.product_name}
                                    readOnly
                                />
                            </Form.Group>
                            <Form.Group controlId="priceEdit">
                                <Form.Label>Giá</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Giá sản phẩm"
                                    value={product.price}
                                    readOnly
                                />
                            </Form.Group>
                            <Form.Group controlId="brandIdEdit">
                                <Form.Label>Thương hiệu</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Thương hiệu sản phẩm"
                                    value={product.brand_name}
                                    readOnly
                                />
                            </Form.Group>
                            <Form.Group controlId="categoryIdEdit">
                                <Form.Label>Danh mục</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Danh mục sản phẩm"
                                    value={product.category_name}
                                    readOnly
                                />
                            </Form.Group>
                        </div>

                        <div className="col-12">
                            <Form.Group controlId="inputDescription">
                                <Form.Label>Mô tả</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    placeholder="Mô tả sản phẩm"
                                    value={product.description}
                                    readOnly
                                />
                            </Form.Group>
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-12">
                            <h5>Danh sách phân loại</h5>
                            <Table bordered>
                                <thead>
                                    <tr>
                                        <th>Mã</th>
                                        <th>Kích cỡ</th>
                                        <th>Màu sắc</th>
                                        <th>Số lượng</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {product.product_details.length > 0 ? (
                                        product.product_details.map((detail, index) => (
                                            <tr key={index}>
                                                <td>{detail.product_detail_id}</td>
                                                <td>{detail.size}</td>
                                                <td>{detail.color}</td>
                                                <td>{detail.quantity}</td>
                                                <td>
                                                    <Button
                                                        variant="info"
                                                        onClick={() =>
                                                            handleShowImageModal(detail)
                                                        }
                                                    >
                                                        <i className="fas fa-images"></i>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: "center" }}>
                                                Không có dữ liệu
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>

            <ViewImageModal
                show={showImageModal}
                handleClose={handleCloseImageModal}
                images={images}
                detail={selectedDetail}
            />
        </>
    );
}

export default ViewProductModal;
