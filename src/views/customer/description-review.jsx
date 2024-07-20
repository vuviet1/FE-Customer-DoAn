/* eslint-disable react-hooks/exhaustive-deps */
// Import useState from React
import React, { useEffect, useState } from "react";
import { Form, Button, Image, Modal } from "react-bootstrap";
import ReactQuill from "react-quill";
import { useAlert } from '@utils/AlertContext';

import request from "@utils/request";
import ModalEditReview from "./edit-review";

const ProductDescriptionReviews = ({ productId, product }) => {
    const [reviews, setReviews] = useState([]);
    const [review, setReview] = useState(0);
    const [checkReview, setCheckReview] = useState(false);
    const [evaluation, setEvaluation] = useState("");
    const [hoverRating, setHoverRating] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [editingReview, setEditingReview] = useState(null);
    const reviewsPerPage = 5;
    const [showDeleteModal, setShowDeleteModal] = useState(false); 
    const [showEditModal, setShowEditModal] = useState(false);
    const { showSuccessAlert, showErrorAlert } = useAlert();

    const sanitizeInput = (input) => {
        return input.replace(/<[^>]*>?/gm, '');
    };

    // Fetch reviews
    const fetchReview = async () => {
        const access_token = localStorage.getItem("access_token");
        // if (!access_token) return;
        request.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${access_token}`;
        try {
            const response = await request.get("review");
            const data = response.data.data;
            const filteredReviews = data.filter(review => review.product_id === Number(productId));
            setReviews(filteredReviews);
        } catch (error) {
            showErrorAlert('Lỗi!', 'Lấy dữ liệu thất bại.');
        }
    };

    // Check if user can review
    const fetchCheckReview = async () => {
        const access_token = localStorage.getItem("access_token");
        if (!access_token) return;
        request.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${access_token}`;
        request.defaults.headers.common["Token"] = `${access_token}`;

        try {
            const response = await request.post("order/display-by-user");
            const orders = response.data.data;
            const canReview = orders.some(
                (order) =>
                    order.status === 4 &&
                    order.order_details.some(
                        (detail) =>
                            detail.product_detail.product.product_id ===
                            Number(productId)
                    )
            );
            setCheckReview(canReview);
        } catch (error) {
            showErrorAlert('Lỗi!', 'Lấy dữ liệu thất bại.');
        }
    };

    // Handle review submission
    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        const access_token = localStorage.getItem("access_token");
        if (!access_token) return;
        request.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${access_token}`;
        request.defaults.headers.common["Token"] = `${access_token}`;

        try {
            const response = await request.post("review", {
                review: review,
                // evaluation: evaluation.replace(/<p>|<\/p>/g, ""),
                evaluation: sanitizeInput(evaluation),
                product_id: Number(productId),
            });

            if (response.status === 200) {
                showSuccessAlert('Thành công!', 'Gửi đánh giá sản phẩm thành công!');
                setReview(0);
                setEvaluation("");
                fetchReview();
            } else {
                showErrorAlert('Lỗi!', 'Lỗi khi gửi đánh giá sản phẩm.');
            }
        } catch (error) {
            showErrorAlert('Lỗi!', 'Lỗi khi gửi đánh giá sản phẩm.');
        }
    };

    // Handle opening edit review modal
    const openEditModal = (reviewId) => {
        if (reviewId) {
            setEditingReview(reviewId);
            setShowEditModal(true);
        }
    };

    // Handle closing edit review modal
    const closeEditModal = () => {
        setShowEditModal(false);
        setEditingReview(null);
        fetchReview()
    };

    // Handle deleting a review
    const handleDeleteReview = async () => {
        const access_token = localStorage.getItem("access_token");
        if (!access_token || !editingReview) return;

        request.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${access_token}`;
        request.defaults.headers.common["Token"] = `${access_token}`;

        try {
            const response = await request.delete(`review/${editingReview}`);

            if (response.status === 200) {
                showSuccessAlert('Thành công!', 'Xóa đánh giá sản phẩm thành công.');
                setEditingReview(null);
                setShowDeleteModal(false);
                fetchReview();
            } else {
                showErrorAlert('Lỗi!', 'Lỗi khi xóa đánh giá sản phẩm.');
            }
        } catch (error) {
            showErrorAlert('Lỗi!', 'Lỗi khi xóa đánh giá sản phẩm.');
        }
    };

    // Handle opening delete confirmation modal
    const openDeleteModal = (reviewId) => {
        if (reviewId) {
            setEditingReview(reviewId);
            setShowDeleteModal(true);
        }
    };

    // Handle closing delete confirmation modal
    const closeDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const handleEvaluationChange = (value) => {
        setEvaluation(value);
        // setEvaluation(sanitizeInput(value));
    };

    const handleRatingChange = (rating) => {
        setReview(rating);
    };

    const handleMouseOverRating = (rating) => {
        setHoverRating(rating);
    };

    const handleMouseLeaveRating = () => {
        setHoverRating(0);
    };

    useEffect(() => {
        fetchReview();
        fetchCheckReview();
    }, []);

    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="bor10 m-t-50 p-t-43 p-b-40">
            <div className="tab01">
                <ul className="nav nav-tabs" role="tablist">
                    <li className="nav-item p-b-10">
                        <a
                            className="nav-link active"
                            data-toggle="tab"
                            href="#description"
                            role="tab"
                        >
                            Mô tả sản phẩm
                        </a>
                    </li>
                    <li className="nav-item p-b-10">
                        <a
                            className="nav-link"
                            data-toggle="tab"
                            href="#information"
                            role="tab"
                        >
                            Thông tin chi tiết
                        </a>
                    </li>
                    <li className="nav-item p-b-10">
                        <a
                            className="nav-link"
                            data-toggle="tab"
                            href="#reviews"
                            role="tab"
                        >
                            Đánh giá ({reviews.length})
                        </a>
                    </li>
                </ul>
                <div className="tab-content p-t-43">
                    <div
                        className="tab-pane fade show active"
                        id="description"
                        role="tabpanel"
                    >
                        <div className="how-pos2 p-lr-15-md">
                            <p className="stext-102 cl6">
                                {product.description}
                            </p>
                        </div>
                    </div>
                    <div
                        className="tab-pane fade"
                        id="information"
                        role="tabpanel"
                    >
                        <div className="row">
                            <div className="col-sm-10 col-md-8 col-lg-6 m-lr-auto">
                                <ul className="p-lr-28 p-lr-15-sm">
                                    <li className="flex-w flex-t p-b-7">
                                        <span className="stext-102 cl3 size-205">
                                            Thương hiệu
                                        </span>
                                        <span className="stext-102 cl6 size-206">
                                            {product.brand.brand_name}
                                        </span>
                                    </li>
                                    <li className="flex-w flex-t p-b-7">
                                        <span className="stext-102 cl3 size-205">
                                            Danh mục
                                        </span>
                                        <span className="stext-102 cl6 size-206">
                                            {product.category.category_name}
                                        </span>
                                    </li>
                                    {/* <li className="flex-w flex-t p-b-7">
                                        <span className="stext-102 cl3 size-205">
                                            Màu sắc
                                        </span>
                                        <span className="stext-102 cl6 size-206">
                                            {product.product_details
                                                .map(
                                                    (detail) =>
                                                        detail.color.color
                                                )
                                                .join(", ")}
                                        </span>
                                    </li> */}
                                    {/* <li className="flex-w flex-t p-b-7">
                                        <span className="stext-102 cl3 size-205">
                                            Kích cỡ
                                        </span>
                                        <span className="stext-102 cl6 size-206">
                                            {product.product_details
                                                .map(
                                                    (detail) => detail.size.size
                                                )
                                                .join(", ")}
                                        </span>
                                    </li> */}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="tab-pane fade" id="reviews" role="tabpanel">
                        <div className="row">
                            <div className="col-sm-10 col-md-8 col-lg-6 m-lr-auto">
                                <div className="p-b-30 m-lr-15-sm">
                                    {currentReviews.map((review, index) => (
                                        <div
                                            className="flex-w flex-t p-b-68"
                                            key={index}
                                        >
                                            <div className="wrap-pic-s size-109 bor0 of-hidden m-r-18 m-t-6">
                                                <Image
                                                    src={`http://127.0.0.1:8000/uploads/avatar/${review.user.avatar}`}
                                                    alt="AVATAR"
                                                />
                                            </div>
                                            <div className="size-207">
                                                <div className="flex-w flex-sb-m p-b-17">
                                                    <span className="mtext-107 cl2 p-r-20">
                                                        {review.user.name}
                                                    </span>
                                                    <span className="fs-18 cl11">
                                                        {[...Array(5)].map(
                                                            (_, index) => (
                                                                <i
                                                                    key={index}
                                                                    className={`zmdi ${
                                                                        index <
                                                                        review.review
                                                                            ? "zmdi-star"
                                                                            : index ===
                                                                              Math.floor(
                                                                                  review
                                                                              )
                                                                            ? "zmdi-star-half"
                                                                            : "zmdi-star-outline"
                                                                    }`}
                                                                />
                                                            )
                                                        )}
                                                    </span>
                                                </div>
                                                <p className="stext-102 cl6">
                                                    {review.evaluation}
                                                </p>
                                                {checkReview && (
                                                    <div className="flex-sb-m flex-w p-t-15">
                                                        {review.user.id ===
                                                            JSON.parse(
                                                                localStorage.getItem(
                                                                    "user_data"
                                                                )
                                                            ).user_id && (
                                                            <div className="dropdown">
                                                                <button
                                                                    className="btn btn-secondary dropdown-toggle"
                                                                    type="button"
                                                                    id={`dropdownMenuButton-${index}`}
                                                                    data-toggle="dropdown"
                                                                    aria-haspopup="true"
                                                                    aria-expanded="false"
                                                                >
                                                                    Chỉnh sửa
                                                                </button>
                                                                <div
                                                                    className="dropdown-menu"
                                                                    aria-labelledby={`dropdownMenuButton-${index}`}
                                                                >
                                                                    <button
                                                                        className="dropdown-item"
                                                                        onClick={() =>
                                                                            openEditModal(review.review_id)
                                                                        }
                                                                    >
                                                                        Cập nhật
                                                                    </button>
                                                                    <button
                                                                        className="dropdown-item"
                                                                        onClick={() =>
                                                                            openDeleteModal(
                                                                                review.review_id
                                                                            )
                                                                        }
                                                                    >
                                                                        Xóa
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <div
                                        className="pagination flex-w p-t-10"
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            marginBottom: "20px",
                                        }}
                                    >
                                        {[...Array(totalPages)].map(
                                            (_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() =>
                                                        handlePageChange(
                                                            index + 1
                                                        )
                                                    }
                                                    className={`flex-c-m how-pagination1 trans-04 m-all-7 ${
                                                        index + 1 ===
                                                        currentPage
                                                            ? "active-pagination1"
                                                            : ""
                                                    }`}
                                                >
                                                    {index + 1}
                                                </button>
                                            )
                                        )}
                                    </div>
                                    {checkReview && (
                                        <Form
                                            className="w-full"
                                            onSubmit={handleReviewSubmit}
                                        >
                                            <h5 className="mtext-108 cl2 p-b-7">
                                                Thêm đánh giá của bạn
                                            </h5>
                                            <div className="flex-w flex-m p-t-50 p-b-23">
                                                <div
                                                    className="wrap-rating fs-18 cl11 pointer"
                                                    style={{
                                                        marginBottom: "10px",
                                                    }}
                                                >
                                                    {[...Array(5)].map(
                                                        (_, index) => (
                                                            <i
                                                                key={index}
                                                                className={`zmdi ${
                                                                    index <
                                                                    (hoverRating ||
                                                                        review)
                                                                        ? "zmdi-star"
                                                                        : "zmdi-star-outline"
                                                                }`}
                                                                onClick={() =>
                                                                    handleRatingChange(
                                                                        index +
                                                                            1
                                                                    )
                                                                }
                                                                onMouseEnter={() =>
                                                                    handleMouseOverRating(
                                                                        index +
                                                                            1
                                                                    )
                                                                }
                                                                onMouseLeave={
                                                                    handleMouseLeaveRating
                                                                }
                                                                style={{
                                                                    cursor: "pointer",
                                                                    marginRight:
                                                                        "5px",
                                                                }}
                                                            />
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                            <div className="row p-b-25">
                                                <Form.Group
                                                    controlId="evaluation"
                                                    style={{
                                                        marginBottom: "10px",
                                                    }}
                                                >
                                                    <Form.Label>
                                                        Nội dung
                                                    </Form.Label>
                                                    <ReactQuill
                                                        value={evaluation
                                                        }
                                                        onChange={
                                                            handleEvaluationChange
                                                        }
                                                        style={{
                                                            height: "150px",
                                                            marginBottom:
                                                                "50px",
                                                        }}
                                                    />
                                                </Form.Group>
                                            </div>
                                            <Button
                                                type="submit"
                                                variant="primary"
                                                className="flex-c-m stext-102 cl0 size-112 bg7 bor11 hov-btn3 p-lr-15 trans-04 m-b-10"
                                            >
                                                Gửi đánh giá
                                            </Button>
                                        </Form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                show={showDeleteModal}
                onHide={closeDeleteModal}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa đánh giá</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc chắn muốn xóa đánh giá này không?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeDeleteModal}>
                        Hủy bỏ
                    </Button>
                    <Button variant="danger" onClick={handleDeleteReview}>
                        Xác nhận xóa
                    </Button>
                </Modal.Footer>
            </Modal>
            <ModalEditReview
                show={showEditModal}
                handleClose={closeEditModal}
                review={editingReview}
                productId={productId}
                fetchReview={fetchReview}
            />
        </div>
    );
};

export default ProductDescriptionReviews;
