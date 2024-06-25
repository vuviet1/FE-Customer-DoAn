import React, { useEffect, useState, Fragment } from "react";
import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import database from "../components/database";
import Topbar from "../components/topbar";
import Footer from "../components/footer";
import request from "../../../utils/request";
import { getErrorMessage } from "../../../utils/errorMessages";

import AddVoucherModal from "./modal-add";
import EditVoucherModal from "./modal-edit";

function VoucherAdmin() {
    const [vouchers, setVouchers] = useState([]);
    const [selectedVoucherId, setSelectedVoucherId] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const fetchData = async () => {
        try {
            const response = await request.get("voucher");
            setVouchers(response.data.data);
        } catch (error) {
            let errorMessage = "Hiển thị mã giảm giá thất bại: ";
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

    useEffect(() => {
        let table;
        if (vouchers && vouchers.length > 0) {
            table = database.initializeDataTable("#dataTableHover");
        }
        return () => {
            if (table) {
                table.destroy();
            }
        };
    }, [vouchers]);

    const handleAddVoucher = () => {
        setShowAddModal(false);
        fetchData();
    };

    const handleEditButtonClick = (voucher_id) => {
        setSelectedVoucherId(voucher_id);
        setShowEditModal(true);
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
                toast.success("Xóa mã giảm giá thành công!", {
                    position: "top-right",
                });
                fetchData();
            } catch (error) {
                let errorMessage = "Xóa mã giảm giá thất bại: ";
                if (error.response && error.response.status) {
                    errorMessage += getErrorMessage(error.response.status);
                } else {
                    errorMessage += error.message;
                }
                toast.error(errorMessage, {
                    position: "top-right",
                });
                console.error("Xóa mã giảm giá thất bại:", error);
            }
        }
    };

    const VoucherTableBody = ({
        vouchers,
        handleEditButtonClick,
        deleteVoucher,
    }) => {
        if (!vouchers || vouchers.length === 0) {
            return (
                <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                        Không có dữ liệu
                    </td>
                </tr>
            );
        }

        return (
            <tbody>
                {vouchers.map((voucher, index) => (
                    <tr key={index}>
                        <td style={{ textAlign: "left" }}>
                            {voucher.voucher_id}
                        </td>
                        <td style={{ textAlign: "left" }}>{voucher.voucher}</td>
                        <td style={{ textAlign: "left" }}>
                            {voucher.quantity}
                        </td>
                        <td style={{ textAlign: "left" }}>
                            {voucher.start_day}
                        </td>
                        <td style={{ textAlign: "left" }}>{voucher.end_day}</td>
                        <td style={{ textAlign: "left" }}>
                            {voucher.status === 1 ? (
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
                                    handleEditButtonClick(voucher.voucher_id)
                                }
                                style={{ marginRight: "5px" }}
                            >
                                <i className="far fa-edit" />
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() =>
                                    deleteVoucher(voucher.voucher_id)
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
                                    Mã giảm giá
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
                                                            Mã
                                                        </th>
                                                        <th
                                                            style={{
                                                                textAlign:
                                                                    "left",
                                                            }}
                                                        >
                                                            Tên Voucher
                                                        </th>
                                                        <th
                                                            style={{
                                                                textAlign:
                                                                    "left",
                                                            }}
                                                        >
                                                            Số lượng
                                                        </th>
                                                        <th
                                                            style={{
                                                                textAlign:
                                                                    "left",
                                                            }}
                                                        >
                                                            Ngày bắt đầu
                                                        </th>
                                                        <th
                                                            style={{
                                                                textAlign:
                                                                    "left",
                                                            }}
                                                        >
                                                            Ngày kết thúc
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
                                                <VoucherTableBody
                                                    vouchers={vouchers}
                                                    handleEditButtonClick={
                                                        handleEditButtonClick
                                                    }
                                                    deleteVoucher={
                                                        deleteVoucher
                                                    }
                                                />
                                            </Table>
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
