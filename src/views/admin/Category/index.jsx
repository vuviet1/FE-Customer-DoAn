/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, Fragment } from "react";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import database from "../components/database"
import Topbar from "../components/topbar";
import Footer from "../components/footer";
import request from "../../../utils/request";

import AddCategoryModal from "./modal-add";
import EditCategoryModal from "./modal-edit";

function CategoryAdmin() {
    const [categorys, setCategorys] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await request.get("category");
                setCategorys(response.data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        let table;
        if (categorys && categorys.length > 0) {
            table = database.initializeDataTable("#dataTableHover");
        }
        return () => {
            if (table) {
                table.destroy();
            }
        };
    }, [categorys]);

    const handleEditButtonClick = async (category_id) => {
        setSelectedCategoryId(category_id);
        setShowEditModal(true);
    };

    const handleAddCategory = () => {
        setShowAddModal(false);
        window.location.reload();
    };

    const handleUpdateCategory = () => {
        setShowEditModal(false);
        window.location.reload();
    };

    const deleteCategory = async (category_id) => {
        if (window.confirm("Bạn có chắc muốn xóa danh mục này không?")) {
            try {
                await request.delete(`category/${category_id}`);
                window.location.reload();
            } catch (error) {
                console.error("Error deleting category:", error);
            }
        }
    };

    const CategoryTableBody = ({ categorys, handleEditButtonClick, deleteCategory }) => {
        if (!categorys || categorys.length === 0) {
            return (
                <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                        Không có dữ liệu
                    </td>
                </tr>
            )
        }

        return (
            <tbody>
                {categorys.map((category, index) => (
                    <tr key={index}>
                        <td style={{ textAlign: "left" }}>{category.category_name}</td>
                        <td style={{ textAlign: "left" }}>
                            {category.status === 1 ? (
                                <span className="badge badge-success">Sử dụng</span>
                            ) : (
                                <span className="badge badge-danger">Không sử dụng</span>
                            )}
                        </td>
                        <td style={{ textAlign: "center" }}>
                            <button
                                type="button"
                                className="btn btn-success ml-2"
                                onClick={() => handleEditButtonClick(category.category_id)}
                            >
                                <i className="far fa-edit" />
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger ml-2"
                                onClick={() => deleteCategory(category.category_id)}
                            >
                                <i className="fas fa-trash" />
                            </button>
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
                                <h1 className="h3 mb-0 text-gray-800">Danh mục</h1>
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link to={"/admin-home"}>Home</Link>
                                    </li>
                                    <li className="breadcrumb-item">Danh mục quản lý</li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        Danh mục
                                    </li>
                                </ol>
                            </div>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="card mb-4">
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h6 className="m-0 font-weight-bold text-primary">Danh mục</h6>
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={() => setShowAddModal(true)}
                                            >
                                                <i className="fas fa-plus" /> Thêm mới
                                            </button>
                                        </div>
                                        <div className="table-responsive p-3">
                                            <Table className="table align-items-center table-flush table-hover" id="dataTableHover">
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th style={{ textAlign: "left" }}>Tên danh mục</th>
                                                        <th style={{ textAlign: "left" }}>Trạng thái</th>
                                                        <th style={{ textAlign: "center" }}>Hành động</th>
                                                    </tr>
                                                </thead>
                                                <CategoryTableBody
                                                    categorys={categorys}
                                                    handleEditButtonClick={handleEditButtonClick}
                                                    deleteCategory={deleteCategory}
                                                />
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Footer />
                    </div>
                </div>
                <a href="#page-top" className="scroll-to-top rounded" onClick={handleScrollToTop}>
                    <i className="fas fa-angle-up" />
                </a>
            </div>
            <AddCategoryModal show={showAddModal} handleClose={() => setShowAddModal(false)} onAddCategory={handleAddCategory} />
            <EditCategoryModal show={showEditModal} handleClose={() => setShowEditModal(false)} selectedCategoryId={selectedCategoryId} onUpdateCategory={handleUpdateCategory} />
        </Fragment>
    );
}

export default CategoryAdmin;
