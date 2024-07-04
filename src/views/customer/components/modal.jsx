/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Modal, Button, Image } from "react-bootstrap";

import { useAlert } from '@utils/AlertContext';
import request from "../../../utils/request";

const ProductModal = ({ showModal, handleClose, product }) => {
    const [productDetails, setProductDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Chọn màu/kích cỡ/số lượng
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [availableColors, setAvailableColors] = useState([]);
    const [availableSizes, setAvailableSizes] = useState([]);
    const [quantity, setQuantity] = useState(1);
    // Ảnh
    const [images, setImages] = useState([]);
    const [defaultImage, setDefaultImage] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    const { showSuccessAlert, showErrorAlert, showWarningAlert } = useAlert();

    useEffect(() => {
        const resetState = () => {
            setSelectedColor(null);
            setSelectedSize(null);
            setAvailableColors([]);
            setAvailableSizes([]);
            setQuantity(1);
            setImages([]);
            setDefaultImage(null);
            setCurrentSlide(0);
        };

        const fetchProductDetails = async () => {
            try {
                const response = await request.get(
                    `product/${product.product_id}`
                );
                setProductDetails(response.data.data.product_details);
                setAvailableColors(
                    response.data.data.product_details.map(
                        (detail) => detail.color.color
                    )
                );
                setAvailableSizes(
                    response.data.data.product_details.map(
                        (detail) => detail.size.size
                    )
                );
                setDefaultImage(product.image);
                setLoading(false);
            } catch (error) {
                showErrorAlert('Lỗi!', 'Lấy dữ liệu thất bại.');
                setError("Failed to load product details");
                setLoading(false);
            }
        };

        if (product && showModal) {
            resetState();
            fetchProductDetails();
        }
    }, [product, showModal]);

    useEffect(() => {
        if (selectedColor && selectedSize) {
            const selectedDetail = productDetails.find(
                (detail) =>
                    detail.color.color === selectedColor &&
                    detail.size.size === selectedSize
            );

            if (selectedDetail) {
                fetchImages(selectedDetail.product_detail_id);
            }
        } else {
            // Reset to default image when no size or color selected
            setImages([]);
            setDefaultImage(product ? product.image : null);
        }
    }, [selectedColor, selectedSize, productDetails, product]);

    const fetchImages = async (productDetailId) => {
        try {
            const response = await request.get(`library/${productDetailId}`);
            setImages(response.data.data);
        } catch (error) {
            showErrorAlert('Lỗi!', 'Lấy dữ liệu thất bại.');
        }
    };

    const handleSelectColor = (color) => {
        if (selectedColor === color) {
            setSelectedColor(null); // Bỏ chọn nếu đã được chọn trước đó
            setSelectedSize(null); // Đồng thời reset kích cỡ đã chọn
            setAvailableSizes(productDetails.map((detail) => detail.size.size)); // Hiển thị lại tất cả các kích cỡ có sẵn
            setAvailableColors(
                productDetails.map((detail) => detail.color.color)
            ); // Hiển thị lại tất cả các kích cỡ có sẵn
            setDefaultImage(product ? product.image : null); // Reset lại ảnh mặc định
            setImages([]); // Xóa danh sách ảnh đã chọn
            setCurrentSlide(0); // Reset vị trí slide
        } else {
            setSelectedColor(color);

            // Lấy danh sách các kích cỡ có sẵn cho màu sắc đã chọn
            const sizesForSelectedColor = productDetails
                .filter((detail) => detail.color.color === color)
                .map((detail) => detail.size.size);

            // Cập nhật danh sách kích cỡ có sẵn và disable những kích cỡ không có sẵn
            setAvailableSizes(sizesForSelectedColor);

            // Lấy chi tiết sản phẩm cho màu và kích cỡ đã chọn để lấy ảnh
            const selectedDetail = productDetails.find(
                (detail) =>
                    detail.color.color === color &&
                    detail.size.size === selectedSize
            );

            if (selectedDetail) {
                fetchImages(selectedDetail.product_detail_id);
            } else {
                setDefaultImage(product ? product.image : null); // Reset lại ảnh mặc định
                setImages([]); // Xóa danh sách ảnh đã chọn
                setCurrentSlide(0); // Reset vị trí slide
            }
        }
    };

    const handleSelectSize = (size) => {
        if (selectedSize === size) {
            setSelectedSize(null); // Bỏ chọn nếu đã được chọn trước đó
            setSelectedColor(null); // Đồng thời reset màu sắc đã chọn
            setAvailableColors(
                productDetails.map((detail) => detail.color.color)
            ); // Hiển thị lại tất cả các kích cỡ có sẵn
            setAvailableSizes(productDetails.map((detail) => detail.size.size)); // Hiển thị lại tất cả các kích cỡ có sẵn
            setDefaultImage(product ? product.image : null); // Reset lại ảnh mặc định
            setImages([]); // Xóa danh sách ảnh đã chọn
            setCurrentSlide(0); // Reset vị trí slide
        } else {
            setSelectedSize(size);

            // Lấy danh sách các màu có sẵn cho kích cỡ đã chọn
            const colorForSelectedSize = productDetails
                .filter((detail) => detail.size.size === size)
                .map((detail) => detail.color.color);

            // Cập nhật danh sách màu có sẵn và disable những màu không có sẵn
            setAvailableColors(colorForSelectedSize);

            // Lấy chi tiết sản phẩm cho màu và kích cỡ đã chọn để lấy ảnh
            const selectedDetail = productDetails.find(
                (detail) =>
                    detail.color.color === selectedColor &&
                    detail.size.size === size
            );

            if (selectedDetail) {
                fetchImages(selectedDetail.product_detail_id);
            } else {
                setDefaultImage(product ? product.image : null); // Reset lại ảnh mặc định
                setImages([]); // Xóa danh sách ảnh đã chọn
                setCurrentSlide(0); // Reset vị trí slide
            }
        }
    };

    const handleQuantityChange = (e) => {
        let newQuantity = Math.max(1, Number(e.target.value));
        if (isNaN(newQuantity)) {
            newQuantity = 1;
        }
        setQuantity(newQuantity);
    };

    const incrementQuantity = () => {
        setQuantity((prevQuantity) => prevQuantity + 1);
    };

    const decrementQuantity = () => {
        setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1));
    };

    const handleAddToCart = async (e) => {
        e.preventDefault();
        const token_type = localStorage.getItem("token_type");
        const access_token = localStorage.getItem("access_token");

        if (!selectedColor || !selectedSize || quantity < 1) {
            showErrorAlert('Lỗi!', 'Hãy chọn phân loại của sản phẩm và số lượng.');
            return;
        }

        const selectedDetail = productDetails.find(
            (detail) =>
                detail.color.color === selectedColor &&
                detail.size.size === selectedSize
        );

        if (!selectedDetail) {
            showErrorAlert('Lỗi!', 'Lấy dữ liệu thất bại.');
            return;
        }

        try {
            request.defaults.headers.common[
                "Authorization"
            ] = `${token_type} ${access_token}`;

            await request.post("add-to-cart", [
                {
                    product_detail_id: Number(selectedDetail.product_detail_id),
                    quantity: quantity,
                },
            ]);
            showSuccessAlert('Thành công!', 'Thêm sản phẩm vào giỏ hàng thành công!');
            handleClose();
        } catch (error) {
            if (!access_token) {
                showWarningAlert('Chưa đăng nhập!', 'Hãy đăng nhập để sử dụng chức năng này');
            } else {
                showErrorAlert('Lỗi!', 'Thêm sản phẩm vào giỏ hàng thất bại.');
            }
        }
    };

    // Ảnh phân loại sản phẩm
    const renderSlides = () => {
        const slideStyle = {
            transform: `translateX(-${currentSlide * 100}%)`,
        };

        if (!selectedColor || !selectedSize) {
            return (
                <div className="slide-product" style={slideStyle}>
                    <Image
                        style={{ width: "250px", height: " 250px" }}
                        src={`http://127.0.0.1:8000/uploads/product/${defaultImage}`}
                        alt="Default Product Image"
                    />
                    {!product.discount ||
                        (product.discount !== 0 && (
                            <span className="discount-badge">
                                {product.discount}% Off
                            </span>
                        ))}
                </div>
            );
        } else {
            return images.map((image, index) => (
                <div key={index} className="slide-product" data-thumb={image}>
                    <Image
                        style={{ width: "250px", height: " 250px" }}
                        src={`http://127.0.0.1:8000/uploads/library/${image.image}`}
                        alt="Selected Product Image"
                    />
                </div>
            ));
        }
    };

    const nextSlide = () => {
        setCurrentSlide((prevSlide) =>
            prevSlide === images.length - 1 ? 0 : prevSlide + 1
        );
    };

    const prevSlide = () => {
        setCurrentSlide((prevSlide) =>
            prevSlide === 0 ? images.length - 1 : prevSlide - 1
        );
    };

    return (
        <>
            <Modal show={showModal} onHide={handleClose} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>{product.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : (
                        <div className="product-detail-container">
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <h4 className="mtext-105 cl2 js-name-detail p-b-14">
                                    {product.product_name}
                                </h4>
                            </div>
                            <div className="row">
                                <div className="col-4">
                                    <div className="product-detail-image">
                                        <div
                                            className="custom-slider-product"
                                            style={{
                                                width: "250px",
                                                height: " 250px",
                                            }}
                                        >
                                            <div
                                                className="slides-product"
                                                style={{
                                                    transform: `translateX(-${
                                                        currentSlide * 100
                                                    }%)`,
                                                }}
                                            >
                                                {renderSlides()}
                                            </div>
                                            {selectedColor &&
                                                selectedSize &&
                                                images.length > 1 && (
                                                    <div className="controls-product">
                                                        <button
                                                            className="control-button-product"
                                                            style={{
                                                                background:
                                                                    "rgba(77, 67, 67, 0.2)",
                                                            }}
                                                            onClick={prevSlide}
                                                        >
                                                            &#10094;
                                                        </button>
                                                        <button
                                                            className="control-button-product"
                                                            style={{
                                                                background:
                                                                    "rgba(77, 67, 67, 0.2)",
                                                            }}
                                                            onClick={nextSlide}
                                                        >
                                                            &#10095;
                                                        </button>
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div className="product-detail-info">
                                        <div>
                                            Giá tiền:{" "}
                                            {!product.discount ? (
                                                <span className="discounted-price">
                                                    {product.price.toLocaleString(
                                                        "vi-VN",
                                                        {
                                                            style: "currency",
                                                            currency: "VND",
                                                        }
                                                    )}
                                                </span>
                                            ) : (
                                                <span className="price-container">
                                                    <span className="original-price">
                                                        {product.price.toLocaleString(
                                                            "vi-VN",
                                                            {
                                                                style: "currency",
                                                                currency: "VND",
                                                            }
                                                        )}
                                                    </span>
                                                    <span className="arrow">
                                                        →
                                                    </span>
                                                    <span className="discounted-price">
                                                        {(
                                                            product.price *
                                                            (1 -
                                                                product.discount /
                                                                    100)
                                                        ).toLocaleString(
                                                            "vi-VN",
                                                            {
                                                                style: "currency",
                                                                currency: "VND",
                                                            }
                                                        )}
                                                    </span>
                                                </span>
                                            )}
                                        </div>

                                        <p>Mô tả: {product.description}</p>
                                        <div className="p-t-33">
                                            <div className="flex-w flex-r-m p-b-10">
                                                <div className="size-203 flex-c-m respon6">
                                                    Màu sắc
                                                </div>
                                                <div
                                                    className="size-204 respon6-next"
                                                    toggle={true}
                                                >
                                                    {Array.from(
                                                        new Set(
                                                            product.product_details.map(
                                                                (detail) =>
                                                                    detail.color
                                                                        .color
                                                            )
                                                        )
                                                    ).map((color) => (
                                                        <Button
                                                            key={color}
                                                            style={{
                                                                marginRight:
                                                                    "5px",
                                                            }}
                                                            variant={
                                                                selectedColor ===
                                                                color
                                                                    ? "warning"
                                                                    : availableColors.includes(
                                                                          color
                                                                      )
                                                                    ? "outline-warning"
                                                                    : "outline-secondary"
                                                            }
                                                            onClick={() =>
                                                                handleSelectColor(
                                                                    color
                                                                )
                                                            }
                                                            disabled={
                                                                !availableColors.includes(
                                                                    color
                                                                )
                                                            }
                                                        >
                                                            {color}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex-w flex-r-m p-b-10">
                                                <div className="size-203 flex-c-m respon6">
                                                    Kích cỡ
                                                </div>
                                                <div
                                                    className="size-204 respon6-next"
                                                    toggle={true}
                                                >
                                                    {Array.from(
                                                        new Set(
                                                            product.product_details.map(
                                                                (detail) =>
                                                                    detail.size
                                                                        .size
                                                            )
                                                        )
                                                    ).map((size) => (
                                                        <Button
                                                            key={size}
                                                            style={{
                                                                marginRight:
                                                                    "5px",
                                                            }}
                                                            variant={
                                                                selectedSize ===
                                                                size
                                                                    ? "info"
                                                                    : availableSizes.includes(
                                                                          size
                                                                      )
                                                                    ? "outline-info"
                                                                    : "outline-dark"
                                                            }
                                                            onClick={() =>
                                                                handleSelectSize(
                                                                    size
                                                                )
                                                            }
                                                            disabled={
                                                                !availableSizes.includes(
                                                                    size
                                                                )
                                                            }
                                                        >
                                                            {size}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>
                                            {/* Quantity selection */}
                                            <div className="flex-w flex-r-m p-b-10">
                                                <div className="size-204 flex-w flex-m respon6-next">
                                                    <div className="wrap-num-product flex-w m-r-20 m-tb-10">
                                                        <div
                                                            className="btn-num-product-down cl8 hov-btn3 trans-04 flex-c-m"
                                                            onClick={
                                                                decrementQuantity
                                                            }
                                                        >
                                                            <i className="fs-16 zmdi zmdi-minus" />
                                                        </div>
                                                        <input
                                                            className="mtext-104 cl3 txt-center num-product"
                                                            type="number"
                                                            name="num-product"
                                                            value={quantity}
                                                            onChange={
                                                                handleQuantityChange
                                                            }
                                                        />
                                                        <div
                                                            className="btn-num-product-up cl8 hov-btn3 trans-04 flex-c-m"
                                                            onClick={
                                                                incrementQuantity
                                                            }
                                                        >
                                                            <i className="fs-16 zmdi zmdi-plus" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className="flex-w flex-r-m p-b-10"
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <Button
                                                    className="flex-c-m stext-101 cl2 size-101 bg8 bor1 hov-btn1 p-lr-15 trans-04 js-addcart-detail"
                                                    onClick={handleAddToCart}
                                                    disabled={
                                                        !selectedColor ||
                                                        !selectedSize ||
                                                        quantity < 1
                                                    }
                                                >
                                                    Thêm vào giỏ hàng
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ProductModal;
