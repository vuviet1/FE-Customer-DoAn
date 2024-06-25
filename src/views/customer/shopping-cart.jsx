/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */
import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, Button, Form, Modal, Image } from "react-bootstrap";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { toast, ToastContainer } from "react-toastify";

import Header from "./components/header";
import Sidebar from "./components/sidebar";
import Cart from "./components/cart";
import Footer from "./components/footer";
import request from "../../utils/request";

function ShoppingCart() {
    const [cartItems, setCartItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(5); // Number of items per page
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [productToRemove, setProductToRemove] = useState(null);

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [paymentMethodId, setPaymentMethodId] = useState("");
    const [shippingMethodId, setShippingMethodId] = useState("");
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [shippingMethods, setShippingMethods] = useState([]);

    useEffect(() => {
        fetchCartItems();
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const paymentResponse = await request.get("payment");
            setPaymentMethods(paymentResponse.data.data);

            const shippingResponse = await request.get("shipping");
            setShippingMethods(shippingResponse.data.data);
        } catch (error) {
            toast.error("Lấy dữ liệu thất bại.", {
                position: "top-right"
            });
        }
    };

    const fetchCartItems = async () => {
        const token_type = localStorage.getItem("token_type");
        const access_token = localStorage.getItem("access_token");
        request.defaults.headers.common[
            "Authorization"
        ] = `${token_type} ${access_token}`;
        try {
            const response = await request.get("cart");
            const cartData = response.data.data;
            setCartItems(cartData);
            setFilteredItems(cartData);
        } catch (error) {
            toast.error("Lấy dữ liệu thất bại.", {
                position: "top-right"
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const orderData = {
            voucher_code: "",
            name,
            address,
            phone_number: phoneNumber,
            payment_method_id: paymentMethodId,
            shipping_method_id: shippingMethodId,
        };

        const token_type = localStorage.getItem("token_type");
        const access_token = localStorage.getItem("access_token");
        request.defaults.headers.common[
            "Authorization"
        ] = `${token_type} ${access_token}`;

        try {
            await request.post("order", orderData);
            onAddOrder();
            fetchCartItems();
        } catch (error) {
            toast.error("Thêm hóa đơn thất bại.", {
                position: "top-right"
            });
        }
    };

    const onAddOrder = () => {
        toast.success("Đã tạo hóa đơn thành công!", {
            position: "top-right"
        });
    };

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = cartItems.filter((item) =>
            item.product_detail.product.product_name
                .toLowerCase()
                .includes(query)
        );
        setFilteredItems(filtered);
        setCurrentPage(0);
    };

    const handleQuantityChange = (product_detail_id, newQuantity) => {
        if (newQuantity < 0) return;

        if (newQuantity === 0) {
            setProductToRemove(product_detail_id);
            setShowModal(true);
            return;
        }

        const updatedCartItems = cartItems.map((item) => {
            if (item.product_detail_id === product_detail_id) {
                return { ...item, quantity: newQuantity };
            }
            return item;
        });
        setCartItems(updatedCartItems);
        setFilteredItems(updatedCartItems);
    };

    const confirmRemoveProduct = async () => {
        const token_type = localStorage.getItem("token_type");
        const access_token = localStorage.getItem("access_token");
        request.defaults.headers.common[
            "Authorization"
        ] = `${token_type} ${access_token}`;
        try {
            await request.delete(`/cart/${productToRemove}`);
            const updatedCartItems = cartItems.filter(
                (item) => item.product_detail_id !== productToRemove
            );
            setCartItems(updatedCartItems);
            setFilteredItems(updatedCartItems);
            setShowModal(false);
            toast.success("Xóa sản phẩm khỏi giỏ hàng thành công!", {
                position: "top-right"
            });
        } catch (error) {
            console.error("Error removing item from cart:", error);
            toast.error("Xóa sản phẩm khỏi giỏ hàng thất bại.", {
                position: "top-right"
            });
        }
    };

    const removeFromCart = async (product_detail_id) => {
        setProductToRemove(product_detail_id);
        setShowModal(true);
    };

    const offset = currentPage * itemsPerPage;
    const currentPageItems = filteredItems.slice(offset, offset + itemsPerPage);

    const calculateTotalPrice = () => {
        return filteredItems.reduce(
            (total, item) =>
                total + item.quantity * item.product_detail.product.price,
            0
        );
    };

    const handleProductClick = (productId) => {
        sessionStorage.setItem("productId", productId);
        window.location.href = `/product-detail`;
    };

    return (
        <Fragment>
            <ToastContainer />
            <Header />
            <Sidebar />
            <Cart />
            {/* Content */}
            <>
                <section
                    className="bg-img1 txt-center p-lr-15 p-tb-92"
                    style={{
                        backgroundImage:
                            'url("assets/customer/images/bg-01.jpg")',
                    }}
                >
                    <h2 className="ltext-105 cl0 txt-center">GIỎ HÀNG</h2>
                </section>
                {/* breadcrumb */}
                <div className="container">
                    <div className="bread-crumb flex-w p-l-25 p-r-15 p-t-30 p-lr-0-lg">
                        <Link
                            to={"/"}
                            className="stext-109 cl8 hov-cl1 trans-04"
                        >
                            Home
                            <i
                                className="fa fa-angle-right m-l-9 m-r-10"
                                aria-hidden="true"
                            />
                        </Link>
                        <span className="stext-109 cl4">Giỏ hàng</span>
                    </div>
                </div>
                {/* Shopping Cart */}
                <div className="bg0 p-t-75 p-b-85">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 m-lr-auto m-b-50">
                                <div className="m-l-25 m-r--38 m-lr-0-xl">
                                    <Form.Group controlId="searchQuery">
                                        <Form.Control
                                            type="text"
                                            placeholder="Tìm kiếm sản phẩm..."
                                            value={searchQuery}
                                            onChange={handleSearch}
                                            style={{ marginBottom: "20px" }}
                                        />
                                    </Form.Group>
                                    <div className="wrap-table-shopping-cart">
                                        <Table responsive="sm">
                                            <thead>
                                                <tr>
                                                    <th>Sản phẩm</th>
                                                    <th>Tên sản phẩm</th>
                                                    <th>Giá</th>
                                                    <th>Kích cỡ</th>
                                                    <th>Màu sắc</th>
                                                    <th>Số lượng</th>
                                                    <th>Tổng tiền</th>
                                                    <th>Hành động</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentPageItems.length > 0 ? (
                                                    currentPageItems.map(
                                                        (item) => (
                                                            <tr
                                                                key={
                                                                    item.product_detail_id
                                                                }
                                                            >
                                                                <td>
                                                                    <div className="">
                                                                        {/* <div className="how-itemcart1"> */}
                                                                        <Link
                                                                            key={
                                                                                item
                                                                                    .product_detail
                                                                                    .product
                                                                                    .product_id
                                                                            }
                                                                            onClick={() =>
                                                                                handleProductClick(
                                                                                    item
                                                                                        .product_detail
                                                                                        .product
                                                                                        .product_id
                                                                                )
                                                                            }
                                                                        >
                                                                            <Image
                                                                                src={`http://127.0.0.1:8000/uploads/product/${item.product_detail.product.image}`}
                                                                                alt="IMG"
                                                                                style={{
                                                                                    width: "100px",
                                                                                    height: "100px",
                                                                                }}
                                                                            />
                                                                        </Link>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    {
                                                                        item
                                                                            .product_detail
                                                                            .product
                                                                            .product_name
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        item
                                                                            .product_detail
                                                                            .product
                                                                            .price
                                                                    }
                                                                    VNĐ
                                                                </td>
                                                                <td>
                                                                    {
                                                                        item
                                                                            .product_detail
                                                                            .color
                                                                            .color
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        item
                                                                            .product_detail
                                                                            .size
                                                                            .size
                                                                    }
                                                                </td>
                                                                <td>
                                                                    <div className="wrap-num-product flex-w m-r-20 m-tb-10">
                                                                        <div
                                                                            className="btn-num-product-down cl8 hov-btn3 trans-04 flex-c-m"
                                                                            onClick={() =>
                                                                                handleQuantityChange(
                                                                                    item.product_detail_id,
                                                                                    item.quantity -
                                                                                        1
                                                                                )
                                                                            }
                                                                        >
                                                                            <i className="fs-16 zmdi zmdi-minus" />
                                                                        </div>
                                                                        <input
                                                                            className="mtext-104 cl3 txt-center num-product"
                                                                            type="number"
                                                                            name="num-product"
                                                                            value={
                                                                                item.quantity
                                                                            }
                                                                            onChange={
                                                                                handleQuantityChange
                                                                            }
                                                                            min={
                                                                                1
                                                                            }
                                                                        />
                                                                        <div
                                                                            className="btn-num-product-up cl8 hov-btn3 trans-04 flex-c-m"
                                                                            onClick={() =>
                                                                                handleQuantityChange(
                                                                                    item.product_detail_id,
                                                                                    item.quantity +
                                                                                        1
                                                                                )
                                                                            }
                                                                        >
                                                                            <i className="fs-16 zmdi zmdi-plus" />
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    {item.quantity *
                                                                        item
                                                                            .product_detail
                                                                            .product
                                                                            .price}{" "}
                                                                    VNĐ
                                                                </td>
                                                                <td>
                                                                    <Button
                                                                        variant="danger"
                                                                        onClick={() =>
                                                                            removeFromCart(
                                                                                item.product_detail_id
                                                                            )
                                                                        }
                                                                    >
                                                                        Xóa
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    )
                                                ) : (
                                                    <tr>
                                                        <td
                                                            colSpan="6"
                                                            className="text-center"
                                                        >
                                                            Không có sản phẩm
                                                            nào
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    </div>
                                    <div className="d-flex justify-content-center">
                                        <ReactPaginate
                                            previousLabel={
                                                <FaAngleDoubleLeft />
                                            }
                                            nextLabel={<FaAngleDoubleRight />}
                                            breakLabel={"..."}
                                            breakClassName={"break-me"}
                                            pageCount={Math.ceil(
                                                filteredItems.length /
                                                    itemsPerPage
                                            )}
                                            marginPagesDisplayed={2}
                                            pageRangeDisplayed={5}
                                            onPageChange={handlePageClick}
                                            containerClassName={"pagination"}
                                            subContainerClassName={
                                                "pages pagination"
                                            }
                                            activeClassName={"active"}
                                            pageClassName={"page-item"}
                                            pageLinkClassName={"page-link"}
                                            previousClassName={"page-item"}
                                            previousLinkClassName={"page-link"}
                                            nextClassName={"page-item"}
                                            nextLinkClassName={"page-link"}
                                            breakLinkClassName={"page-link"}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/*  */}
                <div className="col-12 m-lr-auto m-b-50" style={{ marginTop:"-100px" }}>
                    <div className="bor10 p-lr-40 p-t-30 p-b-40 m-l-63 m-r-40 m-lr-0-xl p-lr-15-sm">
                        <h4 className="mtext-109 cl2 p-b-30">
                            Tổng quan giỏ hàng
                        </h4>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="flex-w flex-t bor12 p-b-13">
                                <Form.Label className="size-208 stext-110 cl2">
                                    Tổng tiền:
                                </Form.Label>
                                <Form.Label className="size-209 mtext-110 cl2">
                                    {calculateTotalPrice()} VNĐ
                                </Form.Label>
                            </Form.Group>
                            <div className="row">
                                <div className="col-12">
                                <Form.Group>
                                        <Form.Label className="size-208 w-full-ssm stext-110 cl2">
                                            Tên người nhận:
                                        </Form.Label>
                                        <Form.Control
                                            className="rs1-select2 rs2-select2 bor8 bg0 m-b-12 m-t-9"
                                            type="text"
                                            name="name"
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                            placeholder="Tên người nhận hàng"
                                            required
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-6">
                                    <Form.Group>
                                        <Form.Label className="size-208 w-full-ssm stext-110 cl2">
                                            Địa chỉ giao hàng:
                                        </Form.Label>
                                        <Form.Control
                                            className="rs1-select2 rs2-select2 bor8 bg0 m-b-12 m-t-9"
                                            type="text"
                                            name="address"
                                            value={address}
                                            onChange={(e) =>
                                                setAddress(e.target.value)
                                            }
                                            placeholder="Địa chỉ giao hàng"
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label className="size-208 w-full-ssm stext-110 cl2">
                                            Phương thức thanh toán:
                                        </Form.Label>
                                        <Form.Control
                                            as="select"
                                            className="rs1-select2 rs2-select2 bor8 bg0 m-b-12 m-t-9"
                                            name="payment_method_id"
                                            value={paymentMethodId}
                                            onChange={(e) =>
                                                setPaymentMethodId(
                                                    e.target.value
                                                )
                                            }
                                            required
                                        >
                                            <option value="">
                                                Chọn phương thức thanh toán
                                            </option>
                                            {paymentMethods.map((method) => (
                                                <option
                                                    key={
                                                        method.payment_method_id
                                                    }
                                                    value={
                                                        method.payment_method_id
                                                    }
                                                >
                                                    {method.payment_method}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                </div>
                                <div className="col-6">
                                    <Form.Label className="size-208 w-full-ssm stext-110 cl2">
                                        Số điện thoại:
                                    </Form.Label>
                                    <Form.Control
                                        className="rs1-select2 rs2-select2 bor8 bg0 m-b-12 m-t-9"
                                        type="text"
                                        name="phone_number"
                                        value={phoneNumber}
                                        onChange={(e) =>
                                            setPhoneNumber(e.target.value)
                                        }
                                        placeholder="Số điện thoại"
                                        required
                                    />

                                    <Form.Label className="size-208 w-full-ssm stext-110 cl2">
                                        Phương thức vận chuyển:
                                    </Form.Label>
                                    <Form.Control
                                        as="select"
                                        className="rs1-select2 rs2-select2 bor8 bg0 m-b-12 m-t-9"
                                        name="shipping_method_id"
                                        value={shippingMethodId}
                                        onChange={(e) =>
                                            setShippingMethodId(e.target.value)
                                        }
                                        required
                                    >
                                        <option value="">
                                            Chọn phương thức vận chuyển
                                        </option>
                                        {shippingMethods.map((method) => (
                                            <option
                                                key={method.shipping_method_id}
                                                value={
                                                    method.shipping_method_id
                                                }
                                            >
                                                {method.shipping_method}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </div>
                            </div>

                            <Form.Group className="flex-w flex-t bor12 p-t-15 p-b-30">
                                <Button
                                    type="submit"
                                    className="flex-c-m stext-101 cl0 size-116 bg3 bor14 hov-btn3 p-lr-15 trans-04 pointer"
                                >
                                    Xác nhận hóa đơn
                                </Button>
                            </Form.Group>
                        </Form>
                    </div>
                </div>

                {/*  */}
            </>
            <Footer />

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowModal(false)}
                    >
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={confirmRemoveProduct}>
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
}

export default ShoppingCart;
