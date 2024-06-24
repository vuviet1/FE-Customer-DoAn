import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Form, Collapse } from "react-bootstrap";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import request from "../../../../utils/request";

function ProductSelectionModal({ show, handleClose, onAddProduct }) {
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [productsPerPage] = useState(5);
    const [expandedProductId, setExpandedProductId] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await request.get("product");
                const data = response.data.data;
                setProducts(data);
                setFilteredProducts(data);
            } catch (error) {
                console.error("Lỗi khi lấy sản phẩm:", error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        setFilteredProducts(
            products.filter((product) =>
                product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, products]);

    useEffect(() => {
        if (!show) {
            // Reset state khi modal đóng
            setSelectedProducts([]);
            setSearchTerm("");
            setFilteredProducts(products);
        }
    }, [show, products]);

    const toggleProductDetails = (productId) => {
        if (expandedProductId === productId) {
            setExpandedProductId(null);
        } else {
            setExpandedProductId(productId);
        }
    };

    const indexOfLastProduct = (currentPage + 1) * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const handlePageClick = (data) => setCurrentPage(data.selected);

    const handleSelectProductDetail = (product_detail_id, quantity) => {
        setSelectedProducts((prevSelectedProducts) => {
            const productIndex = prevSelectedProducts.findIndex(
                (product) => product.product_detail_id === product_detail_id
            );

            if (productIndex !== -1) {
                const updatedSelectedProducts = [...prevSelectedProducts];
                updatedSelectedProducts[productIndex].quantity = quantity;
                return updatedSelectedProducts;
            } else {
                return [...prevSelectedProducts, { product_detail_id, quantity }];
            }
        });
    };

    const handleAddToCart = async (e) => {
        e.preventDefault();
        const token_type = localStorage.getItem("token_type");
        const access_token = localStorage.getItem("access_token");
        request.defaults.headers.common["Authorization"] = `${token_type} ${access_token}`;

        try {
            const response = await request.post("add-to-cart", selectedProducts );
            console.log(response);
            onAddProduct();
            handleClose();
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Danh sách sản phẩm</Modal.Title>
            </Modal.Header>
            <Form className="mb-3" onSubmit={handleAddToCart}>
                <Modal.Body>
                    <Form.Control
                        type="text"
                        placeholder="Tìm kiếm sản phẩm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ marginBottom: "10px" }}
                    />
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Tên sản phẩm</th>
                                <th>Ảnh</th>
                                <th>Giá</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentProducts.map((product, index) => (
                                <React.Fragment key={index}>
                                    <tr onClick={() => toggleProductDetails(product.product_id)}>
                                        <td>{product.product_name}</td>
                                        <td>
                                            <img
                                                src={`http://127.0.0.1:8000/uploads/product/${product.image}`}
                                                alt={product.product_name}
                                                style={{ width: "100px", height: "100px" }}
                                            />
                                        </td>
                                        <td>{product.price}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="3" style={{ padding: 0, border: "none" }}>
                                            <Collapse in={expandedProductId === product.product_id}>
                                                <div>
                                                    {product.product_details && product.product_details.length > 0 ? (
                                                        <Table striped bordered hover>
                                                            <thead>
                                                                <tr>
                                                                    <th>Màu sắc</th>
                                                                    <th>Kích cỡ</th>
                                                                    <th>Số lượng</th>
                                                                    <th>Chọn</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {product.product_details.map((detail, detailIndex) => (
                                                                    <tr key={detailIndex}>
                                                                        <td>{detail.color.color}</td>
                                                                        <td>{detail.size.size}</td>
                                                                        <td>
                                                                            <Form.Control
                                                                                type="number"
                                                                                min="0"
                                                                                value={
                                                                                    selectedProducts.find(
                                                                                        (product) => product.product_detail_id === detail.product_detail_id
                                                                                    )?.quantity || 0
                                                                                }
                                                                                onChange={(e) =>
                                                                                    handleSelectProductDetail(
                                                                                        detail.product_detail_id,
                                                                                        parseInt(e.target.value) || 0
                                                                                    )
                                                                                }
                                                                            />
                                                                        </td>
                                                                        <td style={{ display: "flex", justifyContent: "center", padding: "initial" }}>
                                                                            <Form.Check
                                                                                style={{ transform: "scale(1.5)" }}
                                                                                type="checkbox"
                                                                                onChange={() =>
                                                                                    handleSelectProductDetail(
                                                                                        detail.product_detail_id,
                                                                                        selectedProducts.find(
                                                                                            (product) => product.product_detail_id === detail.product_detail_id
                                                                                        )?.quantity || 0
                                                                                    )
                                                                                }
                                                                                checked={selectedProducts.some(
                                                                                    (product) => product.product_detail_id === detail.product_detail_id && product.quantity > 0
                                                                                )}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </Table>
                                                    ) : (
                                                        <p>Đang tải chi tiết...</p>
                                                    )}
                                                </div>
                                            </Collapse>
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </Table>
                    <div className="d-flex justify-content-center">
                        <ReactPaginate
                            previousLabel={<FaAngleDoubleLeft />}
                            nextLabel={<FaAngleDoubleRight />}
                            breakLabel={"..."}
                            pageCount={Math.ceil(filteredProducts.length / productsPerPage)}
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
                    <Button variant="primary" type="submit">
                        Thêm vào giỏ hàng
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default ProductSelectionModal;
