/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, Fragment } from "react";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import { Button, Form, Pagination } from "react-bootstrap";
import { useAlert } from '@utils/AlertContext';

import Topbar from "../components/topbar";
import Footer from "../components/footer";
import request from "@utils/request";

import AddColorModal from "./modal-add";
import EditColorModal from "./modal-edit";

function ColorAdmin() {
    const [colors, setColors] = useState([]);
    const [selectedColorId, setSelectedColorId] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredColor, setFilteredColor] = useState([]);
    const [statusFilter, setStatusFilter] = useState("");
    const itemsPerPage = 5;
    const { showSuccessAlert, showErrorAlert } = useAlert();

    const fetchData = async () => {
        try {
            const response = await request.get("color");
            setColors(response.data.data);
            setFilteredColor(response.data.data);
        } catch (error) {
            showErrorAlert('Lỗi!', 'Lấy dữ liệu thất bại');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        filterColor(searchTerm, statusFilter);
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    const handleEditButtonClick = async (color_id) => {
        setSelectedColorId(color_id);
        setShowEditModal(true);
    };

    const handleAddColor = () => {
        setShowAddModal(false);
        fetchData();
    };

    const handleUpdateColor = () => {
        setShowEditModal(false);
        fetchData();
    };

    const deleteColor = async (color_id) => {
        if (window.confirm("Bạn có chắc muốn xóa màu này không?")) {
            try {
                await request.delete(`color/${color_id}`);
                showSuccessAlert('Thành công!', 'Xóa màu thành công!');
                fetchData();
            } catch (error) {
                showErrorAlert('Lỗi!', 'Xóa màu thất bại');
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
    const filterColor = (query, status) => {
        let filtered = colors;
        if (query) {
            filtered = filtered.filter((color) =>
                color.color.toLowerCase().includes(query.toLowerCase())
            );
        }
        if (status) {
            filtered = filtered.filter((color) => color.status.toString() === status);
        }
        setFilteredColor(filtered);
    };

    const handleSearchTermChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
    };

    const offset = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredColor.slice(offset, offset + itemsPerPage);
    const totalPages = Math.ceil(filteredColor.length / itemsPerPage);

    const ColorTableBody = ({ colors, handleEditButtonClick, deleteColor }) => {
        if (!colors || colors.length === 0) {
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
                {colors.map((color, index) => (
                    <tr key={index}>
                        <td style={{ textAlign: "left" }}>{color.color}</td>
                        <td style={{ textAlign: "left" }}>
                            {color.status === 1 ? (
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
                                    handleEditButtonClick(color.color_id)
                                }
                                style={{ marginRight: "5px" }}
                            >
                                <i className="far fa-edit" />
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => deleteColor(color.color_id)}
                            >
                                <i className="fas fa-trash" />
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        );
    };

    const handleScrollToTop = (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <Fragment>
            <div id="wrapper">
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        <Topbar />
                        <div className="container-fluid" id="container-wrapper">
                            <div className="d-sm-flex align-items-center justify-content-between mb4">
                                <h1 className="h3 mb-0 text-gray-800">
                                    Danh mục màu
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
                                        Danh mục màu
                                    </li>
                                </ol>
                            </div>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="card mb-4">
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h6 className="m-0 font-weight-bold text-primary">
                                                Danh sách màu
                                            </h6>
                                            <div className="col-9">
                                                <div className="row">
                                                    <div className="col-8">
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Tìm kiếm theo tên màu..."
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
                                                            Tên màu
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
                                                <ColorTableBody
                                                    colors={currentItems}
                                                    handleEditButtonClick={
                                                        handleEditButtonClick
                                                    }
                                                    deleteColor={deleteColor}
                                                />
                                            </Table>
                                            <div
                                                className="flex-c-m flex-w w-full p-t-45"
                                                style={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "center",
                                                }}
                                            >
                                                <Pagination>
                                                    <Pagination.First
                                                        onClick={handleFirstPage}
                                                    />
                                                    <Pagination.Prev
                                                        onClick={handlePrevPage}
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
                                                                        index + 1
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
                            <AddColorModal
                                show={showAddModal}
                                handleClose={() => setShowAddModal(false)}
                                onAddColor={handleAddColor}
                            />
                            {selectedColorId && (
                                <EditColorModal
                                    show={showEditModal}
                                    handleClose={() =>
                                        setShowEditModal(false)
                                    }
                                    selectedColorId={selectedColorId}
                                    onUpdateColor={handleUpdateColor}
                                />
                            )}
                        </div>
                        <Footer />
                    </div>
                </div>
                <a
                    href="#page-top"
                    className="scroll-to-top rounded"
                    onClick={handleScrollToTop}
                >
                    <i className="fas fa-angle-up" />
                </a>
            </div>
        </Fragment>
    );
}

export default ColorAdmin;
