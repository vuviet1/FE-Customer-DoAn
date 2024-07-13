/* eslint-disable no-mixed-operators */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */
import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, Button, Form, Modal } from "react-bootstrap";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { useAlert } from "@utils/AlertContext";

import Header from "./components/header";
import Sidebar from "./components/sidebar";
import Footer from "./components/footer";
import Cart from "./components/cart";
import ProductModal from "./modal-product";
import request from "@utils/request";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState(""); //
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [orderToRemove, setOrderToRemove] = useState(null);
    const [showProductModal, setShowProductModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const { showSuccessAlert, showErrorAlert, showWarningAlert } = useAlert();

    const fetchOrders = async () => {
        const access_token = localStorage.getItem("access_token");
        request.defaults.headers.common["Token"] = `${access_token}`;

        try {
            const response = await request.post("order/display-by-user");
            setOrders(response.data.data);
            setFilteredOrders(response.data.data);
        } catch (error) {
            if (!access_token) {
                showErrorAlert(
                    "Chưa đăng nhập!",
                    "Hãy đăng nhập để sử dụng chức năng."
                );
            } else {
                showErrorAlert("Lỗi!", "Lấy dữ liệu thất bại.");
            }
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    // Lọc và tìm kiếm
    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = orders.filter((order) =>
            order.name.toLowerCase().includes(query)
        );
        setFilteredOrders(filtered);
        setCurrentPage(0);
    };

    const handleStatusFilterChange = (event) => {
        const status = event.target.value;
        setStatusFilter(status);
        filterOrders(searchQuery, status);
        setCurrentPage(0);
    };

    const filterOrders = (query, status) => {
        let filtered = orders;
        if (query) {
            filtered = filtered.filter((order) =>
                order.name.toLowerCase().includes(query)
            );
        }
        if (status) {
            filtered = filtered.filter(
                (order) => order.status.toString() === status
            );
        }
        setFilteredOrders(filtered);
    };

    // Hủy hóa đơn
    const handleRemoveOrder = async (orderId) => {
        const token_type = localStorage.getItem("token_type");
        const access_token = localStorage.getItem("access_token");
        request.defaults.headers.common[
            "Authorization"
        ] = `${token_type} ${access_token}`;
        try {
            await request.post(`/order/${orderId}?_method=PUT`, { status: 0 });
            const updatedOrders = orders.filter(
                (order) => order.id !== orderId
            );
            fetchOrders();
            setOrders(updatedOrders);
            setFilteredOrders(updatedOrders);
            setShowRemoveModal(false);
            showSuccessAlert("Thành công!", "Hủy hóa đơn thành công!");
        } catch (error) {
            showErrorAlert("Lỗi!", "Hủy hóa đơn thất bại");
        }
    };

    const confirmRemoveOrder = (orderId) => {
        setOrderToRemove(orderId);
        setShowRemoveModal(true);
    };

    const handleShowProductModal = (orderId) => {
        setSelectedOrderId(orderId);
        setShowProductModal(true);
    };

    // Chuyển hướng đến trang thanh toán
    const handlePayment = async (orderId) => {
        try {
            const response = await request.post(`/payment_status/${orderId}`);
            const paymentURL = response.data;
            if (paymentURL) {
                showWarningAlert(
                    "Điều hướng!",
                    "Chuyển hướng đến trang thanh toán hóa đơn"
                );
                window.location.href = paymentURL;
            } else {
                showErrorAlert(
                    "Lỗi!",
                    "Không nhận được URL của trang thanh toán"
                );
            }
        } catch (error) {
            showErrorAlert("Lỗi!", "Điều hướng thất bại");
        }
    };

    const offset = currentPage * itemsPerPage;
    const currentPageItems = filteredOrders.slice(
        offset,
        offset + itemsPerPage
    );

    const getStatusCounts = (orders) => {
        const statusCounts = orders.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        }, {});

        return statusCounts;
    };

    const statusCounts = getStatusCounts(orders);

    return (
        <Fragment>
            <Header />
            <Sidebar />
            <Cart />
            <section
                className="bg-img1 txt-center p-lr-15 p-tb-92"
                style={{
                    backgroundImage: 'url("assets/customer/images/bg-01.jpg")',
                }}
            >
                <h2 className="ltext-105 cl0 txt-center">HÓA ĐƠN</h2>
            </section>
            <div className="container">
                <div className="bread-crumb flex-w p-l-25 p-r-15 p-t-30 p-lr-0-lg">
                    <Link to={"/"} className="stext-109 cl8 hov-cl1 trans-04">
                        Trang chủ
                        <i
                            className="fa fa-angle-right m-l-9 m-r-10"
                            aria-hidden="true"
                        />
                    </Link>
                    <span className="stext-109 cl4">Hóa đơn</span>
                </div>
            </div>
            <div className="bg0 p-t-75 p-b-85">
                <div className="container">
                    <div className="row">
                        <div className="col-12 m-lr-auto m-b-50">
                            <div className="m-l-25 m-r--38 m-lr-0-xl">
                                <div className="row">
                                    <div className="col-8">
                                        <Form.Group controlId="searchQuery">
                                            <Form.Label>Tìm kiếm</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Tìm kiếm hóa đơn theo tên người nhận..."
                                                value={searchQuery}
                                                onChange={handleSearch}
                                                style={{ marginBottom: "20px" }}
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="col-4">
                                        <Form.Group controlId="statusFilter">
                                            <Form.Label>
                                                Lọc trạng thái đơn hàng
                                            </Form.Label>
                                            <Form.Control
                                                as="select"
                                                value={statusFilter}
                                                onChange={
                                                    handleStatusFilterChange
                                                }
                                                style={{ marginBottom: "20px" }}
                                            >
                                                <option value="">
                                                    Tất cả trạng thái
                                                </option>
                                                <option value="1">
                                                    Chờ duyệt(
                                                    {statusCounts[1] || 0})
                                                </option>
                                                <option value="2">
                                                    Đã duyệt(
                                                    {statusCounts[2] || 0})
                                                </option>
                                                <option value="3">
                                                    Đang giao hàng(
                                                    {statusCounts[3] || 0})
                                                </option>
                                                <option value="4">
                                                    Hoàn thành(
                                                    {statusCounts[4] || 0})
                                                </option>
                                                <option value="0">
                                                    Đã hủy(
                                                    {statusCounts[0] || 0})
                                                </option>
                                            </Form.Control>
                                        </Form.Group>
                                    </div>
                                </div>
                                <div className="wrap-table-shopping-cart">
                                    <Table responsive="sm">
                                        <thead>
                                            <tr>
                                                <th>Tên người nhận</th>
                                                <th>Số điện thoại</th>
                                                <th>Địa chỉ</th>
                                                <th>Tổng tiền</th>
                                                <th>Trạng thái đơn hàng</th>
                                                <th>Trạng thái thanh toán</th>
                                                <th>Thời gian tạo</th>
                                                <th>Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentPageItems.length > 0 ? (
                                                currentPageItems.map(
                                                    (order) => (
                                                        <tr key={order.id}>
                                                            <td>
                                                                {order.name}
                                                            </td>
                                                            <td>
                                                                {
                                                                    order.phone_number
                                                                }
                                                            </td>
                                                            <td>
                                                                {order.address}
                                                            </td>
                                                            <td
                                                                style={{
                                                                    color: "red",
                                                                }}
                                                            >
                                                                {Number(
                                                                    order.total
                                                                ).toLocaleString(
                                                                    "vi-VN",
                                                                    {
                                                                        style: "currency",
                                                                        currency:
                                                                            "VND",
                                                                    }
                                                                )}
                                                            </td>
                                                            <td>
                                                                {order.status ===
                                                                0 ? (
                                                                    <span className="badge badge-danger">
                                                                        Đã hủy
                                                                    </span>
                                                                ) : order.status ===
                                                                  1 ? (
                                                                    <span className="badge badge-warning">
                                                                        Chờ
                                                                        duyệt
                                                                    </span>
                                                                ) : order.status ===
                                                                  2 ? (
                                                                    <span className="badge badge-primary">
                                                                        Chờ lấy
                                                                        hàng
                                                                    </span>
                                                                ) : order.status ===
                                                                  3 ? (
                                                                    <span className="badge badge-info">
                                                                        Đang
                                                                        giao
                                                                        hàng
                                                                    </span>
                                                                ) : order.status ===
                                                                  4 ? (
                                                                    <span className="badge badge-success">
                                                                        Hoàn
                                                                        thành
                                                                    </span>
                                                                ) : (
                                                                    <span className="badge badge-secondary">
                                                                        Không
                                                                        xác định
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td>
                                                                {order.payment_status ===
                                                                1 ? (
                                                                    <span className="badge badge-success">
                                                                        Đã thanh
                                                                        toán
                                                                    </span>
                                                                ) : order.payment_status ===
                                                                  0 ? (
                                                                    <span className="badge badge-warning">
                                                                        Chưa
                                                                        thanh
                                                                        toán
                                                                    </span>
                                                                ) : (
                                                                    <span className="badge badge-danger">
                                                                        Không
                                                                        xác định
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td>
                                                                {new Date(
                                                                    order.created_at
                                                                ).toLocaleString()}
                                                            </td>
                                                            <td>
                                                                {order.payment
                                                                    .payment_method !==
                                                                    "COD" &&
                                                                    order.payment_status !==
                                                                        1 && (
                                                                        <Button
                                                                            variant="success"
                                                                            onClick={() =>
                                                                                handlePayment(
                                                                                    order.order_id
                                                                                )
                                                                            }
                                                                            style={{
                                                                                marginRight:
                                                                                    "5px",
                                                                            }}
                                                                        >
                                                                            Thanh
                                                                            toán
                                                                        </Button>
                                                                    )}
                                                                <Button
                                                                    variant="info"
                                                                    onClick={() =>
                                                                        handleShowProductModal(
                                                                            order.order_id
                                                                        )
                                                                    }
                                                                    style={{
                                                                        marginRight:
                                                                            "5px",
                                                                    }}
                                                                >
                                                                    Chi tiết
                                                                </Button>
                                                                {order.status ===
                                                                    1 &&
                                                                    order.payment_status ===
                                                                        0 && (
                                                                        <Button
                                                                            variant="danger"
                                                                            onClick={() =>
                                                                                confirmRemoveOrder(
                                                                                    order.order_id
                                                                                )
                                                                            }
                                                                        >
                                                                            Hủy
                                                                        </Button>
                                                                    )}
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
                                                        Không có hóa đơn nào
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                                <div className="d-flex justify-content-center">
                                    <ReactPaginate
                                        previousLabel={<FaAngleDoubleLeft />}
                                        nextLabel={<FaAngleDoubleRight />}
                                        breakLabel={"..."}
                                        breakClassName={"break-me"}
                                        pageCount={Math.ceil(
                                            filteredOrders.length / itemsPerPage
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
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                show={showRemoveModal}
                onHide={() => setShowRemoveModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa hóa đơn</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc chắn muốn hủy bỏ hóa đơn này không?
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowRemoveModal(false)}
                    >
                        Hủy
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => handleRemoveOrder(orderToRemove)}
                    >
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal hiển thị sản phẩm */}
            <ProductModal
                show={showProductModal}
                handleClose={() => setShowProductModal(false)}
                selectedOrderId={selectedOrderId}
            />

            <Footer />
        </Fragment>
    );
}

export default Orders;
