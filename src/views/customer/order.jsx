/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */
import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, Button, Form, Modal } from "react-bootstrap";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import ReactPaginate from "react-paginate";

import Header from "./components/header";
import Sidebar from "./components/sidebar";
import Footer from "./components/footer";
import Cart from "./components/cart";
import request from "../../utils/request";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(5); // Number of items per page
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [orderToRemove, setOrderToRemove] = useState(null);

    useEffect(() => {
        const fetchOrders = async (retryCount = 0) => {
            const token_type = localStorage.getItem("token_type");
            const access_token = localStorage.getItem("access_token");
            request.defaults.headers.common[
                "Authorization"
            ] = `${token_type} ${access_token}`;

            try {
                const response = await request.get("order");
                setOrders(response.data.data);
                setFilteredOrders(response.data.data);
            } catch (error) {
                if (error.response && error.response.status === 429 && retryCount < 3) {
                    setTimeout(() => fetchOrders(retryCount + 1), 2000);
                } else {
                    console.error("Error fetching data:", error);
                }
            }
        };

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
            await request.delete(`/order/${orderId}`);
            const updatedOrders = orders.filter((order) => order.id !== orderId);
            setOrders(updatedOrders);
            setFilteredOrders(updatedOrders);
            setShowModal(false);
        } catch (error) {
            console.error("Error removing order:", error);
        }
    };

    const confirmRemoveOrder = (orderId) => {
        setOrderToRemove(orderId);
        setShowModal(true);
    };

    const offset = currentPage * itemsPerPage;
    const currentPageItems = filteredOrders.slice(offset, offset + itemsPerPage);

    return (
        <Fragment>
            <Header />
            <Sidebar />
            <Cart />
            {/* Content */}
            <>
                <section
                    className="bg-img1 txt-center p-lr-15 p-tb-92"
                    style={{
                        backgroundImage: 'url("assets/customer/images/bg-01.jpg")',
                    }}
                >
                    <h2 className="ltext-105 cl0 txt-center">HÓA ĐƠN</h2>
                </section>
                {/* breadcrumb */}
                <div className="container">
                    <div className="bread-crumb flex-w p-l-25 p-r-15 p-t-30 p-lr-0-lg">
                        <Link to={"/"} className="stext-109 cl8 hov-cl1 trans-04">
                            Trang chủ
                            <i className="fa fa-angle-right m-l-9 m-r-10" aria-hidden="true" />
                        </Link>
                        <span className="stext-109 cl4">Hóa đơn</span>
                    </div>
                </div>
                {/* Orders */}
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
                                                    currentPageItems.map((order) => (
                                                        <tr key={order.id}>
                                                            <td>{order.name}</td>
                                                            <td>{order.phone_number}</td>
                                                            <td>{order.address}</td>
                                                            <td>{order.total}</td>
                                                            <td>
                                                                {order.status === "0" ? (
                                                                    <span className="badge badge-primary">Chờ duyệt</span>
                                                                ) : order.status === "1" ? (
                                                                    <span className="badge badge-info">Đang giao hàng</span>
                                                                ) : order.status === "2" ? (
                                                                    <span className="badge badge-success">Hoàn thành</span>
                                                                ) : order.status === "3" ? (
                                                                    <span className="badge badge-danger">Đã hủy</span>
                                                                ) : (
                                                                    <span className="badge badge-secondary">Không xác định</span>
                                                                )}
                                                            </td>
                                                            <td>{new Date(order.created_at).toLocaleString()}</td>
                                                            <td>
                                                                <Button
                                                                    variant="danger"
                                                                    onClick={() => confirmRemoveOrder(order.id)}
                                                                >
                                                                    Xóa
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="6" className="text-center">
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
                                            pageCount={Math.ceil(filteredOrders.length / itemsPerPage)}
                                            marginPagesDisplayed={2}
                                            pageRangeDisplayed={5}
                                            onPageChange={handlePageClick}
                                            containerClassName={"pagination"}
                                            subContainerClassName={"pages pagination"}
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
            </>
            <Footer />

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc chắn muốn xóa hóa đơn này không?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={() => handleRemoveOrder(orderToRemove)}>
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
}

export default Orders;
