/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, Fragment } from "react";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import { toast } from "react-toastify";

import database from "../components/database";
import Topbar from "../components/topbar";
import Footer from "../components/footer";
import request from "../../../utils/request";
import { getErrorMessage } from "../../../utils/errorMessages";

import AddColorModal from "./modal-add";
import EditColorModal from "./modal-edit";

function ColorAdmin() {
    const [colors, setColors] = useState([]);
    const [selectedColorId, setSelectedColorId] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const fetchData = async () => {
        try {
            const response = await request.get("color");
            setColors(response.data.data || []);
        } catch (error) {
            let errorMessage = "Hiển thị màu thất bại: ";
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
        if (colors.length > 0) {
            table = database.initializeDataTable("#dataTableHover");
        }
        return () => {
            if (table) {
                table.destroy();
            }
        };
    }, [colors]);

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
                toast.success("Xóa màu thành công!", {
                    position: "top-right",
                });
                fetchData();
            } catch (error) {
                let errorMessage = "Xóa màu thất bại: ";
                if (error.response && error.response.status) {
                    errorMessage += getErrorMessage(error.response.status);
                } else {
                    errorMessage += error.message;
                }
                toast.error(errorMessage, {
                    position: "top-right",
                });
                console.error("Xóa màu thất bại:", error);
            }
        }
    };

    const ColorTableBody = ({ colors, handleEditButtonClick, deleteColor }) => {
        if (!colors || colors.length === 0) {
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
                            <button
                                type="button"
                                className="btn btn-success ml-2"
                                onClick={() =>
                                    handleEditButtonClick(color.color_id)
                                }
                            >
                                <i className="far fa-edit" />
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger ml-2"
                                onClick={() => deleteColor(color.color_id)}
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
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={() =>
                                                    setShowAddModal(true)
                                                }
                                            >
                                                <i className="fas fa-plus" />{" "}
                                                Thêm mới
                                            </button>
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
                                                    colors={colors}
                                                    handleEditButtonClick={
                                                        handleEditButtonClick
                                                    }
                                                    deleteColor={deleteColor}
                                                />
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <AddColorModal
                                show={showAddModal}
                                handleClose={() => setShowAddModal(false)}
                                onAddColor={handleAddColor}
                            />
                            <EditColorModal
                                show={showEditModal}
                                handleClose={() => setShowEditModal(false)}
                                selectedColorId={selectedColorId}
                                onUpdateColor={handleUpdateColor}
                            />
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
