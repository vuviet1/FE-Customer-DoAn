import React, { useEffect, useState, Fragment, useLayoutEffect } from "react";
import { Table, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

import $ from "jquery";
import Topbar from "../components/topbar";
import Footer from "../components/footer";
import request from "../../../utils/request";

import AddOrderModal from "./add/modal-add";
import EditOrderModal from "./edit/modal-edit";
import ViewOrderModal from "./view/modal-view";

function OrderAdmin() {
    const [orders, setOrders] = useState([]);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const token_type = localStorage.getItem("token_type");
    const access_token = localStorage.getItem("access_token");

    useEffect(() => {
        const fetchOrders = async (retryCount = 0) => {
            try {
                request.defaults.headers.common[
                    "Authorization"
                ] = `${token_type} ${access_token}`;

                const response = await request.get("order");
                console.log(response.data.data);
                setOrders(response.data.data);
            } catch (error) {
                if (
                    error.response &&
                    error.response.status === 429 &&
                    retryCount < 3
                ) {
                    setTimeout(() => fetchOrders(retryCount + 1), 2000);
                } else {
                    console.error("Error fetching data:", error);
                }
            }
        };

        fetchOrders();
    }, []);

    useLayoutEffect(() => {
        let table;
        if (orders && orders.length > 0) {
            $(document).ready(function () {
                table = $("#dataTableHover").DataTable({
                    searching: false,
                    language: {
                        lengthMenu: "Hiển thị _MENU_ mục",
                        zeroRecords: "Không tìm thấy dữ liệu",
                        info: "Hiển thị _START_ đến _END_ của _TOTAL_ mục",
                        infoEmpty: "Không có mục nào để hiển thị",
                        infoFiltered: "(lọc từ _MAX_ tổng số mục)",
                    },
                    lengthMenu: [5, 10, 25, 50],
                    pageLength: 5,
                });
            });
        }
        return () => {
            if (table) {
                table.destroy();
            }
        };
    }, [orders]);

    // Add
    const handleAddOrder = () => {
        setShowAddModal(false);
        window.location.reload();
    };

    // Update
    const handleEditButtonClick = (order_id) => {
        setSelectedOrderId(order_id);
        setShowEditModal(true);
    };

    const handleUpdateOrder = () => {
        setSelectedOrderId(null);
        setShowEditModal(false);
        window.location.reload();
    };

    // View
    const handleView = (order_id) => {
        setSelectedOrderId(order_id);
        setShowViewModal(true);
    };

    // Delete
    const deleteOrder = async (order_id) => {
        if (window.confirm("Bạn có chắc muốn xóa đơn hàng này không?")) {
            try {
                request.defaults.headers.common[
                    "Authorization"
                ] = `${token_type} ${access_token}`;

                await request.delete(`order/${order_id}`);
                window.location.reload();
            } catch (error) {
                console.error("Error deleting order:", error);
            }
        }
    };

    const OrderTableBody = ({ orders, handleEditButtonClick, deleteOrder }) => {
        if (!orders || orders.length === 0) {
            return (
                <tbody>
                    <tr>
                        <td colSpan="12" style={{ textAlign: "center" }}>
                            Không có dữ liệu
                        </td>
                    </tr>
                </tbody>
            );
        }

        return (
            <tbody>
                {orders.map((order, index) => (
                    <tr key={index}>
                        <td style={{ textAlign: "left" }}>{order.address}</td>
                        <td style={{ textAlign: "left" }}>
                            {order.phone_number}
                        </td>
                        <td style={{ textAlign: "left" }}>
                            {order.status === "0" ? (
                                <span className="badge badge-primary">
                                    Chờ duyệt
                                </span>
                            ) : order.status === "1" ? (
                                <span className="badge badge-info">
                                    Đang giao hàng
                                </span>
                            ) : order.status === "2" ? (
                                <span className="badge badge-success">
                                    Hoàn thành
                                </span>
                            ) : order.status === "3" ? (
                                <span className="badge badge-danger">
                                    Đã hủy
                                </span>
                            ) : (
                                <span className="badge badge-secondary">
                                    Không xác định
                                </span>
                            )}
                        </td>
                        <td style={{ textAlign: "left" }}>{order.total} VNĐ</td>
                        <td style={{ textAlign: "left" }}>{order.user_id}</td>
                        <td style={{ textAlign: "left" }}>
                            {order.employee_id}
                        </td>
                        <td style={{ textAlign: "center" }}>
                            <Button
                                variant="info"
                                onClick={() => handleView(order.order_id)}
                                style={{ marginRight: "5px" }}
                            >
                                <i className="far fa-eye" />
                            </Button>
                            <Button
                                variant="success"
                                onClick={() =>
                                    handleEditButtonClick(order.order_id)
                                }
                                style={{ marginRight: "5px" }}
                            >
                                <i className="far fa-edit" />
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => deleteOrder(order.order_id)}
                            >
                                <i className="fas fa-trash" />
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        );
    };

    const filteredOrders = orders.filter((order) =>
        order.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Fragment>
            <div id="wrapper">
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        <Topbar />

                        <div className="container-fluid" id="container-wrapper">
                            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                <h1 className="h3 mb-0 text-gray-800">
                                    Đơn hàng
                                </h1>
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link to={"/admin-home"}>Home</Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        Danh mục quản lý
                                    </li>
                                    <li
                                        className="breadcrumb-item active"
                                        aria-current="page"
                                    >
                                        Đơn hàng
                                    </li>
                                </ol>
                            </div>

                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="card mb-4">
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h6 className="m-0 font-weight-bold text-primary">
                                                Đơn hàng
                                            </h6>
                                            <div className="col-6">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Tìm kiếm địa chỉ..."
                                                    value={searchTerm}
                                                    onChange={(e) =>
                                                        setSearchTerm(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>

                                            <Button
                                                variant="primary"
                                                onClick={() =>
                                                    setShowAddModal(true)
                                                }
                                            >
                                                <i className="fas fa-plus" />{" "}
                                                Thêm mới
                                            </Button>
                                        </div>
                                        <div className="table-responsive p-3">
                                            <Table
                                                className="table align-items-center table-flush table-hover"
                                                id="dataTableHover"
                                            >
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th
                                                            style={{
                                                                textAlign:
                                                                    "left",
                                                            }}
                                                        >
                                                            Địa chỉ
                                                        </th>
                                                        <th
                                                            style={{
                                                                textAlign:
                                                                    "left",
                                                            }}
                                                        >
                                                            Số điện thoại
                                                        </th>
                                                        <th
                                                            style={{
                                                                textAlign:
                                                                    "left",
                                                            }}
                                                        >
                                                            Trạng thái đơn hàng
                                                        </th>
                                                        <th
                                                            style={{
                                                                textAlign:
                                                                    "left",
                                                            }}
                                                        >
                                                            Tổng tiền
                                                        </th>
                                                        <th
                                                            style={{
                                                                textAlign:
                                                                    "left",
                                                            }}
                                                        >
                                                            ID người dùng
                                                        </th>
                                                        <th
                                                            style={{
                                                                textAlign:
                                                                    "left",
                                                            }}
                                                        >
                                                            ID nhân viên
                                                        </th>
                                                        <th
                                                            style={{
                                                                textAlign:
                                                                    "center",
                                                            }}
                                                        >
                                                            Hành động
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <OrderTableBody
                                                    orders={filteredOrders}
                                                    handleEditButtonClick={
                                                        handleEditButtonClick
                                                    }
                                                    deleteOrder={deleteOrder}
                                                />
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <AddOrderModal
                                show={showAddModal}
                                handleClose={() => setShowAddModal(false)}
                                onAddOrder={handleAddOrder}
                            />
                            {selectedOrderId && (
                                <EditOrderModal
                                    show={showEditModal}
                                    handleClose={() => setShowEditModal(false)}
                                    selectedOrderId={selectedOrderId}
                                    onUpdateOrder={handleUpdateOrder}
                                />
                            )}
                            {selectedOrderId && (
                                <ViewOrderModal
                                    show={showViewModal}
                                    handleClose={() => setShowViewModal(false)}
                                    selectedOrderId={selectedOrderId}
                                    onViewOrder={handleView}
                                />
                            )}
                        </div>
                        <Footer />
                    </div>
                </div>
                <a
                    href="#page-top"
                    className="scroll-to-top rounded"
                    onClick={(e) => {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                >
                    <i className="fas fa-angle-up" />
                </a>
            </div>
        </Fragment>
    );
}

export default OrderAdmin;
