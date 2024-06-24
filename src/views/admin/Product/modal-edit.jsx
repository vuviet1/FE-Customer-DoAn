import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Table, Image } from "react-bootstrap";
import request from "../../../utils/request";
import EditProductDetailModal from "./modal-edit-detail";
import ImageLibraryModal from "../ImageLibrary";
import ImageUploader from "../components/ImageUploader";
import ReactQuill from "react-quill";

function EditProductModal({ show, handleClose, selectedProductId, onUpdateProduct }) {
    const [product, setProduct] = useState({
        product_name: "",
        quantity: "",
        price: "",
        discount: "",
        brand_id: "",
        category_id: "",
        description: "",
        status: 1,
        image: "",
        product_details: [],
    });

    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [images, setImages] = useState([]);
    const [editDetailModalShow, setEditDetailModalShow] = useState(false);
    const [selectedProductDetail, setSelectedProductDetail] = useState(null);
    const [imageLibraryModalShow, setImageLibraryModalShow] = useState(false);
    const [selectedProductDetailId, setSelectedProductDetailId] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await request.get(`product/${selectedProductId}`);
                if (response.data.data) {
                    const data = response.data.data;
                    setProduct({
                        product_name: data.product_name || "",
                        quantity: data.quantity || "",
                        price: data.price || "",
                        discount: data.discount || "",
                        brand_id: data.brand ? data.brand.brand_id : "",
                        category_id: data.category ? data.category.category_id : "",
                        description: data.description || "",
                        status: data.status || 1,
                        image: data.image || "",
                        product_details: data.product_details ? data.product_details.map((detail) => ({
                            product_detail_id: detail.product_detail_id,
                            size: detail.size.size,
                            size_id: detail.size.size_id,
                            color: detail.color.color,
                            color_id: detail.color.color_id,
                            quantity: detail.quantity,
                        })) : [],
                    });
                } else {
                    console.error("No data returned from the API");
                }
            } catch (error) {
                console.error("Error while fetching product data:", error);
            }
        };

        const fetchBrands = async () => {
            try {
                const response = await request.get("brand");
                setBrands(response.data.data);
            } catch (error) {
                console.error("Error fetching brands:", error);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await request.get("category");
                setCategories(response.data.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        if (selectedProductId) {
            fetchProduct();
        }

        fetchBrands();
        fetchCategories();
    }, [selectedProductId]);

    const updateProduct = async (e) => {
        e.preventDefault();
        try {
            // if (images.length !== 1) {
            //     alert("Vui lòng chọn một ảnh duy nhất.");
            //     return;
            // }

            const formData = {
                product_name: product.product_name,
                price: product.price,
                discount: product.discount,
                brand_id: product.brand_id,
                category_id: product.category_id,
                description: product.description.replace(/<p>|<\/p>/g, ''),
                status: product.status,
                image: images[0],
            };

            await request.post(`product/${selectedProductId}?_method=PUT`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            onUpdateProduct();
            handleClose();
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    const deleteProductDetail = async (detailId) => {
        if (window.confirm("Bạn có chắc muốn xóa sản phẩm chi tiết này không?")) {
            try {
                await request.delete(`productdetail/${detailId}`);
                setProduct((prevProduct) => ({
                    ...prevProduct,
                    product_details: prevProduct.product_details.filter(
                        (detail) => detail.product_detail_id !== detailId
                    ),
                }));
            } catch (error) {
                console.error("Error deleting product detail:", error);
            }
        }
    };

    const handleEditDetail = (detailId) => {
        const detail = product.product_details.find(
            (detail) => detail.product_detail_id === detailId
        );
        setSelectedProductDetail(detail);
        setEditDetailModalShow(true);
    };

    const handleDetailModalClose = () => {
        setEditDetailModalShow(false);
        setSelectedProductDetail(null);
    };

    const handleDetailUpdate = () => {
        const fetchProductDetails = async () => {
            try {
                const response = await request.get(`product/${selectedProductId}`);
                if (response.data.data) {
                    const data = response.data.data;
                    setProduct((prevProduct) => ({
                        ...prevProduct,
                        product_details: data.product_details ? data.product_details.map((detail) => ({
                            product_detail_id: detail.product_detail_id,
                            size: detail.size.size,
                            color: detail.color.color,
                            quantity: detail.quantity,
                        })) : [],
                    }));
                }
            } catch (error) {
                console.error("Error fetching product details:", error);
            }
        };
        fetchProductDetails();
        handleDetailModalClose();
    };

    const handleImageLibrary = (detailId) => {
        setSelectedProductDetailId(detailId);
        setImageLibraryModalShow(true);
    };

    const handleImageLibraryModalClose = () => {
        setImageLibraryModalShow(false);
        setSelectedProductDetailId(null);
    };

    const handleDescriptionChange = (value) => {
        setProduct((prevProduct) => ({
            ...prevProduct,
            description: value,
        }));
    };

    return (
        <>
            <Modal show={show} onHide={handleClose} size="xl" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Cập nhật sản phẩm</Modal.Title>
                </Modal.Header>
                <Form onSubmit={updateProduct}>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-6" style={{ textAlign: "center" }}>
                                <Form.Group controlId="productImage">
                                    <Form.Label>Ảnh sản phẩm</Form.Label>
                                    <ImageUploader images={images} setImages={setImages} />
                                    {!images.length && (
                                        <Image
                                            src={"http://127.0.0.1:8000/uploads/product/" + product.image}
                                            alt={product.product_name}
                                            style={{ width: "250px", height: "250px" }}
                                            thumbnail
                                        />
                                    )}
                                </Form.Group>
                            </div>
                            <div className="col-6">
                                <Form.Group controlId="productNameEdit">
                                    <Form.Label>Tên sản phẩm</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Cập nhật tên sản phẩm ..."
                                        value={product.product_name}
                                        onChange={(e) =>
                                            setProduct({ ...product, product_name: e.target.value })
                                        }
                                    />
                                </Form.Group>
                                <Form.Group controlId="priceEdit">
                                    <Form.Label>Giá</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Cập nhật giá sản phẩm ..."
                                        value={product.price}
                                        onChange={(e) =>
                                            setProduct({ ...product, price: e.target.value })
                                        }
                                    />
                                </Form.Group>
                                <Form.Group controlId="discountEdit">
                                    <Form.Label>Khuyến mãi</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Cập nhật khuyến mãi ..."
                                        value={product.discount}
                                        onChange={(e) =>
                                            setProduct({ ...product, discount: e.target.value })
                                        }
                                    />
                                </Form.Group>
                                <Form.Group controlId="brandIdEdit">
                                    <Form.Label>Thương hiệu</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={product.brand_id}
                                        onChange={(e) =>
                                            setProduct({ ...product, brand_id: e.target.value })
                                        }
                                    >
                                        <option value="">Chọn thương hiệu</option>
                                        {brands.map((brand) => (
                                            <option key={brand.brand_id} value={brand.brand_id}>
                                                {brand.brand_name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="categoryIdEdit">
                                    <Form.Label>Danh mục</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={product.category_id}
                                        onChange={(e) =>
                                            setProduct({ ...product, category_id: e.target.value })
                                        }
                                    >
                                        <option value="">Chọn danh mục</option>
                                        {categories.map((category) => (
                                            <option key={category.category_id} value={category.category_id}>
                                                {category.category_name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-12">
                                <Form.Group controlId="inputDescription">
                                    <Form.Label>Mô tả</Form.Label>
                                    <ReactQuill
                                        placeholder="Mô tả sản phẩm ..."
                                        value={product.description}
                                        onChange={handleDescriptionChange}
                                        style={{ height: "150px", marginBottom: "50px" }}
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
                                        {product.product_details?.length > 0 ? (
                                            product.product_details.map((detail, index) => (
                                                <tr key={index}>
                                                    <td>{detail.product_detail_id}</td>
                                                    <td>{detail.size}</td>
                                                    <td>{detail.color}</td>
                                                    <td>{detail.quantity}</td>
                                                    <td style={{ textAlign: "center" }}>
                                                        <Button
                                                            variant="success"
                                                            onClick={() => handleImageLibrary(detail.product_detail_id)}
                                                            style={{ marginRight: "5px" }}
                                                        >
                                                            Thư viện ảnh
                                                        </Button>
                                                        <Button
                                                            variant="info"
                                                            onClick={() => handleEditDetail(detail.product_detail_id)}
                                                            style={{ marginRight: "5px" }}
                                                        >
                                                            Sửa
                                                        </Button>
                                                        <Button
                                                            variant="danger"
                                                            onClick={() => deleteProductDetail(detail.product_detail_id)}
                                                        >
                                                            Xóa
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
                            Hủy bỏ
                        </Button>
                        <Button type="submit" variant="primary">
                            Cập nhật
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Edit Product Detail Modal */}
            <EditProductDetailModal
                show={editDetailModalShow}
                handleClose={handleDetailModalClose}
                productDetail={selectedProductDetail}
                onEditProductDetail={handleDetailUpdate}
                selectedProductId={selectedProductId}
            />

            {/* Image Library Modal */}
            <ImageLibraryModal
                show={imageLibraryModalShow}
                handleClose={handleImageLibraryModalClose}
                productDetailId={selectedProductDetailId}
            />
        </>
    );
}

export default EditProductModal;
