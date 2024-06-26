/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */
import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, Button, Form, Modal } from "react-bootstrap";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { toast, ToastContainer } from "react-toastify";

import Header from "./components/header";
import Sidebar from "./components/sidebar";
import Footer from "./components/footer";
import Cart from "./components/cart";
import ProductModal from "./modal-product";
import request from "../../utils/request";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState("");
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [orderToRemove, setOrderToRemove] = useState(null);
    const [showProductModal, setShowProductModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const fetchOrders = async () => {
        const access_token = localStorage.getItem("access_token");
        request.defaults.headers.common[
            "Token"
        ] = `${access_token}`;

        try {
            const response = await request.post("order/display-by-user");
            setOrders(response.data.data);
            setFilteredOrders(response.data.data);
        } catch (error) {
            toast.error("Lấy dữ liệu thất bại.", {
                position: "top-right",
            });
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = orders.filter((order) =>
            order.name.toLowerCase().includes(query)
        );
        setFilteredOrders(filtered);
        setCurrentPage(0);
    };

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
            setOrders(updatedOrders);
            setFilteredOrders(updatedOrders);
            setShowRemoveModal(false);
            toast.success("Hủy hóa đơn thành công.", {
                position: "top-right",
            });
        } catch (error) {
            toast.error("Hủy hóa đơn thất bại.", {
                position: "top-right",
            });
        }
    };

    const confirmRemoveOrder = (orderId) => {
        setOrderToRemove(orderId);
        setShowRemoveModal(true);
    };

    const handleShowProductModal = (orderId) => {
        setSelectedOrderId(orderId); // Set selected order ID
        setShowProductModal(true);
    };

    const offset = currentPage * itemsPerPage;
    const currentPageItems = filteredOrders.slice(
        offset,
        offset + itemsPerPage
    );

    return (
        <Fragment>
            <ToastContainer />
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
                                <Form.Group controlId="searchQuery">
                                    <Form.Control
                                        type="text"
                                        placeholder="Tìm kiếm hóa đơn..."
                                        value={searchQuery}
                                        onChange={handleSearch}
                                        style={{ marginBottom: "20px" }}
                                    />
                                </Form.Group>
                                <div className="wrap-table-shopping-cart">
                                    <Table responsive="sm">
                                        <thead>
                                            <tr>
                                                <th>Tên người nhận</th>
                                                <th>Số điện thoại</th>
                                                <th>Địa chỉ</th>
                                                <th>Tổng tiền</th>
                                                <th>Trạng thái đơn hàng</th>
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
                                                            <td>
                                                                {order.total}
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
                                                                {new Date(
                                                                    order.created_at
                                                                ).toLocaleString()}
                                                            </td>
                                                            <td>
                                                                <Button
                                                                    variant="info"
                                                                    onClick={() => handleShowProductModal(
                                                                        order.order_id
                                                                    )}
                                                                >
                                                                    Xem sản phẩm
                                                                </Button>
                                                                <Button
                                                                    variant="danger"
                                                                    onClick={() =>
                                                                        confirmRemoveOrder(
                                                                            order.order_id
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
                    Bạn có chắc chắn muốn xóa hóa đơn này không?
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
