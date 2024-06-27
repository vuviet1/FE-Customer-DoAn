/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Image } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";

import Header from "./components/header";
import Sidebar from "./components/sidebar";
import Cart from "./components/cart";
import Footer from "./components/footer";
import request from "../../utils/request";
import { getErrorMessage } from "../../utils/errorMessages";
import FavoriteButton from "./components/FavoriteButton";

function ProductDetail() {
    const navigate = useNavigate();
    const productId = sessionStorage.getItem("productId");

    // Load trang
    const [product, setProduct] = useState(null);
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

    useEffect(() => {
        if (!productId) {
            console.error("Product id is undefined");
            navigate("/product");
            return;
        }

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
                setLoading(false);
            } catch (error) {
                let errorMessage = "Lỗi khi lấy dữ liệu sản phẩm: ";
                if (error.response && error.response.status) {
                    errorMessage += getErrorMessage(error.response.status);
                } else {
                    errorMessage += error.message;
                }
                toast.error(errorMessage, { position: "top-right" });
                setError("Lỗi khi lấy dữ liệu sản phẩm");
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId, navigate]);

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
            // Reset to default image when no size or color selected
            setImages([]);
            setDefaultImage(product ? product.image : null);
        }
    }, [selectedColor, selectedSize, product]);

    const fetchImages = async (productDetailId) => {
        try {
            const response = await request.get(`library/${productDetailId}`);
            setImages(response.data.data);
        } catch (error) {
            let errorMessage = "Lỗi khi lấy dữ liệu: ";
            if (error.response && error.response.status) {
                errorMessage += getErrorMessage(error.response.status);
            } else {
                errorMessage += error.message;
            }
            toast.error(errorMessage, { position: "top-right" });
            console.error("Lỗi khi lấy dữ liệu:", error);
        }
    };

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
            setSelectedSize(null); // Bỏ chọn nếu đã được chọn trước đó
            setSelectedColor(null); // Đồng thời reset màu sắc đã chọn
            setAvailableColors(
                product.product_details.map((detail) => detail.color.color)
            ); // Hiển thị lại tất cả các kích cỡ có sẵn
            setAvailableSizes(
                product.product_details.map((detail) => detail.size.size)
            ); // Hiển thị lại tất cả các kích cỡ có sẵn
            setDefaultImage(product ? product.image : null); // Reset lại ảnh mặc định
            setImages([]); // Xóa danh sách ảnh đã chọn
            setCurrentSlide(0); // Reset vị trí slide
        } else {
            setSelectedSize(size);

            // Lấy danh sách các màu có sẵn cho kích cỡ đã chọn
            const colorForSelectedSize = product.product_details
                .filter((detail) => detail.size.size === size)
                .map((detail) => detail.color.color);

            // Cập nhật danh sách màu có sẵn và disable những màu không có sẵn
            setAvailableColors(colorForSelectedSize);

            // Lấy chi tiết sản phẩm cho màu và kích cỡ đã chọn để lấy ảnh
            const selectedDetail = product.product_details.find(
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
            toast.error("Hãy chọn phân loại của sản phẩm và số lượng.", {
                position: "top-right",
            });
            return;
        }

        const selectedDetail = product.product_details.find(
            (detail) =>
                detail.color.color === selectedColor &&
                detail.size.size === selectedSize
        );

        if (!selectedDetail) {
            toast.error("Lỗi dữ liệu.", {
                position: "top-right",
            });
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
            toast.success("Sản phẩm thêm vào giỏ hàng thành công!", {
                position: "top-right",
            });
        } catch (error) {
            let errorMessage = "Sản phẩm thêm vào giỏ hàng thất bại: ";
            if (error.response && error.response.status) {
                errorMessage += getErrorMessage(error.response.status);
            } else {
                errorMessage += error.message;
            }
            toast.error(errorMessage, {
                position: "top-right",
            });
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
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
            <ToastContainer />
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
                                    <span className="mtext-106 cl2">
                                        {product.price
                                            ? product.price.toLocaleString(
                                                  "vi-VN",
                                                  {
                                                      style: "currency",
                                                      currency: "VND",
                                                  }
                                              )
                                            : "N/A"}
                                    </span>
                                    <p className="stext-102 cl3 p-t-23">
                                        {product.description}
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
                                            data-tooltip="Twitter"
                                        >
                                            <i className="fa fa-twitter" />
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
                    </div>
                </section>
                {/* Related Products */}
                <section className="sec-relate-product bg0 p-t-45 p-b-105">
                    <div className="container">
                        <div className="p-b-45">
                            <h3 className="ltext-106 cl5 txt-center">
                                Sản phẩm có liên quan
                            </h3>
                        </div>
                        {/* Placeholder for related products */}
                        <div className="wrap-slick2">
                            <div className="slick2">
                                {/* Add your related products here */}
                            </div>
                        </div>
                    </div>
                </section>
            </>
            <Footer />
        </Fragment>
    );
}

export default ProductDetail;
