import React, { useEffect, useState } from "react";
import { Modal, Button, Table, FormControl, InputGroup } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";

import request from "../../../../utils/request";
import ProductSelectionModal from "./modal-add-product";

function CartModal({ show, handleClose }) {
    const [cartItems, setCartItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(5); // Number of items per page
    const [searchQuery, setSearchQuery] = useState("");
    const [productModalShow, setProductModalShow] = useState(false);

    useEffect(() => {
        if (show) {
            fetchCartItems();
        }
    }, [show]);

    const fetchCartItems = async () => {
        const token_type = localStorage.getItem("token_type");
        const access_token = localStorage.getItem("access_token");
        request.defaults.headers.common[
            "Authorization"
        ] = `${token_type} ${access_token}`;
        try {
            const response = await request.get("cart");
            const cartData = response.data.data;
            setCartItems(cartData);
            setFilteredItems(cartData);
        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
    };

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = cartItems.filter((item) =>
            item.product_detail.product.product_name
                .toLowerCase()
                .includes(query)
        );
        setFilteredItems(filtered);
        setCurrentPage(0); // Reset to the first page
    };

    const removeFromCart = async (product_detail_id) => {
        const token_type = localStorage.getItem("token_type");
        const access_token = localStorage.getItem("access_token");
        request.defaults.headers.common[
            "Authorization"
        ] = `${token_type} ${access_token}`;
        try {
            await request.delete(`/cart/${product_detail_id}`);
            const updatedCartItems = cartItems.filter(
                (item) => item.product_detail_id !== product_detail_id
            );
            setCartItems(updatedCartItems);
            setFilteredItems(updatedCartItems);
        } catch (error) {
            console.error("Error removing item from cart:", error);
        }
    };

    const offset = currentPage * itemsPerPage;
    const currentPageItems = filteredItems.slice(offset, offset + itemsPerPage);

    const handleAddProduct = async () => {
        setProductModalShow(false);
        await fetchCartItems();
    };

    const handleModalClose = () => {
        setProductModalShow(false);
    };

    return (
        <>
            <Modal show={show} onHide={handleClose} size="xl" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Giỏ hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex justify-content-between mb-3">
                        <Button
                            variant="primary"
                            onClick={() => setProductModalShow(true)}
                        >
                            Thêm sản phẩm
                        </Button>
                        <InputGroup className="mb-3" style={{ width: "300px" }}>
                            <FormControl
                                placeholder="Tìm kiếm theo tên sản phẩm"
                                aria-label="Search"
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                        </InputGroup>
                    </div>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Tên sản phẩm</th>
                                <th>Ảnh</th>
                                <th>Số lượng</th>
                                <th>Màu sắc</th>
                                <th>Kích cỡ</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPageItems.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{offset + index + 1}</td>
                                    <td>
                                        {
                                            item.product_detail.product
                                                .product_name
                                        }
                                    </td>
                                    <td>
                                        <img
                                            src={`http://127.0.0.1:8000/uploads/product/${item.product_detail.product.image}`}
                                            alt={
                                                item.product_detail.product
                                                    .product_name
                                            }
                                            style={{
                                                width: "100px",
                                                height: "100px",
                                            }}
                                        />
                                    </td>
                                    <td>{item.quantity}</td>
                                    <td>{item.product_detail.color.color}</td>
                                    <td>{item.product_detail.size.size}</td>
                                    <td>
                                        <Button
                                            variant="danger"
                                            onClick={() =>
                                                removeFromCart(
                                                    item.product_detail_id
                                                )
                                            }
                                        >
                                            Xóa
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
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

            <ProductSelectionModal
                show={productModalShow}
                handleClose={handleModalClose}
                onAddProduct={handleAddProduct}
            />
        </>
    );
}

export default CartModal;
