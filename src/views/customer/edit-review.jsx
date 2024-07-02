import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import ReactQuill from "react-quill";
import { toast } from "react-toastify";
import request from "../../utils/request";

const EditReviewModal = ({ show, handleClose, review, productId }) => {
    const [editedReview, setEditedReview] = useState({
        review: "",
        evaluation: "",
    });
    const [hoverRating, setHoverRating] = useState(0);

    useEffect(() => {
        if (show && review) {
            const fetchReviewData = async () => {
                try {
                    const access_token = localStorage.getItem("access_token");
                    if (!access_token) return;

                    request.defaults.headers.common[
                        "Authorization"
                    ] = `Bearer ${access_token}`;

                    const response = await request.get(`review/${review}`);

                    const { review: apiReview, evaluation } =
                        response.data.data;
                    setEditedReview({
                        review: apiReview,
                        evaluation: evaluation || "",
                    });
                } catch (error) {
                    toast.error("Lỗi khi lấy dữ liệu: ", {
                        position: "top-right",
                    });
                }
            };

            fetchReviewData();
        }
    }, [show, review]);

    const handleRatingChange = (rating) => {
        setEditedReview((prevReview) => ({
            ...prevReview,
            review: rating,
        }));
    };

    const handleEvaluationChange = (value) => {
        setEditedReview((prevReview) => ({
            ...prevReview,
            evaluation: value,
        }));
    };

    const handleEditReview = async (e) => {
        e.preventDefault();

        const access_token = localStorage.getItem("access_token");
        if (!access_token || !review) return;

        request.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${access_token}`;

        try {
            await request.put(`review/${review}`, {
                review: editedReview.review,
                evaluation: editedReview.evaluation.replace(/<p>|<\/p>/g, ""),
                product_id: Number(productId),
            });

            toast.success("Sửa đánh giá sản phẩm thành công!", {
                position: "top-right",
            });
            handleClose()
        } catch (error) {
            toast.error("Lỗi khi cập nhật đánh giá sản phẩm", {
                position: "top-right",
            });
        }
    };

    const handleMouseOverRating = (rating) => {
        setHoverRating(rating);
    };

    const handleMouseLeaveRating = () => {
        setHoverRating(0);
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Chỉnh sửa đánh giá</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleEditReview}>
                    <div className="flex-w flex-m p-t-50 p-b-23">
                        <div
                            className="wrap-rating fs-18 cl11 pointer"
                            style={{
                                marginBottom: "10px",
                            }}
                        >
                            {[...Array(5)].map((_, index) => (
                                <i
                                    key={index}
                                    className={`zmdi ${
                                        index <
                                        (hoverRating || editedReview.review)
                                            ? "zmdi-star"
                                            : "zmdi-star-outline"
                                    }`}
                                    onClick={() =>
                                        handleRatingChange(index + 1)
                                    }
                                    onMouseEnter={() =>
                                        handleMouseOverRating(index + 1)
                                    }
                                    onMouseLeave={handleMouseLeaveRating}
                                    style={{
                                        cursor: "pointer",
                                        marginRight: "5px",
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="row p-b-25">
                        <Form.Group
                            controlId="evaluation"
                            style={{ marginBottom: "10px" }}
                        >
                            <Form.Label>Nội dung</Form.Label>
                            <ReactQuill
                                value={editedReview.evaluation}
                                onChange={handleEvaluationChange}
                                style={{
                                    height: "150px",
                                    marginBottom: "50px",
                                }}
                            />
                        </Form.Group>
                    </div>
                    <Button
                        type="submit"
                        variant="primary"
                        className="flex-c-m stext-102 cl0 size-112 bg7 bor11 hov-btn3 p-lr-15 trans-04 m-b-10"
                    >
                        Lưu thay đổi
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditReviewModal;
