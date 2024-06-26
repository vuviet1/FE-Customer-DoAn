import React, { useEffect, useState, Fragment } from "react";
import { Table, Button, Form, Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import Topbar from "../components/topbar";
import Footer from "../components/footer";
import request from "../../../utils/request";
import { getErrorMessage } from "../../../utils/errorMessages";

import AddBrandModal from "./modal-add";
import EditBrandModal from "./modal-edit";

function BrandAdmin() {
    const [brands, setBrands] = useState([]);
    const [selectedBrandId, setSelectedBrandId] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const itemsPerPage = 5;

    const fetchData = async () => {
        try {
            const response = await request.get("brand");
            setBrands(response.data.data);
        } catch (error) {
            let errorMessage = "Hiển thị thương hiệu thất bại: ";
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

    const handleEditButtonClick = (brand_id) => {
        setSelectedBrandId(brand_id);
        setShowEditModal(true);
    };

    const handleAddBrand = () => {
        setShowAddModal(false);
        fetchData();
    };

    const handleUpdateBrand = () => {
        setSelectedBrandId(null);
        setShowEditModal(false);
        fetchData();
    };

    const deleteBrand = async (brand_id) => {
        if (window.confirm("Bạn có chắc muốn xóa thương hiệu này không?")) {
            try {
                await request.delete(`brand/${brand_id}`);
                toast.success("Xóa thương hiệu thành công!", {
                    position: "top-right",
                });
                fetchData();
            } catch (error) {
                let errorMessage = "Xóa thương hiệu thất bại: ";
                if (error.response && error.response.status) {
                    errorMessage += getErrorMessage(error.response.status);
                } else {
                    errorMessage += error.message;
                }
                toast.error(errorMessage, {
                    position: "top-right",
                });
                console.error("Xóa thương hiệu thất bại:", error);
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

    const filteredBrands = brands.filter((brand) =>
        brand.brand_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const offset = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredBrands.slice(offset, offset + itemsPerPage);
    const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);

    const BrandTableBody = ({ brands, handleEditButtonClick, deleteBrand }) => {
        if (!brands || brands.length === 0) {
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
                                                        <th style={{ textAlign: "left" }}>Tên thương hiệu</th>
                                                        <th style={{ textAlign: "left" }}>Trạng thái</th>
                                                        <th style={{ textAlign: "center" }}>Hành động</th>
                                                    </tr>
                                                </thead>
                                                <BrandTableBody
                                                    brands={currentItems}
                                                    handleEditButtonClick={handleEditButtonClick}
                                                    deleteBrand={deleteBrand}
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

export default BrandAdmin;
