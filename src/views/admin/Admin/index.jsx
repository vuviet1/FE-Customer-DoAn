/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, Fragment } from "react";
import { Table, Button, Form, Image, Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import Topbar from "../components/topbar";
import Footer from "../components/footer";
import request from "../../../utils/request";
import { getErrorMessage } from "../../../utils/errorMessages";

import AddAdminModal from "./modal-add";
import EditAdminModal from "./modal-edit";
import ViewAdminModal from "./modal-view";

function AdminAdmin() {
    const [admins, setAdmins] = useState([]);
    const [selectedAdminId, setSelectedAdminId] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const itemsPerPage = 5;

    const fetchData = async () => {
        try {
            const response = await request.get("user");
            const allAdmins = response.data.data;
            const adminUsers = allAdmins.filter((admin) => admin.role === 1);
            setAdmins(adminUsers);
        } catch (error) {
            let errorMessage = "Hiển thị nhân viên thất bại: ";
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
        setSelectedAdminId(user_id);
        setShowEditModal(true);
    };

    const handleAddAdmin = () => {
        setShowAddModal(false);
        fetchData();
    };

    const handleUpdateAdmin = () => {
        setShowEditModal(false);
        fetchData();
    };

    const handleViewAdmin = (user_id) => {
        setSelectedAdminId(user_id);
        setShowViewModal(true);
    };

    const deleteAdmin = async (user_id) => {
        if (window.confirm("Bạn có chắc muốn xóa quản trị viên này không?")) {
            try {
                await request.delete(`user/${user_id}`);
                toast.success("Xóa quản trị viên thành công!", {
                    position: "top-right",
                });
                fetchData();
            } catch (error) {
                let errorMessage = "Xóa quản trị viên thất bại: ";
                if (error.response && error.response.status) {
                    errorMessage += getErrorMessage(error.response.status);
                } else {
                    errorMessage += error.message;
                }
                toast.error(errorMessage, {
                    position: "top-right",
                });
                console.error("Error deleting admin:", error);
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

    const filteredAdmins = admins.filter((admin) =>
        admin.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const offset = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredAdmins.slice(offset, offset + itemsPerPage);
    const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);

    const AdminTableBody = ({ admins, handleEditButtonClick, deleteAdmin }) => {
        if (!admins || admins.length === 0) {
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
                {admins.map((admin, index) => (
                    <tr key={index}>
                        <td style={{ textAlign: "left" }}>{admin.name}</td>
                        <td style={{ textAlign: "left" }}>
                            <Image
                                src={
                                    "http://127.0.0.1:8000/uploads/avatar/" +
                                    admin.avatar
                                }
                                alt={admin.name}
                                style={{ width: "100px", height: "100px" }}
                                thumbnail="true"
                            />
                        </td>
                        <td style={{ textAlign: "left" }}>{admin.email}</td>
                        <td style={{ textAlign: "left" }}>
                            {admin.status === 1 ? (
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
                                onClick={() => handleViewAdmin(admin.user_id)}
                                style={{ marginRight: "5px" }}
                            >
                                <i className="far fa-eye" />
                            </Button>
                            <Button
                                variant="success"
                                onClick={() =>
                                    handleEditButtonClick(admin.user_id)
                                }
                                style={{ marginRight: "5px" }}
                            >
                                <i className="far fa-edit" />
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => deleteAdmin(admin.user_id)}
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
                                    Quản trị viên
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
                                        Quản trị viên
                                    </li>
                                </ol>
                            </div>

                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="card mb-4">
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h6 className="m-0 font-weight-bold text-primary">
                                                Quản trị viên
                                            </h6>
                                            <div className="col-6">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Tìm kiếm quản trị viên..."
                                                    value={searchTerm}
                                                    onChange={handleSearchChange}
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
                                                            Tên quản trị viên
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
                                                <AdminTableBody
                                                    admins={currentItems}
                                                    handleEditButtonClick={
                                                        handleEditButtonClick
                                                    }
                                                    deleteAdmin={deleteAdmin}
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
                                                        {
                                                            length: totalPages,
                                                        },
                                                        (_, index) => (
                                                            <Pagination.Item
                                                                key={index + 1}
                                                                active={
                                                                    index + 1 ===
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

                            <AddAdminModal
                                show={showAddModal}
                                handleClose={() => setShowAddModal(false)}
                                onAddAdmin={handleAddAdmin}
                            />
                            {selectedAdminId && (
                                <EditAdminModal
                                    show={showEditModal}
                                    handleClose={() =>
                                        setShowEditModal(false)
                                    }
                                    selectedAdminId={selectedAdminId}
                                    onUpdateAdmin={handleUpdateAdmin}
                                />
                            )}
                            {selectedAdminId && (
                                <ViewAdminModal
                                    show={showViewModal}
                                    handleClose={() =>
                                        setShowViewModal(false)
                                    }
                                    selectedAdminId={selectedAdminId}
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

export default AdminAdmin;
