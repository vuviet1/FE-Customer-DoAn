import React, { useEffect, useState } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import ReactQuill from "react-quill";
import sanitizeHtml from 'sanitize-html';
import { toast, ToastContainer } from "react-toastify";

import request from "../../../utils/request";
import ImageUploader from "../components/ImageUploader";
import { getErrorMessage } from "../../../utils/errorMessages";

function AddProductModal({ show, handleClose, onAddProduct }) {
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);

    const [productName, setProductName] = useState("");
    const [price, setPrice] = useState("");
    const [discount, setDiscount] = useState("");
    const [brandId, setBrandId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState(1);

    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const response = await request.get("brand");
                setBrands(response.data.data);
            } catch (error) {
                let errorMessage = "Hiển thị danh sách thương hiệu thất bại: ";
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

        const fetchCategories = async () => {
            try {
                const response = await request.get("category");
                setCategories(response.data.data);
            } catch (error) {
                let errorMessage = "Hiển thị danh sách danh mục thất bại: ";
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

        fetchBrands();
        fetchCategories();
    }, []);

    const sanitizeContent = (content) => {
        const sanitized = sanitizeHtml(content, {
            allowedTags: [],
            allowedAttributes: {}
        });
        return sanitized.trim();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            if (images.length !== 1) {
                alert("Vui lòng chọn một ảnh duy nhất.");
                return;
            }

            const sanitizedDescription = sanitizeContent(description);

            const productData = {
                product_name: productName,
                price: price,
                brand_id: brandId,
                category_id: categoryId,
                description: sanitizedDescription,
                status: status,
                discount: discount,
                image: images[0],
            };

            await request.post("product", productData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success("Thêm sản phẩm thành công!", {
                position: "top-right",
            });
            onAddProduct();
            setImages([]);
            handleClose();
        } catch (error) {
            let errorMessage = "Thêm sản phẩm thất bại: ";
            if (error.response && error.response.status) {
                errorMessage += getErrorMessage(error.response.status);
            } else {
                errorMessage += error.message;
            }
            toast.error(errorMessage, {
                position: "top-right"
            });
            console.error("Thêm sản phẩm thất bại:", error);
            handleClose();
        }
    };

    const handleDescriptionChange = (value) => {
        setDescription(value);
    };

    return (
        <>
        <ToastContainer />
            <Modal show={show} onHide={handleClose} size="xl" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm mới sản phẩm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <h5>Thông tin chung</h5>
                        <div className="row">
                            <div className="col-6">
                                <Form.Group controlId="inputImage">
                                    <Form.Label>Ảnh sản phẩm</Form.Label>
                                    <ImageUploader
                                        images={images} setImages={setImages}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-6">
                                <Form.Group controlId="inputName">
                                    <Form.Label>Tên sản phẩm</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Tên sản phẩm mới ..."
                                        value={productName}
                                        onChange={(e) =>
                                            setProductName(e.target.value)
                                        }
                                    />
                                </Form.Group>
                                <Form.Group controlId="inputPrice">
                                    <Form.Label>Giá</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Giá sản phẩm ..."
                                        value={price}
                                        onChange={(e) =>
                                            setPrice(e.target.value)
                                        }
                                    />
                                </Form.Group>
                                <Form.Group controlId="inputDiscount">
                                    <Form.Label>Khuyến mãi</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Khuyến mãi ..."
                                        value={discount}
                                        onChange={(e) =>
                                            setDiscount(e.target.value)
                                        }
                                    />
                                </Form.Group>
                                <Form.Group controlId="inputBrand">
                                    <Form.Label>Thương hiệu</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={brandId}
                                        onChange={(e) =>
                                            setBrandId(e.target.value)
                                        }
                                    >
                                        <option value="">
                                            Chọn thương hiệu
                                        </option>
                                        {brands.map((brand) => (
                                            <option
                                                key={brand.brand_id}
                                                value={brand.brand_id}
                                            >
                                                {brand.brand_name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="inputCategory">
                                    <Form.Label>Danh mục</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={categoryId}
                                        onChange={(e) =>
                                            setCategoryId(e.target.value)
                                        }
                                    >
                                        <option value="">Chọn danh mục</option>
                                        {categories.map((category) => (
                                            <option
                                                key={category.category_id}
                                                value={category.category_id}
                                            >
                                                {category.category_name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="status">
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
                            <div className="col-12">
                                <Form.Group controlId="inputDescription">
                                    <Form.Label>Mô tả</Form.Label>
                                    <ReactQuill
                                        placeholder="Mô tả sản phẩm ..."
                                        value={description}
                                        onChange={handleDescriptionChange}
                                        style={{
                                            height: "150px",
                                            marginBottom: "50px"
                                        }}
                                    />
                                </Form.Group>
                            </div>
                        </div>
                        <hr />
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

export default AddProductModal;
