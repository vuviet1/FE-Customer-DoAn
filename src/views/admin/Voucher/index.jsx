/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, Fragment } from "react";
import { Table, Button, Form, Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAlert } from '@utils/AlertContext';

import Topbar from "../components/topbar";
import Footer from "../components/footer";
import request from "@utils/request";

import AddVoucherModal from "./modal-add";
import EditVoucherModal from "./modal-edit";

function VoucherAdmin() {
    const [vouchers, setVouchers] = useState([]);
    const [selectedVoucherId, setSelectedVoucherId] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredVoucher, setFilteredVoucher] = useState([]);
    const [statusFilter, setStatusFilter] = useState("");
    const itemsPerPage = 5;
    const { showSuccessAlert, showErrorAlert } = useAlert();

    const fetchData = async () => {
        try {
            const response = await request.get("voucher");
            setVouchers(response.data.data);
            setFilteredVoucher(response.data.data)
        } catch (error) {
            showErrorAlert('Lỗi!', 'Hiển thị mã giảm giá thất bại');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        filterVoucher(searchTerm, statusFilter);
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    const handleEditButtonClick = (voucher_id) => {
        setSelectedVoucherId(voucher_id);
        setShowEditModal(true);
    };

    const handleAddVoucher = () => {
        setShowAddModal(false);
        fetchData();
    };

    const handleUpdateVoucher = () => {
        setSelectedVoucherId(null);
        setShowEditModal(false);
        fetchData();
    };

    const deleteVoucher = async (voucher_id) => {
        if (window.confirm("Bạn có chắc muốn xóa voucher này không?")) {
            try {
                await request.delete(`voucher/${voucher_id}`);
                showSuccessAlert('Thành công!', 'Xóa mã giảm giá thành công!');
                fetchData();
            } catch (error) {
                showErrorAlert('Lỗi!', 'Xóa mã giảm giá thất bại');
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

    // Lọc và tìm kiếm
    const filterVoucher = (query, status) => {
        let filtered = vouchers;
        if (query) {
            filtered = filtered.filter((voucher) =>
                voucher.voucher_code.toLowerCase().includes(query.toLowerCase())
            );
        }
        if (status) {
            filtered = filtered.filter((voucher) => voucher.status.toString() === status);
        }
        setFilteredVoucher(filtered);
    };

    const handleSearchTermChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
    };

    const offset = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredVoucher.slice(offset, offset + itemsPerPage);
    const totalPages = Math.ceil(filteredVoucher.length / itemsPerPage);

    const VoucherTableBody = ({ vouchers, handleEditButtonClick, deleteVoucher }) => {
        if (!vouchers || vouchers.length === 0) {
            return (
                <tbody>
                    <tr>
                        <td colSpan="7" style={{ textAlign: "center" }}>
                            Không có dữ liệu
                        </td>
                    </tr>
                </tbody>
            );
        }

        return (
            <tbody>
                {vouchers.map((voucher, index) => (
                    <tr key={index}>
                        <td style={{ textAlign: "left" }}>{voucher.voucher_code}</td>
                        <td style={{ textAlign: "left" }}>{voucher.voucher}</td>
                        <td style={{ textAlign: "left" }}>{voucher.quantity}</td>
                        <td style={{ textAlign: "left" }}>{voucher.start_day}</td>
                        <td style={{ textAlign: "left" }}>{voucher.end_day}</td>
                        <td style={{ textAlign: "left" }}>
                            {voucher.status === 1 ? (
                                <span className="badge badge-success">Sử dụng</span>
                            ) : (
                                <span className="badge badge-danger">Không sử dụng</span>
                            )}
                        </td>
                        <td style={{ textAlign: "center" }}>
                            <Button
                                variant="success"
                                onClick={() => handleEditButtonClick(voucher.voucher_id)}
                                style={{ marginRight: "5px" }}
                            >
                                <i className="far fa-edit" />
                            </Button>
                            <Button variant="danger" onClick={() => deleteVoucher(voucher.voucher_id)}>
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
                                <h1 className="h3 mb-0 text-gray-800">Mã giảm giá</h1>
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link to={"/admin-home"}>Home</Link>
                                    </li>
                                    <li className="breadcrumb-item">Danh mục quản lý</li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        Mã giảm giá
                                    </li>
                                </ol>
                            </div>

                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="card mb-4">
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h6 className="m-0 font-weight-bold text-primary">
                                                Danh sách mã giảm giá
                                            </h6>
                                            <div className="col-9">
                                                <div className="row">
                                                    <div className="col-8">
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Tìm kiếm theo mã giảm giá..."
                                                            value={searchTerm}
                                                            onChange={handleSearchTermChange}
                                                        />
                                                    </div>
                                                    <div className="col-4">
                                                    <Form.Control 
                                                            as="select"
                                                            value={statusFilter}
                                                            onChange={handleStatusFilterChange}
                                                        >
                                                            <option value="">Tất cả trạng thái</option>
                                                            <option value="1">Sử dụng</option>
                                                            <option value="0">Không sử dụng</option>
                                                        </Form.Control>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                variant="primary"
                                                onClick={() => setShowAddModal(true)}
                                            >
                                                <i className="fas fa-plus" /> Thêm mới
                                            </Button>
                                        </div>
                                        <div className="table-responsive p-3">
                                            <Table
                                                className="table align-items-center table-flush table-hover"
                                                id="dataTableHover"
                                            >
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th style={{ textAlign: "left" }}>Mã giảm giá</th>
                                                        <th style={{ textAlign: "left" }}>% giảm giá</th>
                                                        <th style={{ textAlign: "left" }}>Số lượng</th>
                                                        <th style={{ textAlign: "left" }}>Ngày bắt đầu</th>
                                                        <th style={{ textAlign: "left" }}>Ngày kết thúc</th>
                                                        <th style={{ textAlign: "left" }}>Trạng thái</th>
                                                        <th style={{ textAlign: "center" }}>Hành động</th>
                                                    </tr>
                                                </thead>
                                                <VoucherTableBody
                                                    vouchers={currentItems}
                                                    handleEditButtonClick={handleEditButtonClick}
                                                    deleteVoucher={deleteVoucher}
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
                                                    <Pagination.First onClick={handleFirstPage} />
                                                    <Pagination.Prev onClick={handlePrevPage} />
                                                    {Array.from({ length: totalPages }, (_, index) => (
                                                        <Pagination.Item
                                                            key={index + 1}
                                                            active={index + 1 === currentPage}
                                                            onClick={() => handlePageChange(index + 1)}
                                                        >
                                                            {index + 1}
                                                        </Pagination.Item>
                                                    ))}
                                                    <Pagination.Next onClick={handleNextPage} />
                                                    <Pagination.Last onClick={handleLastPage} />
                                                </Pagination>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <AddVoucherModal
                                show={showAddModal}
                                handleClose={() => setShowAddModal(false)}
                                onAddVoucher={handleAddVoucher}
                            />
                            {selectedVoucherId && (
                                <EditVoucherModal
                                    show={showEditModal}
                                    handleClose={() => setShowEditModal(false)}
                                    selectedVoucherId={selectedVoucherId}
                                    onUpdateVoucher={handleUpdateVoucher}
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

export default VoucherAdmin;
