/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Image, Spinner } from "react-bootstrap";

import { useAlert } from "@utils/AlertContext";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import Cart from "./components/cart";
import Footer from "./components/footer";
import request from "@utils/request";
import FavoriteButton from "./components/FavoriteButton";
import ProductDescriptionReviews from "./description-review";

function ProductDetail() {
    const navigate = useNavigate();
    const productId = sessionStorage.getItem("productId");
    // Load trang
    const [product, setProduct] = useState(null);
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
        if (!productId) {
            console.error("Product id is undefined");
            navigate("/product");
            return;
        }

        // const fetchAllData = async (productDetailId) => {
        //     try {
        //         const [responseImage, responseProduct] = await Promise.all([
        //             request.get(`library/${productDetailId}`),
        //             request.get(`/product/${productId}`),
        //         ]);
        //         setImages(responseImage.data.data);

        //         const fetchedProduct = responseProduct.data.data;
        //         setProduct(fetchedProduct);
        //         setAvailableColors(
        //             fetchedProduct.product_details.map(
        //                 (detail) => detail.color.color
        //             )
        //         );
        //         setAvailableSizes(
        //             fetchedProduct.product_details.map(
        //                 (detail) => detail.size.size
        //             )
        //         );
        //         setDefaultImage(fetchedProduct.image);
        //     } catch (error) {
        //         showErrorAlert("Lỗi!", "Lấy dữ liệu thất bại.");
        //     }
        // };

        const fetchProduct = async () => {
            try {
                const response = await request.get(`/product/${productId}`);
                const fetchedProduct = response.data.data;
                setProduct(fetchedProduct);
                setAvailableColors(
                    fetchedProduct.product_details.map(
                        (detail) => detail.color.color
                    )
                );
                setAvailableSizes(
                    fetchedProduct.product_details.map(
                        (detail) => detail.size.size
                    )
                );
                setDefaultImage(fetchedProduct.image);
            } catch (error) {
                showErrorAlert("Lỗi!", "Lấy dữ liệu thất bại.");
            }
        };

        // fetchAllData();
        fetchProduct();
    }, []);

    const fetchImages = async (productDetailId) => {
        try {
            const response = await request.get(`library/${productDetailId}`);
            setImages(response.data.data);
        } catch (error) {
            showErrorAlert("Lỗi!", "Lấy dữ liệu thất bại.");
        }
    };

    useEffect(() => {
        if (selectedColor && selectedSize) {
            const selectedDetail = product.product_details.find(
                (detail) =>
                    detail.color.color === selectedColor &&
                    detail.size.size === selectedSize
            );

            if (selectedDetail) {
                fetchImages(selectedDetail.product_detail_id);
            }
        } else {
            setImages([]);
            setDefaultImage(product ? product.image : null);
        }
    }, []);

    // Xử lý chọn màu sắc, kích cỡ
    const handleSelectColor = (color) => {
        if (selectedColor === color) {
            setSelectedColor(null); // Bỏ chọn nếu đã được chọn trước đó
            setSelectedSize(null); // Đồng thời reset kích cỡ đã chọn
            setAvailableSizes(
                product.product_details.map((detail) => detail.size.size)
            ); // Hiển thị lại tất cả các kích cỡ có sẵn
            setAvailableColors(
                product.product_details.map((detail) => detail.color.color)
            ); // Hiển thị lại tất cả các kích cỡ có sẵn
            setDefaultImage(product ? product.image : null); // Reset lại ảnh mặc định
            setImages([]); // Xóa danh sách ảnh đã chọn
            setCurrentSlide(0); // Reset vị trí slide
        } else {
            setSelectedColor(color);

            // Lấy danh sách các kích cỡ có sẵn cho màu sắc đã chọn
            const sizesForSelectedColor = product.product_details
                .filter((detail) => detail.color.color === color)
                .map((detail) => detail.size.size);

            // Cập nhật danh sách kích cỡ có sẵn và disable những kích cỡ không có sẵn
            setAvailableSizes(sizesForSelectedColor);

            // Lấy chi tiết sản phẩm cho màu và kích cỡ đã chọn để lấy ảnh
            const selectedDetail = product.product_details.find(
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
            setSelectedSize(null);
            setSelectedColor(null);
            setAvailableColors(
                product.product_details.map((detail) => detail.color.color)
            );
            setAvailableSizes(
                product.product_details.map((detail) => detail.size.size)
            );
            setDefaultImage(product ? product.image : null);
            setImages([]);
            setCurrentSlide(0);
        } else {
            setSelectedSize(size);

            const colorForSelectedSize = product.product_details
                .filter((detail) => detail.size.size === size)
                .map((detail) => detail.color.color);

            setAvailableColors(colorForSelectedSize);

            const selectedDetail = product.product_details.find(
                (detail) =>
                    detail.color.color === selectedColor &&
                    detail.size.size === size
            );

            if (selectedDetail) {
                fetchImages(selectedDetail.product_detail_id);
            } else {
                setDefaultImage(product ? product.image : null);
                setImages([]);
                setCurrentSlide(0);
            }
        }
    };

    // Xử lý số lượng sản phẩm
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

    // Thêm vào giỏ hàng
    const handleAddToCart = async (e) => {
        e.preventDefault();
        const token_type = localStorage.getItem("token_type");
        const access_token = localStorage.getItem("access_token");

        if (!selectedColor || !selectedSize || quantity < 1) {
            showErrorAlert(
                "Lỗi!",
                "Hãy chọn phân loại của sản phẩm và số lượng."
            );
            return;
        }

        const selectedDetail = product.product_details.find(
            (detail) =>
                detail.color.color === selectedColor &&
                detail.size.size === selectedSize
        );

        if (selectedDetail.quantity < 1 ) {
            showErrorAlert(
                "Lỗi!",
                "Sản phẩm đã hết hàng."
            );
            return;
        }

        if (quantity>selectedDetail.quantity) {
            showErrorAlert(
                "Lỗi!",
                "Số lượng sản phẩm đã chọn quá số lượng sản phẩm còn lại."
            );
            return;
        }

        if (!selectedDetail) {
            showErrorAlert("Lỗi!", "Lấy dữ liệu thất bại.");
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
            showSuccessAlert(
                "Thành công!",
                "Sản phẩm thêm vào giỏ hàng thành công!"
            );
        } catch (error) {
            if (!access_token) {
                showWarningAlert(
                    "Chưa đăng nhập!",
                    "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng"
                );
            } else {
                showErrorAlert("Lỗi!", "Sản phẩm thêm vào giỏ hàng thất bại");
            }
        }
    };

    if (!product) {
        return (
            <>
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ minHeight: "200px" }}
                >
                    <Spinner animation="border" role="status">
                        <span className="sr-only"></span>
                    </Spinner>
                </div>
            </>
        );
    }

    // Ảnh phân loại sản phẩm
    const renderSlides = () => {
        const slideStyle = {
            transform: `translateX(-${currentSlide * 100}%)`,
        };

        if (!selectedColor || !selectedSize) {
            return (
                <div className="slide-product" style={slideStyle}>
                    <Image
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
                        src={`http://127.0.0.1:8000/uploads/library/${image.image}`}
                        alt="Selected Product Image"
                    />
                </div>
            ));
        }
    };

    const nextSlide = () => {
        setCurrentSlide(
            currentSlide === images.length - 1 ? 0 : currentSlide + 1
        );
    };

    const prevSlide = () => {
        setCurrentSlide(
            currentSlide === 0 ? images.length - 1 : currentSlide - 1
        );
    };

    return (
        <Fragment>
            <Header />
            <Sidebar />
            <Cart />
            {/* Content */}
            <section
                className="bg-img1 txt-center p-lr-15 p-tb-92"
                style={{
                    backgroundImage: 'url("assets/customer/images/bg-01.jpg")',
                }}
            >
                <h2 className="ltext-105 cl0 txt-center">CHI TIẾT SẢN PHẨM</h2>
            </section>
            <>
                {/* breadcrumb */}
                <div className="container">
                    <div className="bread-crumb flex-w p-l-25 p-r-15 p-t-30 p-lr-0-lg">
                        <Link to="/" className="stext-109 cl8 hov-cl1 trans-04">
                            Home
                            <i
                                className="fa fa-angle-right m-l-9 m-r-10"
                                aria-hidden="true"
                            />
                        </Link>
                        <span className="stext-109 cl8 hov-cl1 trans-04">
                            {product.category.category_name}
                            <i
                                className="fa fa-angle-right m-l-9 m-r-10"
                                aria-hidden="true"
                            />
                        </span>
                        <span className="stext-109 cl4">
                            {product.product_name}
                        </span>
                    </div>
                </div>
                {/* Product Detail */}
                <section className="sec-product-detail bg0 p-t-65 p-b-60">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6 col-lg-7 p-b-30">
                                <div className="p-l-25 p-r-30 p-lr-0-lg">
                                    <div className="custom-slider-product">
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
                                                        onClick={prevSlide}
                                                    >
                                                        &#10094;
                                                    </button>
                                                    <button
                                                        className="control-button-product"
                                                        onClick={nextSlide}
                                                    >
                                                        &#10095;
                                                    </button>
                                                </div>
                                            )}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-5 p-b-30">
                                <div className="p-r-50 p-t-5 p-lr-0-lg">
                                    <h4 className="mtext-105 cl2 js-name-detail p-b-14">
                                        {product.product_name}
                                    </h4>
                                    {!product.discount ? (
                                        <span className="discounted-price">
                                            {Number(
                                                product.price
                                            ).toLocaleString("vi-VN", {
                                                style: "currency",
                                                currency: "VND",
                                            })}
                                        </span>
                                    ) : (
                                        <div className="price-container">
                                            <span className="original-price">
                                                {Number(product.price).toLocaleString(
                                                    "vi-VN",
                                                    {
                                                        style: "currency",
                                                        currency: "VND",
                                                    }
                                                )}
                                            </span>
                                            <span className="arrow">→</span>
                                            <span className="discounted-price">
                                                {(
                                                    product.price *
                                                    (1 - product.discount / 100)
                                                ).toLocaleString("vi-VN", {
                                                    style: "currency",
                                                    currency: "VND",
                                                })}
                                            </span>
                                        </div>
                                    )}
                                    <p className="stext-102 cl3 p-t-23">
                                        {selectedColor && selectedSize ? (
                                            <span>
                                                <strong>
                                                    - Số lượng sản phẩm :{" "}
                                                </strong>
                                                {(() => {
                                                    const selectedDetail =
                                                        product.product_details.find(
                                                            (detail) =>
                                                                detail.color
                                                                    .color ===
                                                                    selectedColor &&
                                                                detail.size
                                                                    .size ===
                                                                    selectedSize
                                                        );
                                                    return selectedDetail
                                                        ? selectedDetail.quantity >
                                                          0
                                                            ? selectedDetail.quantity
                                                            : "Hết"
                                                        : "N/A";
                                                })()}
                                                <span> sản phẩm</span>
                                            </span>
                                        ) : (
                                            <span>
                                                <strong>
                                                    - Tổng số lượng sản phẩm:{" "}
                                                </strong>
                                                {product?.total_quantity > 0
                                                    ? product.total_quantity
                                                    : "Hết"}
                                                    <span> sản phẩm</span>
                                            </span>
                                        )}
                                    </p>

                                    <p className="stext-102 cl3 p-t-23">
                                        <strong>- Thương hiệu: </strong>
                                        {product.brand.brand_name}
                                    </p>
                                    <p className="stext-102 cl3 p-t-23">
                                        <strong>- Danh mục: </strong>
                                        {product.category.category_name}
                                    </p>
                                    {/* Product options */}
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
                                                            marginRight: "5px",
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
                                                                detail.size.size
                                                        )
                                                    )
                                                ).map((size) => (
                                                    <Button
                                                        key={size}
                                                        style={{
                                                            marginRight: "5px",
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
                                                <Button
                                                    className="flex-c-m stext-101 cl2 size-101 bg8 bor1 hov-btn1 p-lr-15 trans-04 js-addcart-detail"
                                                    onClick={handleAddToCart}
                                                >
                                                    Thêm vào giỏ hàng
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Share icons */}
                                    <div className="flex-w flex-m p-l-100 p-t-40 respon7">
                                        <FavoriteButton
                                            productId={product.product_id}
                                        />
                                        {/* Social media icons */}
                                        <a
                                            href="#"
                                            className="fs-14 cl3 hov-cl1 trans-04 lh-10 p-lr-5 p-tb-2 tooltip100"
                                            data-tooltip="Facebook"
                                        >
                                            <i className="fa fa-facebook" />
                                        </a>
                                        <a
                                            href="#"
                                            className="fs-14 cl3 hov-cl1 trans-04 lh-10 p-lr-5 p-tb-2 tooltip100"
                                            data-tooltip="Google Plus"
                                        >
                                            <i className="fa fa-google-plus" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mô tả / Đánh giá  */}
                        <ProductDescriptionReviews
                            productId={productId}
                            product={product}
                        />
                        {/* Mô tả / Đánh giá */}
                    </div>
                </section>
            </>
            <Footer />
            {/* Back to top */}
            <div className="btn-back-to-top" id="myBtn">
                <span className="symbol-btn-back-to-top">
                    <i className="zmdi zmdi-chevron-up" />
                </span>
            </div>
        </Fragment>
    );
}

export default ProductDetail;
