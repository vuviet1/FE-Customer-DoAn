import React, { useEffect, useState, Fragment } from "react";
import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import database from "../components/database";
import Topbar from "../components/topbar";
import Footer from "../components/footer";
import request from "../../../utils/request";

import AddBrandModal from "./modal-add";
import EditBrandModal from "./modal-edit";

function BrandAdmin() {
    const [brands, setBrands] = useState([]);
    const [selectedBrandId, setSelectedBrandId] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await request.get("brand");
                setBrands(response.data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        let table;
        if (brands && brands.length > 0) {
            table = database.initializeDataTable("#dataTableHover");
        }
        return () => {
            if (table) {
                table.destroy();
            }
        };
    }, [brands]);

    const handleAddBrand = () => {
        setShowAddModal(false);
        window.location.reload();
    };

    const handleEditButtonClick = (brand_id) => {
        setSelectedBrandId(brand_id);
        setShowEditModal(true);
    };

    const handleUpdateBrand = () => {
        setSelectedBrandId(null);
        setShowEditModal(false);
        window.location.reload();
    };

    const deleteBrand = async (brand_id) => {
        if (window.confirm("Bạn có chắc muốn xóa thương hiệu này không?")) {
            try {
                await request.delete(`brand/${brand_id}`);
                window.location.reload();
            } catch (error) {
                console.error("Error deleting brand:", error);
            }
        }
    };

    const BrandTableBody = ({ brands, handleEditButtonClick, deleteBrand }) => {
        if (!brands || brands.length === 0) {
            return (
                <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                        Không có dữ liệu
                    </td>
                </tr>
            );
        }

        return (
            <tbody>
                {brands.map((brand, index) => (
                    <tr key={index}>
                        <td style={{ textAlign: "left" }}>{brand.brand_name}</td>
                        <td style={{ textAlign: "left" }}>
                            {brand.status === 1 ? (
                                <span className="badge badge-success">Sử dụng</span>
                            ) : (
                                <span className="badge badge-danger">Không sử dụng</span>
                            )}
                        </td>
                        <td style={{ textAlign: "center" }}>
                            <Button
                                variant="success"
                                onClick={() => handleEditButtonClick(brand.brand_id)}
                                style={{ marginRight: "5px" }}
                            >
                                <i className="far fa-edit" />
                            </Button>
                            <Button variant="danger" onClick={() => deleteBrand(brand.brand_id)}>
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
                                <h1 className="h3 mb-0 text-gray-800">Thương hiệu</h1>
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link to={"/admin-home"}>Home</Link>
                                    </li>
                                    <li className="breadcrumb-item">Danh mục quản lý</li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        Thương hiệu
                                    </li>
                                </ol>
                            </div>

                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="card mb-4">
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h6 className="m-0 font-weight-bold text-primary">
                                                Danh sách thương hiệu
                                            </h6>
                                            <Button variant="primary" onClick={() => setShowAddModal(true)}>
                                                <i className="fas fa-plus" /> Thêm mới
                                            </Button>
                                        </div>
                                        <div className="table-responsive p-3">
                                            <Table className="table align-items-center table-flush table-hover" id="dataTableHover">
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th style={{ textAlign: "left" }}>Tên thương hiệu</th>
                                                        <th style={{ textAlign: "left" }}>Trạng thái</th>
                                                        <th style={{ textAlign: "center" }}>Hành động</th>
                                                    </tr>
                                                </thead>
                                                <BrandTableBody
                                                    brands={brands}
                                                    handleEditButtonClick={handleEditButtonClick}
                                                    deleteBrand={deleteBrand}
                                                />
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <AddBrandModal
                                show={showAddModal}
                                handleClose={() => setShowAddModal(false)}
                                onAddBrand={handleAddBrand}
                            />
                            {selectedBrandId && (
                                <EditBrandModal
                                    show={showEditModal}
                                    handleClose={() => setShowEditModal(false)}
                                    selectedBrandId={selectedBrandId}
                                    onUpdateBrand={handleUpdateBrand}
                                />
                            )}
                        </div>
                        <Footer />
                    </div>
                </div>
                <a href="#page-top" className="scroll-to-top rounded" onClick={(e) => {e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" });}}>
                    <i className="fas fa-angle-up" />
                </a>
            </div>
        </Fragment>
    );
}

export default BrandAdmin;
