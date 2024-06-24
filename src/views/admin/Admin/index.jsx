/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, Fragment, useLayoutEffect } from "react";
import { Table, Button, Form, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

import $ from "jquery";
import Topbar from "../components/topbar";
import Footer from "../components/footer";
import request from "../../../utils/request";

import AddAdminModal from "./modal-add";
import EditAdminModal from "./modal-edit";
import ViewAdminModal from "./modal-view";

function AdminAdmin() {
    const [admins, setAdmins] = useState([]);
    const [selectedAdminId, setSelectedAdminId] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchAdmins = async (retryCount = 0) => {
            try {
                const response = await request.get("user");
                const allAdmins = response.data.data;
                const adminUsers = allAdmins.filter(
                    (admin) => admin.role === 1
                );
                setAdmins(adminUsers);
            } catch (error) {
                if (
                    error.response &&
                    error.response.status === 429 &&
                    retryCount < 3
                ) {
                    setTimeout(() => fetchAdmins(retryCount + 1), 2000); // Retry after 2 seconds
                } else {
                    console.error("Error fetching data:", error);
                }
            }
        };

        fetchAdmins();
    }, []);

    useLayoutEffect(() => {
        let table;
        if (filteredAdmins && filteredAdmins.length > 0) {
            $(document).ready(function () {
                table = $("#dataTableHover").DataTable({
                    destroy: true, // Destroy any existing table first
                    searching: false, // Disable default search
                    language: {
                        lengthMenu: "Hiển thị _MENU_ mục",
                        zeroRecords: "Không tìm thấy dữ liệu",
                        info: "Hiển thị _START_ đến _END_ của _TOTAL_ mục",
                        infoEmpty: "Không có mục nào để hiển thị",
                        infoFiltered: "(lọc từ _MAX_ tổng số mục)",
                    },
                    lengthMenu: [5, 10, 25, 50], // Number of rows per page
                    pageLength: 5, // Default number of rows per page
                });
            });
        }
        return () => {
            if (table) {
                table.destroy();
            }
        };
    }, [admins, searchTerm]); // Only use this if you are sure that filteredAdmins should not be a dependency

    // Add
    const handleAddAdmin = () => {
        setShowAddModal(false);
        window.location.reload();
    };

    // Update
    const handleEditButtonClick = (user_id) => {
        setSelectedAdminId(user_id);
        setShowEditModal(true);
    };

    const handleUpdateAdmin = () => {
        setSelectedAdminId(null);
        setShowEditModal(false);
        window.location.reload();
    };

    // View
    const handleView = (user_id) => {
        setSelectedAdminId(user_id);
        setShowViewModal(true);
    };

    const AdminTableBody = ({ admins, handleEditButtonClick }) => {
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
                                onClick={() => handleView(admin.user_id)}
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
                        </td>
                    </tr>
                ))}
            </tbody>
        );
    };

    const filteredAdmins = admins.filter((admin) =>
        admin.name.toLowerCase().includes(searchTerm.toLowerCase())
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
                                                    admins={filteredAdmins}
                                                    handleEditButtonClick={
                                                        handleEditButtonClick
                                                    }
                                                />
                                            </Table>
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
                                    handleClose={() => setShowEditModal(false)}
                                    selectedAdminId={selectedAdminId}
                                    onUpdateAdmin={handleUpdateAdmin}
                                />
                            )}
                            {selectedAdminId && (
                                <ViewAdminModal
                                    show={showViewModal}
                                    handleClose={() => setShowViewModal(false)}
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
