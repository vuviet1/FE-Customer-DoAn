import React, { useEffect, useState, Fragment } from "react";
import { Table, Button, Pagination, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import Topbar from "../components/topbar";
import Footer from "../components/footer";
import request from "../../../utils/request";
import { getErrorMessage } from "../../../utils/errorMessages";

import AddPaymentModal from "./modal-add";
import EditPaymentModal from "./modal-edit";

function PaymentAdmin() {
    const [payments, setPayments] = useState([]);
    const [selectedPaymentId, setSelectedPaymentId] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const itemsPerPage = 5;

    const fetchData = async () => {
        try {
            const response = await request.get("payment");
            setPayments(response.data.data);
        } catch (error) {
            let errorMessage = "Hiển thị phương thức thanh toán thất bại: ";
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

    const handleEditButtonClick = (payment_method_id) => {
        setSelectedPaymentId(payment_method_id);
        setShowEditModal(true);
    };

    const handleAddPayment = () => {
        setShowAddModal(false);
        fetchData();
    };

    const handleUpdatePayment = () => {
        setSelectedPaymentId(null);
        setShowEditModal(false);
        fetchData();
    };

    const deletePayment = async (payment_method_id) => {
        if (
            window.confirm(
                "Bạn có chắc muốn xóa phương thức thanh toán này không?"
            )
        ) {
            try {
                await request.delete(`payment/${payment_method_id}`);
                toast.success("Xóa phương thức thanh toán thành công!", {
                    position: "top-right",
                });
                fetchData();
            } catch (error) {
                let errorMessage = "Xóa phương thức thanh toán thất bại: ";
                if (error.response && error.response.status) {
                    errorMessage += getErrorMessage(error.response.status);
                } else {
                    errorMessage += error.message;
                }
                toast.error(errorMessage, {
                    position: "top-right",
                });
                console.error("Xóa phương thức thất bại:", error);
            }
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleFirstPage = () => {
        setCurrentPage(1);
    };

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handleLastPage = () => {
        setCurrentPage(totalPages);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredPayments = payments.filter((payment) =>
        payment.payment_method.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const offset = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredPayments.slice(offset, offset + itemsPerPage);
    const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

    const PaymentTableBody = ({
        payments,
        handleEditButtonClick,
        deletePayment,
    }) => {
        if (!payments || payments.length === 0) {
            return (
                <tbody>
                    <tr>
                        <td colSpan="3" style={{ textAlign: "center" }}>
                            Không có dữ liệu
                        </td>
                    </tr>
                </tbody>
            );
        }

        return (
            <tbody>
                {payments.map((payment, index) => (
                    <tr key={index}>
                        <td style={{ textAlign: "left" }}>
                            {payment.payment_method}
                        </td>
                        <td style={{ textAlign: "left" }}>
                            {payment.status === 1 ? (
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
                                variant="success"
                                onClick={() =>
                                    handleEditButtonClick(
                                        payment.payment_method_id
                                    )
                                }
                                style={{ marginRight: "5px" }}
                            >
                                <i className="far fa-edit" />
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() =>
                                    deletePayment(payment.payment_method_id)
                                }
                            >
                                <i className="fas fa-trash" />
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
                                    Phương thức thanh toán
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
                                        Phương thức thanh toán
                                    </li>
                                </ol>
                            </div>

                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="card mb-4">
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h6 className="m-0 font-weight-bold text-primary">
                                                Phương thức thanh toán
                                            </h6>
                                            <div className="col-6">
                                                <Form.Group controlId="search">
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Tìm kiếm..."
                                                        value={searchTerm}
                                                        onChange={
                                                            handleSearchChange
                                                        }
                                                    />
                                                </Form.Group>
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
                                                            Tên phương thức
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
                                                <PaymentTableBody
                                                    payments={currentItems}
                                                    handleEditButtonClick={
                                                        handleEditButtonClick
                                                    }
                                                    deletePayment={
                                                        deletePayment
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
                                                    />
                                                    <Pagination.Prev
                                                        onClick={handlePrevPage}
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
                                                    />
                                                    <Pagination.Last
                                                        onClick={handleLastPage}
                                                    />
                                                </Pagination>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <AddPaymentModal
                                show={showAddModal}
                                handleClose={() => setShowAddModal(false)}
                                onAddPayment={handleAddPayment}
                            />
                            {selectedPaymentId && (
                                <EditPaymentModal
                                    show={showEditModal}
                                    handleClose={() => setShowEditModal(false)}
                                    selectedPaymentId={selectedPaymentId}
                                    onUpdatePayment={handleUpdatePayment}
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

export default PaymentAdmin;
