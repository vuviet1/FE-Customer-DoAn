/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, Fragment } from "react";
import { Table, Button, Form, Image, Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import Topbar from "../components/topbar";
import Footer from "../components/footer";
import request from "../../../utils/request";
import { getErrorMessage } from "../../../utils/errorMessages";

import EditCustomerModal from "./modal-edit";
import ViewCustomerModal from "./modal-view";

function CustomerAdmin() {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 5;

    const fetchData = async () => {
        try {
            const response = await request.get("user");
            const allUsers = response.data.data;
            const customerUsers = allUsers.filter((user) => user.role === 0);
            setCustomers(customerUsers);
            setTotalPages(Math.ceil(customerUsers.length / itemsPerPage));
        } catch (error) {
            let errorMessage = "Hiển thị khách hàng thất bại: ";
            if (error.response && error.response.status) {
                errorMessage += getErrorMessage(error.response.status);
            } else {
                errorMessage += error.message;
            }
            toast.error(errorMessage, {
                position: "top-right",
            });
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEditButtonClick = (user_id) => {
        setSelectedCustomerId(user_id);
        setShowEditModal(true);
    };

    const handleUpdateCustomer = () => {
        setSelectedCustomerId(null);
        setShowEditModal(false);
        fetchData();
    };

    const handleView = (user_id) => {
        setSelectedCustomerId(user_id);
        setShowViewModal(true);
    };

    const handleDeleteCustomer = async (user_id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) {
            try {
                await request.delete(`user/${user_id}`);
                toast.success("Xóa khách hàng thành công!", {
                    position: "top-right",
                });
                fetchData();
            } catch (error) {
                let errorMessage = "Xóa khách hàng thất bại: ";
                if (error.response && error.response.status) {
                    errorMessage += getErrorMessage(error.response.status);
                } else {
                    errorMessage += error.message;
                }
                toast.error(errorMessage, {
                    position: "top-right",
                });
                console.error("Error deleting customer:", error);
            }
        }
    };

    const filteredCustomers = customers.filter((customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleFirstPage = () => {
        setCurrentPage(1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleLastPage = () => {
        setCurrentPage(totalPages);
    };

    const paginatedCustomers = filteredCustomers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const CustomerTableBody = ({ customers, handleEditButtonClick }) => {
        if (!customers || customers.length === 0) {
            return (
                <tbody>
                    <tr>
                        <td colSpan="5" style={{ textAlign: "center" }}>
                            Không có dữ liệu
                        </td>
                    </tr>
                </tbody>
            );
        }

        return (
            <tbody>
                {customers.map((customer, index) => (
                    <tr key={index}>
                        <td style={{ textAlign: "left" }}>{customer.name}</td>
                        <td style={{ textAlign: "left" }}>
                            <Image
                                src={
                                    "http://127.0.0.1:8000/uploads/avatar/" +
                                    customer.avatar
                                }
                                alt={customer.name}
                                style={{ width: "100px", height: "100px" }}
                                thumbnail="true"
                            />
                        </td>
                        <td style={{ textAlign: "left" }}>{customer.email}</td>
                        <td style={{ textAlign: "left" }}>
                            {customer.status === 1 ? (
                                <span className="badge badge-success">
                                    Sử dụng
                                </span>
                            ) : (
                                <span className="badge badge-danger">
                                    Không sử dụng
                                </span>
                            )}
                        </td>
                        <td style={{ textAlign: "center" }}>
                            <Button
                                variant="info"
                                onClick={() => handleView(customer.user_id)}
                                style={{ marginRight: "5px" }}
                            >
                                <i className="far fa-eye" />
                            </Button>
                            <Button
                                variant="success"
                                onClick={() =>
                                    handleEditButtonClick(customer.user_id)
                                }
                                style={{ marginRight: "5px" }}
                            >
                                <i className="far fa-edit" />
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() =>
                                    handleDeleteCustomer(customer.user_id)
                                }
                            >
                                <i className="far fa-trash-alt" />
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        );
    };

    return (
        <Fragment>
            <div id="wrapper">
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        <Topbar />

                        <div className="container-fluid" id="container-wrapper">
                            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                <h1 className="h3 mb-0 text-gray-800">
                                    Quản trị khách hàng
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
                                        Quản trị khách hàng
                                    </li>
                                </ol>
                            </div>

                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="card mb-4">
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h6 className="m-0 font-weight-bold text-primary">
                                                Quản trị khách hàng
                                            </h6>
                                            <div className="col-6">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Tìm kiếm khách hàng..."
                                                    value={searchTerm}
                                                    onChange={(e) =>
                                                        setSearchTerm(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="col-1"></div>
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
                                                            Tên khách hàng
                                                        </th>
                                                        <th
                                                            style={{
                                                                textAlign:
                                                                    "left",
                                                            }}
                                                        >
                                                            Ảnh đại diện
                                                        </th>
                                                        <th
                                                            style={{
                                                                textAlign:
                                                                    "left",
                                                            }}
                                                        >
                                                            Email
                                                        </th>
                                                        <th
                                                            style={{
                                                                textAlign:
                                                                    "left",
                                                            }}
                                                        >
                                                            Trạng thái
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
                                                <CustomerTableBody
                                                    customers={
                                                        paginatedCustomers
                                                    }
                                                    handleEditButtonClick={
                                                        handleEditButtonClick
                                                    }
                                                    handleDeleteCustomer={
                                                        handleDeleteCustomer
                                                    }
                                                />
                                            </Table>
                                            <div
                                                className="flex-c-m flex-w w-full p-t-45"
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <Pagination>
                                                    <Pagination.First
                                                        onClick={
                                                            handleFirstPage
                                                        }
                                                        disabled={
                                                            currentPage === 1
                                                        }
                                                    />
                                                    <Pagination.Prev
                                                        onClick={handlePrevPage}
                                                        disabled={
                                                            currentPage === 1
                                                        }
                                                    />
                                                    {Array.from(
                                                        { length: totalPages },
                                                        (_, index) => (
                                                            <Pagination.Item
                                                                key={index + 1}
                                                                active={
                                                                    index +
                                                                        1 ===
                                                                    currentPage
                                                                }
                                                                onClick={() =>
                                                                    handlePageChange(
                                                                        index +
                                                                            1
                                                                    )
                                                                }
                                                            >
                                                                {index + 1}
                                                            </Pagination.Item>
                                                        )
                                                    )}
                                                    <Pagination.Next
                                                        onClick={handleNextPage}
                                                        disabled={
                                                            currentPage ===
                                                            totalPages
                                                        }
                                                    />
                                                    <Pagination.Last
                                                        onClick={handleLastPage}
                                                        disabled={
                                                            currentPage ===
                                                            totalPages
                                                        }
                                                    />
                                                </Pagination>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {selectedCustomerId && (
                                <EditCustomerModal
                                    show={showEditModal}
                                    handleClose={() => setShowEditModal(false)}
                                    selectedCustomerId={selectedCustomerId}
                                    onUpdateCustomer={handleUpdateCustomer}
                                />
                            )}
                            {selectedCustomerId && (
                                <ViewCustomerModal
                                    show={showViewModal}
                                    handleClose={() => setShowViewModal(false)}
                                    selectedCustomerId={selectedCustomerId}
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

export default CustomerAdmin;
