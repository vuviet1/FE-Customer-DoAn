/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Modal, Button, Table, FormControl, InputGroup } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import { useAlert } from '@utils/AlertContext';

import request from "@utils/request";

function ProductModal({ show, handleClose, selectedOrderId }) {
    const [productItems, setProductItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState("");
    const { showErrorAlert } = useAlert();

    const token_type = localStorage.getItem("token_type");
    const access_token = localStorage.getItem("access_token");

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
                (detail) => detail.product_detail
            );
            setProductItems(productData);
            setFilteredItems(productData);
        } catch (error) {
            console.error("Error fetching data:", error);
            setProductItems([]);
            setFilteredItems([]);
            showErrorAlert('Lỗi!', 'Hiển thị sản phẩm thất bại');
        }
    };

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = productItems.filter((item) =>
            item.product.product_name.toLowerCase().includes(query)
        );
        setFilteredItems(filtered);
        setCurrentPage(0);
    };

    const offset = currentPage * itemsPerPage;
    const currentPageItems = filteredItems.slice(
        offset,
        offset + itemsPerPage
    );

    return (
        <Modal show={show} onHide={handleClose} size="xl" centered>
            <Modal.Header closeButton>
                <Modal.Title>Danh sách sản phẩm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
                                    <td>{item.product.product_name}</td>
                                    <td>
                                        <img
                                            src={`http://127.0.0.1:8000/uploads/product/${item.product.image}`}
                                            alt={item.product.product_name}
                                            style={{
                                                width: "100px",
                                                height: "100px",
                                            }}
                                        />
                                    </td>
                                    <td>{item.quantity}</td>
                                    <td>{item.color.color}</td>
                                    <td>{item.size.size}</td>
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
