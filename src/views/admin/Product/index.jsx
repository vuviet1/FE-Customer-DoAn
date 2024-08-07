/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, Fragment } from "react";
import { Table, Button, Form, Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAlert } from '@utils/AlertContext';
import Topbar from "../components/topbar";
import Footer from "../components/footer";
import request from "@utils/request";

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
    const [filteredProduct, setFilteredProduct] = useState([]);
    const [statusFilter, setStatusFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const { showSuccessAlert, showErrorAlert } = useAlert();

    const fetchData = async () => {
        try {
            const response = await request.get("product");
            setProducts(response.data.data);
            setFilteredProduct(response.data.data);
        } catch (error) {
            showErrorAlert('Lỗi!', 'Lấy dữ liệu thất bại');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        filterProduct(searchTerm, statusFilter);
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

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

    // Add
    const handleAddProduct = () => {
        setShowAddModal(false);
        fetchData();
    };

    // Update
    const handleEditButtonClick = (product_id) => {
        setSelectedProductId(product_id);
        setShowEditModal(true);
    };

    const handleUpdateProduct = () => {
        setSelectedProductId(null);
        setShowEditModal(false);
        fetchData();
    };

    // Add detail
    const handleAddDetailClick = (product_id) => {
        setSelectedProductId(product_id);
        setShowAddDetailModal(true);
    };

    const handleAddDetail = () => {
        setSelectedProductId(null);
        setShowAddDetailModal(false);
        fetchData();
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
                showSuccessAlert('Thành công!', 'Xóa sản phẩm thành công!');
                fetchData();
            } catch (error) {
                showErrorAlert('Lỗi!', 'Xóa sản phẩm thất bại');
            }
        }
    };

    // Lọc và tìm kiếm
    const filterProduct = (query, status) => {
        let filtered = products;
        if (query) {
            filtered = filtered.filter((product) =>
                product.product_name.toLowerCase().includes(query.toLowerCase())
            );
        }
        if (status) {
            filtered = filtered.filter(
                (product) => product.status.toString() === status
            );
        }
        setFilteredProduct(filtered);
    };

    const handleSearchTermChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
    };

    const offset = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredProduct.slice(offset, offset + itemsPerPage);
    const totalPages = Math.ceil(filteredProduct.length / itemsPerPage);

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
                        <td colSpan="6" style={{ textAlign: "center" }}>
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
                            {!product.discount ? (
                                <span className="discounted-price">
                                    {Number(product.price).toLocaleString("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                    })}
                                </span>
                            ) : (
                                <div className="price-container">
                                    <span className="original-price">
                                        {Number(product.price).toLocaleString("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        })}
                                    </span>
                                    <span className="arrow">→</span>
                                    <span className="discounted-price">
                                        {(
                                            product.price *
                                            (1 - product.discount / 100)
                                        ).toLocaleString("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        })}
                                    </span>
                                </div>
                            )}
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
                                            <div className="col-10">
                                                <div className="row">
                                                    <div className="col-8">
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Tìm kiếm theo tên sản phẩm..."
                                                            value={searchTerm}
                                                            onChange={
                                                                handleSearchTermChange
                                                            }
                                                        />
                                                    </div>
                                                    <div className="col-4">
                                                        <Form.Control
                                                            as="select"
                                                            value={statusFilter}
                                                            onChange={
                                                                handleStatusFilterChange
                                                            }
                                                        >
                                                            <option value="">
                                                                Tất cả trạng
                                                                thái
                                                            </option>
                                                            <option value="1">
                                                                Sử dụng
                                                            </option>
                                                            <option value="0">
                                                                Không sử dụng
                                                            </option>
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
                                                            Tên sản phẩm
                                                        </th>
                                                        <th
                                                            style={{
                                                                textAlign:
                                                                    "left",
                                                            }}
                                                        >
                                                            Hình ảnh
                                                        </th>
                                                        <th
                                                            style={{
                                                                textAlign:
                                                                    "left",
                                                            }}
                                                        >
                                                            Giá sản phẩm
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
                                                    products={currentItems}
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
                                                                    index +
                                                                        1 ===
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
