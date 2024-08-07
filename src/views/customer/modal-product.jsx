/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Modal, Button, Table, FormControl, InputGroup } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import { useAlert } from "@utils/AlertContext";
import request from "@utils/request";
import { Link } from "react-router-dom";

function ProductModal({ show, handleClose, selectedOrderId }) {
    const [productItems, setProductItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState("");
    // const [orderData, setOrderData] = useState(null);
    const { showErrorAlert } = useAlert();

    const token_type = localStorage.getItem("token_type");
    const access_token = localStorage.getItem("access_token");

    const handleProductClick = (productId) => {
        sessionStorage.setItem("productId", productId);
        window.location.href = `/product-detail`;
    };

    useEffect(() => {
        if (show) {
            fetchProductItems();
        }
    }, [show]);

    const fetchProductItems = async () => {
        try {
            request.defaults.headers.common[
                "Authorization"
            ] = `${token_type} ${access_token}`;
            const response = await request.get(`order/${selectedOrderId}`);
            const productData = response.data.data.order_details.map(
                (detail) => detail
            );
            setProductItems(productData);
            setFilteredItems(productData);
            // setOrderData(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            setProductItems([]);
            setFilteredItems([]);
            // setOrderData(null);
            showErrorAlert("Lỗi!", "Hiển thị sản phẩm thất bại");
        }
    };

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = productItems.filter((item) =>
            item.product_detail.product.product_name.toLowerCase().includes(query)
        );
        setFilteredItems(filtered);
        setCurrentPage(0);
    };

    const offset = currentPage * itemsPerPage;
    const currentPageItems = filteredItems.slice(offset, offset + itemsPerPage);

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Danh sách sản phẩm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {/* {orderData && (
                    <Table striped bordered hover className="mb-3">
                        <thead>
                            <tr>
                                <th colSpan="2">Thông tin đơn hàng</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Mã đơn hàng</strong></td>
                                <td>{orderData.order_id}</td>
                            </tr>
                            <tr>
                                <td><strong>Khách hàng</strong></td>
                                <td>{orderData.name}</td>
                            </tr>
                            <tr>
                                <td><strong>Địa chỉ</strong></td>
                                <td>{orderData.address}</td>
                            </tr>
                            <tr>
                                <td><strong>Số điện thoại</strong></td>
                                <td>{orderData.phone_number}</td>
                            </tr>
                            <tr>
                                <td><strong>Tổng tiền</strong></td>
                                <td>{orderData.total}</td>
                            </tr>
                        </tbody>
                    </Table>
                )} */}
                <div className="d-flex justify-content-between mb-3">
                    <InputGroup className="mb-3" style={{ width: "300px" }}>
                        <FormControl
                            placeholder="Tìm kiếm theo tên sản phẩm"
                            aria-label="Search"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </InputGroup>
                </div>
                {filteredItems.length > 0 ? (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Tên sản phẩm</th>
                                <th>Ảnh</th>
                                <th>Số lượng</th>
                                <th>Màu sắc</th>
                                <th>Kích cỡ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPageItems.map((item, index) => (
                                <tr key={item.product_detail_id}>
                                    <td>{offset + index + 1}</td>
                                    <td>
                                        <div>
                                            <Link
                                                onClick={() =>
                                                    handleProductClick(
                                                        item.product_detail.product.product_id
                                                    )
                                                }
                                            >
                                                {item.product_detail.product.product_name}
                                            </Link>
                                        </div>
                                    </td>
                                    <td>
                                        <img
                                            src={`http://127.0.0.1:8000/uploads/product/${item.product_detail.product.image}`}
                                            alt={item.product_detail.product.product_name}
                                            style={{
                                                width: "100px",
                                                height: "100px",
                                            }}
                                        />
                                    </td>
                                    <td>{item.quantity}</td>
                                    <td>{item.product_detail.color.color}</td>
                                    <td>{item.product_detail.size.size}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : (
                    <p className="text-center">Không có sản phẩm nào.</p>
                )}
                <div className="d-flex justify-content-center">
                    <ReactPaginate
                        previousLabel={<FaAngleDoubleLeft />}
                        nextLabel={<FaAngleDoubleRight />}
                        breakLabel={"..."}
                        pageCount={Math.ceil(
                            filteredItems.length / itemsPerPage
                        )}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageClick}
                        containerClassName={"pagination"}
                        pageClassName={"page-item"}
                        pageLinkClassName={"page-link"}
                        previousClassName={"page-item"}
                        previousLinkClassName={"page-link"}
                        nextClassName={"page-item"}
                        nextLinkClassName={"page-link"}
                        breakClassName={"page-item"}
                        breakLinkClassName={"page-link"}
                        activeClassName={"active"}
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ProductModal;
