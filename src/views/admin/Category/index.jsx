/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, Fragment } from "react";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import { toast } from "react-toastify";
import { Pagination, Form, Button } from "react-bootstrap";

import Topbar from "../components/topbar";
import Footer from "../components/footer";
import request from "../../../utils/request";
import { getErrorMessage } from "../../../utils/errorMessages";

import AddCategoryModal from "./modal-add";
import EditCategoryModal from "./modal-edit";

function CategoryAdmin() {
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const itemsPerPage = 5;

    const fetchData = async () => {
        try {
            const response = await request.get("category");
            setCategories(response.data.data);
        } catch (error) {
            let errorMessage = "Hiển thị danh mục thất bại: ";
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

    const handleEditButtonClick = async (category_id) => {
        setSelectedCategoryId(category_id);
        setShowEditModal(true);
    };

    const handleAddCategory = () => {
        setShowAddModal(false);
        fetchData();
    };

    const handleUpdateCategory = () => {
        setShowEditModal(false);
        fetchData();
    };

    const deleteCategory = async (category_id) => {
        if (window.confirm("Bạn có chắc muốn xóa danh mục này không?")) {
            try {
                await request.delete(`category/${category_id}`);
                toast.success("Xóa danh mục thành công!", {
                    position: "top-right",
                });
                fetchData();
            } catch (error) {
                let errorMessage = "Xóa danh mục thất bại: ";
                if (error.response && error.response.status) {
                    errorMessage += getErrorMessage(error.response.status);
                } else {
                    errorMessage += error.message;
                }
                toast.error(errorMessage, {
                    position: "top-right",
                });
                console.error("Xóa danh mục thất bại:", error);
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

    const filteredCategories = categories.filter((category) =>
        category.category_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const offset = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredCategories.slice(offset, offset + itemsPerPage);
    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

    const CategoryTableBody = ({
        categories,
        handleEditButtonClick,
        deleteCategory,
    }) => {
        if (!categories || categories.length === 0) {
            return (
                <tr>
                    <td colSpan="3" style={{ textAlign: "center" }}>
                        Không có dữ liệu
                    </td>
                </tr>
            );
        }

        return (
            <tbody>
                {categories.map((category, index) => (
                    <tr key={index}>
                        <td style={{ textAlign: "left" }}>
                            {category.category_name}
                        </td>
                        <td style={{ textAlign: "left" }}>
                            {category.status === 1 ? (
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
                                    handleEditButtonClick(category.category_id)
                                }
                                style={{ marginRight: "5px" }}
                            >
                                <i className="far fa-edit" />
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => deleteCategory(category.category_id)}
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
                            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                <h1 className="h3 mb-0 text-gray-800">
                                    Danh mục
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
                                        Danh mục
                                    </li>
                                </ol>
                            </div>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="card mb-4">
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h6 className="m-0 font-weight-bold text-primary">
                                                Danh sách danh mục
                                            </h6>
                                            <div className="col-6">
                                                <Form.Group controlId="search">
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Tìm kiếm..."
                                                        value={searchTerm}
                                                        onChange={handleSearchChange}
                                                    />
                                                </Form.Group>
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
                                                        <th
                                                            style={{
                                                                textAlign:
                                                                    "left",
                                                            }}
                                                        >
                                                            Tên danh mục
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
                                                <CategoryTableBody
                                                    categories={currentItems}
                                                    handleEditButtonClick={handleEditButtonClick}
                                                    deleteCategory={deleteCategory}
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
            <AddCategoryModal
                show={showAddModal}
                handleClose={() => setShowAddModal(false)}
                onAddCategory={handleAddCategory}
            />
            {selectedCategoryId && (
                <EditCategoryModal
                    show={showEditModal}
                    handleClose={() => setShowEditModal(false)}
                    selectedCategoryId={selectedCategoryId}
                    onUpdateCategory={handleUpdateCategory}
                />
            )}
        </Fragment>
    );
}

export default CategoryAdmin;
