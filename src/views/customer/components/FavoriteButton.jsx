import React, { useState, useEffect } from "react";
import { Button, Image } from "react-bootstrap";
import { toast } from "react-toastify";
import request from "../../../utils/request";

const FavoriteButton = ({ productId, onFavoriteChange  }) => {
    const [isFavorite, setIsFavorite] = useState(false);

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
            toast.warning("Chưa đăng nhập. Vui lòng đăng nhập để thêm sản phẩm vào yêu thích.", {
                position: "top-right",
            });
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
                toast.success("Xóa sản phẩm yêu thích thành công!", {
                    position: "top-right",
                });
            } catch (error) {
                toast.error("Xóa sản phẩm yêu thích thất bại.", {
                    position: "top-right",
                });
            }
        } else {
            try {
                await request.post("favourite", {
                    product_id: productId,
                    token: access_token,
                });
                setIsFavorite(true);
                toast.success("Thêm sản phẩm yêu thích thành công!", {
                    position: "top-right",
                });
            } catch (error) {
                toast.error("Thêm sản phẩm yêu thích thất bại.", {
                    position: "top-right",
                });
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
