/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, Fragment } from "react";
import { Table, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import Topbar from "../components/topbar";
import Footer from "../components/footer";
import request from "../../../utils/request";
import { getErrorMessage } from "../../../utils/errorMessages";

import AddOrderModal from "./add/modal-add";
import StatusOrderModal from "./edit/modal-edit";
import ViewOrderModal from "./view/modal-view";

function OrderAdmin() {
    const [orders, setOrders] = useState([]);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const token_type = localStorage.getItem("token_type");
    const access_token = localStorage.getItem("access_token");

    const fetchData = async () => {
        try {
            request.defaults.headers.common["Authorization"] = `${token_type} ${access_token}`;
            const response = await request.get("order");
            setOrders(response.data.data);
        } catch (error) {
            let errorMessage = "Hiển thị hóa đơn thất bại: ";
            if (error.response && error.response.status) {
                errorMessage += getErrorMessage(error.response.status);
            } else {
                errorMessage += error.message;
            }
            toast.error(errorMessage, { position: "top-right" });
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddOrder = () => {
        setShowAddModal(false);
        fetchData();
    };

    const handleStatusButtonClick = (order_id) => {
        setSelectedOrderId(order_id);
        setShowStatusModal(true);
    };

    const handleUpdateStatus = () => {
        setSelectedOrderId(null);
        setShowStatusModal(false);
        fetchData();
    };

    const handleView = (order_id) => {
        setSelectedOrderId(order_id);
        setShowViewModal(true);
    };

    const deleteOrder = async (order_id) => {
        if (window.confirm("Bạn có chắc muốn xóa đơn hàng này không?")) {
            try {
                request.defaults.headers.common["Authorization"] = `${token_type} ${access_token}`;
                await request.post(`order/${order_id}?_method=PUT`, { status: 0 });
                toast.success("Hủy hóa đơn thành công!", { position: "top-right" });
                fetchData();
            } catch (error) {
                let errorMessage = "Hủy hóa đơn thất bại: ";
                if (error.response && error.response.status) {
                    errorMessage += getErrorMessage(error.response.status);
                } else {
                    errorMessage += error.message;
                }
                toast.error(errorMessage, { position: "top-right" });
                console.error("Xóa hóa đơn thất bại:", error);
            }
        }
    };

    const OrderTableBody = ({ orders, deleteOrder }) => {
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
                        <td style={{ textAlign: "left" }}>{order.name}</td>
                        <td style={{ textAlign: "left" }}>{order.address}</td>
                        <td style={{ textAlign: "left" }}>{order.phone_number}</td>
                        <td style={{ textAlign: "left" }}>
                            {order.status === 0 ? (
                                <Button variant="danger" onClick={() => handleStatusButtonClick(order.order_id)}>
                                    Đã hủy
                                </Button>
                            ) : order.status === 1 ? (
                                <Button variant="warning" onClick={() => handleStatusButtonClick(order.order_id)}>
                                    Chờ duyệt
                                </Button>
                            ) : order.status === 2 ? (
                                <Button variant="primary" onClick={() => handleStatusButtonClick(order.order_id)}>
                                    Chờ lấy hàng
                                </Button>
                            ) : order.status === 3 ? (
                                <Button variant="info" onClick={() => handleStatusButtonClick(order.order_id)}>
                                    Đang giao hàng
                                </Button>
                            ) : order.status === 4 ? (
                                <Button variant="success" onClick={() => handleStatusButtonClick(order.order_id)}>
                                    Hoàn thành
                                </Button>
                            ) : (
                                <Button variant="secondary" onClick={() => handleStatusButtonClick(order.order_id)}>
                                    Không xác định
                                </Button>
                            )}
                        </td>
                        <td style={{ textAlign: "left" }}>{order.total} VNĐ</td>
                        <td style={{ textAlign: "center" }}>
                            <Button variant="info" onClick={() => handleView(order.order_id)} style={{ marginRight: "5px" }}>
                                <i className="far fa-eye" />
                            </Button>
                            <Button variant="danger" onClick={() => deleteOrder(order.order_id)}>
                                <i className="fas fa-trash" />
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        );
    };

    const filteredOrders = orders.filter((order) => order.address.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <Fragment>
            <div id="wrapper">
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        <Topbar />
                        <div className="container-fluid" id="container-wrapper">
                            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                <h1 className="h3 mb-0 text-gray-800">Đơn hàng</h1>
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link to={"/admin-home"}>Home</Link>
                                    </li>
                                    <li className="breadcrumb-item">Danh mục quản lý</li>
                                    <li className="breadcrumb-item active" aria-current="page">Đơn hàng</li>
                                </ol>
                            </div>

                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="card mb-4">
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h6 className="m-0 font-weight-bold text-primary">Đơn hàng</h6>
                                            <div className="col-6">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Tìm kiếm địa chỉ..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                />
                                            </div>
                                            <Button variant="primary" onClick={() => setShowAddModal(true)}>
                                                <i className="fas fa-plus" /> Thêm mới
                                            </Button>
                                        </div>
                                        <div className="table-responsive p-3">
                                            <Table className="table align-items-center table-flush table-hover" id="dataTableHover">
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th style={{ textAlign: "left" }}>Tên khách hàng</th>
                                                        <th style={{ textAlign: "left" }}>Địa chỉ</th>
                                                        <th style={{ textAlign: "left" }}>Số điện thoại</th>
                                                        <th style={{ textAlign: "left" }}>Trạng thái đơn hàng</th>
                                                        <th style={{ textAlign: "left" }}>Tổng tiền</th>
                                                        <th style={{ textAlign: "center" }}>Hành động</th>
                                                    </tr>
                                                </thead>
                                                <OrderTableBody orders={filteredOrders} deleteOrder={deleteOrder} />
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <AddOrderModal show={showAddModal} handleClose={() => setShowAddModal(false)} onAddOrder={handleAddOrder} />
                            {selectedOrderId && (
                                <StatusOrderModal
                                    show={showStatusModal}
                                    handleClose={() => setShowStatusModal(false)}
                                    selectedOrderId={selectedOrderId}
                                    onUpdateStatus={handleUpdateStatus}
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
