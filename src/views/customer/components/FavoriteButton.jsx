import React, { useState, useEffect } from "react";
import { Button, Image } from "react-bootstrap";
import { useAlert } from '@utils/AlertContext';
import request from "@utils/request";

const FavoriteButton = ({ productId }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const { showSuccessAlert, showErrorAlert, showWarningAlert } = useAlert();

    useEffect(() => {
        const checkIfFavorite = async () => {
            const access_token = localStorage.getItem("access_token");
            if (!access_token) return;

            try {
                const response = await request.get("favourite", {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                });
                const favoriteProductIds = response.data.data.map(
                    (favorite) => favorite.product_id
                );
                setIsFavorite(favoriteProductIds.includes(productId));
            } catch (error) {
                console.error("Error fetching favorite products:", error);
            }
        };

        checkIfFavorite();
    }, [productId]);

    const handleAddToFavorites = async () => {
        const access_token = localStorage.getItem("access_token");
        if (!access_token) {
            showWarningAlert('Chưa đăng nhập', 'Vui lòng đăng nhập để thêm sản phẩm yêu thích');
            return;
        }

        if (isFavorite) {
            try {
                await request.delete(`favourite/${productId}`, {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                });
                setIsFavorite(false);
                showSuccessAlert('Thành công!', 'Xóa sản phẩm yêu thích thành công!');
            } catch (error) {
                showErrorAlert('Lỗi!', 'Xóa sản phẩm yêu thích thất bại');
            }
        } else {
            try {
                await request.post("favourite", {
                    product_id: productId,
                    token: access_token,
                });
                setIsFavorite(true);
                showSuccessAlert('Thành công!', 'Thêm sản phẩm yêu thích thành công!');
            } catch (error) {
                showErrorAlert('Lỗi!', 'Thêm sản phẩm yêu thích thất bại');
            }
        }
    };

    return (
        <Button
            className="btn-addwish-b2 dis-block pos-relative js-addwish-b2"
            onClick={handleAddToFavorites}
            variant="light"
        >
            <Image
                className="icon-heart1 dis-block trans-04"
                src={
                    isFavorite
                        ? "assets/customer/images/icons/icon-heart-02.png"
                        : "assets/customer/images/icons/icon-heart-01.png"
                }
                alt="ICON"
            />
        </Button>
    );
};

export default FavoriteButton;
