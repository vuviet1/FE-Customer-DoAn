/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */
import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Image } from "react-bootstrap";
import request from "@utils/request";

function Cart(props) {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        const token_type = localStorage.getItem("token_type");
        const access_token = localStorage.getItem("access_token");
        if (!access_token) return;
        request.defaults.headers.common[
            "Authorization"
        ] = `${token_type} ${access_token}`;
        try {
            const response = await request.get("cart");
            const cartData = response.data.data;
            setCartItems(cartData);
        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
    };

    const removeFromCart = async (product_detail_id) => {
        const token_type = localStorage.getItem("token_type");
        const access_token = localStorage.getItem("access_token");
        request.defaults.headers.common[
            "Authorization"
        ] = `${token_type} ${access_token}`;
        try {
            await request.delete(`cart/${product_detail_id}`);
            const updatedCartItems = cartItems.filter(
                (item) => item.product_detail_id !== product_detail_id
            );
            setCartItems(updatedCartItems);
        } catch (error) {
            console.error("Error removing item from cart:", error);
        }
    };

    const calculateTotalPrice = () => {
        const total = cartItems.reduce((total, item) => {
            const discountPrice = item.product_detail.product.price * (1 - item.product_detail.product.discount / 100);
            return total + item.quantity * discountPrice;
        }, 0);
        
        return total.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
        });
    };

    const handleProductClick = (productId) => {
        sessionStorage.setItem("productId", productId);
        window.location.href = `/product-detail`;
    };

    return (
        <Fragment>
            <div
                className="wrap-header-cart js-panel-cart"
                ref={props?.wrapperCartRef}
            >
                <div className="s-full js-hide-cart" />
                <div className="header-cart flex-col-l p-l-65 p-r-25">
                    <div className="header-cart-title flex-w flex-sb-m p-b-8">
                        <span className="mtext-103 cl2">Giỏ hàng của bạn</span>
                        <div className="fs-35 lh-10 cl2 p-lr-5 pointer hov-cl1 trans-04 js-hide-cart">
                            <i className="zmdi zmdi-close" />
                        </div>
                        <div>
                            <p>Hiện tại đang có: <span style={{color:"red"}}>{cartItems.length}</span> sản phẩm</p>
                        </div>
                    </div>
                    <div className="header-cart-content flex-w js-pscroll">
                        {cartItems.length > 0 ? (
                            <ul className="header-cart-wrapitem w-full">
                                {cartItems.map((item) => (
                                    <li
                                        key={item.product_detail_id}
                                        className="header-cart-item flex-w flex-t m-b-12"
                                    >
                                        <div
                                            className="header-cart-item-img"
                                            style={{
                                                width: "60px",
                                                position: "relative",
                                                marginRight: "20px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <Link
                                                key={
                                                    item.product_detail.product
                                                        .product_id
                                                }
                                                onClick={() =>
                                                    handleProductClick(
                                                        item.product_detail
                                                            .product.product_id
                                                    )
                                                }
                                            >
                                                <Image
                                                    src={`http://127.0.0.1:8000/uploads/product/${item.product_detail.product.image}`}
                                                    alt="IMG"
                                                />
                                            </Link>
                                        </div>
                                        <div className="header-cart-item-txt p-t-8">
                                            <Link
                                                key={
                                                    item.product_detail.product
                                                        .product_id
                                                }
                                                onClick={() =>
                                                    handleProductClick(
                                                        item.product_detail
                                                            .product.product_id
                                                    )
                                                }
                                                className="header-cart-item-name m-b-18 hov-cl1 trans-04"
                                            >
                                                {
                                                    item.product_detail.product
                                                        .product_name
                                                }
                                            </Link>
                                            <span className="header-cart-item-info">
                                                {item.quantity} x{" "}
                                                {(
                                                    item.product_detail.product
                                                        .price *
                                                    (1 -
                                                        item.product_detail
                                                            .product.discount /
                                                            100)
                                                ).toLocaleString("vi-VN", {
                                                    style: "currency",
                                                    currency: "VND",
                                                })}
                                            </span>
                                            <button
                                                className="btn-remove-cart-item cl8 hov-btn3 trans-04 flex-c-m"
                                                onClick={() =>
                                                    removeFromCart(
                                                        item.product_detail_id
                                                    )
                                                }
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center w-full">
                                Không có sản phẩm nào
                            </p>
                        )}
                        <div className="w-full">
                            <div className="header-cart-total w-full p-tb-40">
                                Tổng: <span  style={{ color:"red" }}>{calculateTotalPrice()}</span>
                            </div>
                            <div className="header-cart-buttons flex-w w-full" style={{ display:"flex", justifyContent:"center" }}>
                                <Link
                                    to={"/shopping-cart"}
                                    className="flex-c-m stext-101 cl0 size-107 bg3 bor2 hov-btn3 p-lr-15 trans-04 m-r-8 m-b-10"
                                >
                                    Thanh toán
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default Cart;
