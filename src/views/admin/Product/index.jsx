/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, Fragment, useLayoutEffect } from "react";
import { Table, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify"

import $ from "jquery";
import Topbar from "../components/topbar";
import Footer from "../components/footer";
import request from "../../../utils/request";
import { getErrorMessage } from "../../../utils/errorMessages"

import AddProductModal from "./modal-add";
import EditProductModal from "./modal-edit";
import AddProductDetailModal from "./modal-add-detail";
import ViewProductModal from "./modal-view";

function ProductAdmin() {
    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showAddDetailModal, setShowAddDetailModal] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");

    const fetchData = async () => {
        try {
            const response = await request.get("product");
            setProducts(response.data.data);
        } catch (error) {
            let errorMessage = "Hiển thị sản phẩm thất bại: "
        if (error.response && error.response.status) {
            errorMessage += getErrorMessage(error.response.status)
        } else {
            errorMessage += error.message
        }
        toast.error(errorMessage, {
            position: "top-right"
        })
        console.error("Error fetching data:", error)
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useLayoutEffect(() => {
        let table;
        if (filteredProducts && filteredProducts.length > 0) {
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
                    paging: true,
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
    }, [products, searchTerm]);

    // Add
    const handleAddProduct = () => {
        setShowAddModal(false);
        fetchData()
    };

    // Update
    const handleEditButtonClick = (product_id) => {
        setSelectedProductId(product_id);
        setShowEditModal(true);
    };

    const handleUpdateProduct = () => {
        setSelectedProductId(null);
        setShowEditModal(false);
        fetchData()
    };

    // Add detail
    const handleAddDetailClick = (product_id) => {
        setSelectedProductId(product_id);
        setShowAddDetailModal(true);
    };

    const handleAddDetail = () => {
        setSelectedProductId(null);
        setShowAddDetailModal(false);
        fetchData()
    };

    // View
    const handleView = (product_id) => {
        setSelectedProductId(product_id);
        setShowViewModal(true);
    };

    // Delete
    const deleteProduct = async (product_id) => {
        if (window.confirm("Bạn có chắc muốn xóa sản phẩm này không?")) {
            try {
                await request.delete(`product/${product_id}`);
                toast.success("Xóa sản phẩm thành công!", {
                    position: "top-right",
                })
                fetchData()
            } catch (error) {
                let errorMessage = "Xóa sản phẩm thất bại: "
                if (error.response && error.response.status) {
                    errorMessage += getErrorMessage(error.response.status)
                } else {
                    errorMessage += error.message
                }
                toast.error(errorMessage, {
                    position: "top-right",
                })
                console.error("Xóa sản phẩm thất bại:", error)
            }
        }
    };

    const ProductTableBody = ({
        products,
        handleEditButtonClick,
        deleteProduct,
        handleAddDetailClick,
    }) => {
        if (!products || products.length === 0) {
            return (
                <tbody>
                    <tr>
                        <td colSpan="4" style={{ textAlign: "center" }}>
                            Không có dữ liệu
                        </td>
                    </tr>
                </tbody>
            );
        }

        return (
            <tbody>
                {products.map((product, index) => (
                    <tr key={index}>
                        <td style={{ textAlign: "left" }}>
                            {product.product_name}
                        </td>
                        <td style={{ textAlign: "left" }}>
                            <img
                                src={
                                    "http://127.0.0.1:8000/uploads/product/" +
                                    product.image
                                }
                                alt={product.product_name}
                                style={{ width: "100px", height: "100px" }}
                                thumbnail="true"
                            />
                        </td>
                        <td style={{ textAlign: "left" }}>
                            {product.total_quantity}
                        </td>
                        <td style={{ textAlign: "left" }}>
                            {product.product_details_count}
                        </td>
                        <td style={{ textAlign: "left" }}>
                            {product.status === 1 ? (
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
                                onClick={() => handleView(product.product_id)}
                                style={{ marginRight: "5px" }}
                            >
                                <i className="far fa-eye" />
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() =>
                                    handleAddDetailClick(product.product_id)
                                }
                                style={{ marginRight: "5px" }}
                            >
                                <i className="fas fa-plus" />
                            </Button>
                            <Button
                                variant="success"
                                onClick={() =>
                                    handleEditButtonClick(product.product_id)
                                }
                                style={{ marginRight: "5px" }}
                            >
                                <i className="far fa-edit" />
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() =>
                                    deleteProduct(product.product_id)
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

    const filteredProducts = products.filter((product) =>
        product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
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
                                    Sản phẩm
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
                                        Sản phẩm
                                    </li>
                                </ol>
                            </div>

                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="card mb-4">
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h6 className="m-0 font-weight-bold text-primary">
                                                Sản phẩm
                                            </h6>
                                            <div className="col-6">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Tìm kiếm sản phẩm..."
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
                                                            Tên sản phẩm
                                                        </th>
                                                        <th
                                                            style={{
                                                                textAlign:
                                                                    "left",
                                                            }}
                                                        >
                                                            Ảnh sản phẩm
                                                        </th>
                                                        <th
                                                            style={{
                                                                textAlign:
                                                                    "left",
                                                            }}
                                                        >
                                                            Tổng số lượng
                                                        </th>
                                                        <th
                                                            style={{
                                                                textAlign:
                                                                    "left",
                                                            }}
                                                        >
                                                            Số phân loại
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
                                                <ProductTableBody
                                                    // products={products}
                                                    products={filteredProducts}
                                                    handleEditButtonClick={
                                                        handleEditButtonClick
                                                    }
                                                    handleAddDetailClick={
                                                        handleAddDetailClick
                                                    }
                                                    deleteProduct={
                                                        deleteProduct
                                                    }
                                                />
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <AddProductModal
                                show={showAddModal}
                                handleClose={() => setShowAddModal(false)}
                                onAddProduct={handleAddProduct}
                            />
                            {selectedProductId && (
                                <EditProductModal
                                    show={showEditModal}
                                    handleClose={() => setShowEditModal(false)}
                                    selectedProductId={selectedProductId}
                                    onUpdateProduct={handleUpdateProduct}
                                />
                            )}
                            {selectedProductId && (
                                <AddProductDetailModal
                                    show={showAddDetailModal}
                                    handleClose={() =>
                                        setShowAddDetailModal(false)
                                    }
                                    productId={selectedProductId} // Pass the selected product ID
                                    onAddProductDetail={handleAddDetail}
                                />
                            )}
                            {selectedProductId && (
                                <ViewProductModal
                                    show={showViewModal}
                                    handleClose={() => setShowViewModal(false)}
                                    selectedProductId={selectedProductId}
                                    onAddProductDetail={handleView}
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

export default ProductAdmin;
