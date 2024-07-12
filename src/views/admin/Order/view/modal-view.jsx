/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
    Form,
    Modal,
    Button,
    InputGroup,
    Table,
    FormControl,
} from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import { useAlert } from "@utils/AlertContext";
import request from "@utils/request";

function ViewOrderModal({ show, handleClose, selectedOrderId }) {
    const [orders, setOrders] = useState({
        address: "",
        phone_number: "",
        status: 1,
        total: "",
        payment_method_id: 0,
        shipping_method_id: 0,
        voucher_id: "",
        payment_status: 0,
    });

    const [productItems, setProductItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(5); // Number of items per page
    const [searchQuery, setSearchQuery] = useState("");

    const token_type = localStorage.getItem("token_type");
    const access_token = localStorage.getItem("access_token");
    const { showErrorAlert } = useAlert();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                request.defaults.headers.common[
                    "Authorization"
                ] = `${token_type} ${access_token}`;
                if (selectedOrderId) {
                    const orderResponse = await request.get(
                        `order/${selectedOrderId}`
                    );
                    const orderData = orderResponse.data.data;
                    if (orderData) {
                        setOrders({
                            ...orderData,
                            status: orderData.status,
                            phoneNumber: orderData.phone_number,
                            paymentStatus: orderData.payment_status,
                            paymentMethodName: orderData.payment.payment_method,
                            shippingMethodName:
                                orderData.shipping.shipping_method,
                        });
                        setProductItems(
                            orderData.order_details.map(
                                (detail) => detail.product_detail
                            )
                        );
                        setFilteredItems(
                            orderData.order_details.map(
                                (detail) => detail.product_detail
                            )
                        );
                    }
                }
            } catch (error) {
                showErrorAlert("Lỗi!", "Lấy dữ liệu thất bại");
            }
        };

        if (show) {
            fetchOrder();
        }
    }, [show, selectedOrderId]);

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

    const getStatusText = (status) => {
        switch (status) {
            case 0:
                return "Đã hủy";
            case 1:
                return "Chờ duyệt";
            case 2:
                return "Chờ lấy hàng";
            case 3:
                return "Đang giao hàng";
            case 4:
                return "Hoàn thành";
            default:
                return "Không xác định";
        }
    };

    const getPaymentStatusText = (paymentStatus) => {
        switch (paymentStatus) {
            case 0:
                return "Chưa thanh toán";
            case 1:
                return "Đã thanh toán";
            default:
                return "Không xác định";
        }
    };

    function formatCurrency(value) {
        if (value === undefined || value === null) {
            return "";
        }

        const numberValue = Number(value);
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(numberValue);
    }

    const offset = currentPage * itemsPerPage;
    const currentPageItems = Array.isArray(filteredItems)
        ? filteredItems.slice(offset, offset + itemsPerPage)
        : [];

    return (
        <>
            <Modal show={show} onHide={handleClose} size="xl" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xem hóa đơn</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <h5>Thông tin đơn hàng</h5>
                        <div className="row">
                            <div className="col-6">
                                <Form.Group controlId="inputUser">
                                    <Form.Label>Tên khách hàng</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Tên khách hàng ..."
                                        value={orders.name}
                                        readOnly
                                    />
                                </Form.Group>
                                <Form.Group controlId="inputPhoneNumber">
                                    <Form.Label>Số điện thoại</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Số điện thoại ..."
                                        value={orders.phoneNumber}
                                        readOnly
                                    />
                                </Form.Group>
                                <Form.Group controlId="inputAddress">
                                    <Form.Label>Địa chỉ</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Địa chỉ ..."
                                        value={orders.address}
                                        readOnly
                                    />
                                </Form.Group>
                                <Form.Group controlId="inputStatus">
                                    <Form.Label>Trạng thái</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={getStatusText(orders.status)}
                                        placeholder="Trạng thái đơn hàng ..."
                                        readOnly
                                    ></Form.Control>
                                </Form.Group>
                                <Form.Group controlId="inputPhoneNumber">
                                    <Form.Label>
                                        Thời gian tạo hóa đơn
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Thời gian tạo ..."
                                        value={new Date(
                                            orders.created_at
                                        ).toLocaleString()}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-6">
                                <Form.Group controlId="inputPayment">
                                    <Form.Label>
                                        Phương thức thanh toán
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Phương thức thanh toán ..."
                                        value={orders.paymentMethodName}
                                        readOnly
                                    />
                                </Form.Group>
                                <Form.Group controlId="inputShipping">
                                    <Form.Label>
                                        Phương thức vận chuyển
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Phương thức vận chuyển ..."
                                        value={orders.shippingMethodName}
                                        readOnly
                                    />
                                </Form.Group>
                                <Form.Group controlId="inputTotal">
                                    <Form.Label>Tổng tiền</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type="text"
                                            placeholder="Tổng tiền ..."
                                            value={formatCurrency(orders.total)}
                                            readOnly
                                        />
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group controlId="inputShipping">
                                    <Form.Label>
                                        Trạng thái thanh toán
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Phương thức vận chuyển ..."
                                        value={getPaymentStatusText(
                                            orders.paymentStatus
                                        )}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                        </div>
                        <hr />
                        <h5 style={{ marginTop: "15px" }}>
                            Thông tin chi tiết đơn hàng
                        </h5>
                        <div className="d-flex justify-content-between mb-3">
                            <InputGroup
                                className="mb-3"
                                style={{ width: "300px" }}
                            >
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
                        <div className="d-flex justify-content-center">
                            <ReactPaginate
                                previousLabel={<FaAngleDoubleLeft />}
                                nextLabel={<FaAngleDoubleRight />}
                                breakLabel={"..."}
                                pageCount={Math.ceil(
                                    Array.isArray(filteredItems)
                                        ? filteredItems.length / itemsPerPage
                                        : 0
                                )}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={handlePageClick}
                                containerClassName={"pagination"}
                                activeClassName={"active"}
                                previousClassName={"page-item"}
                                nextClassName={"page-item"}
                                previousLinkClassName={"page-link"}
                                nextLinkClassName={"page-link"}
                                pageClassName={"page-item"}
                                pageLinkClassName={"page-link"}
                                breakClassName={"page-item"}
                                breakLinkClassName={"page-link"}
                                disabledClassName={"disabled"}
                            />
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ViewOrderModal;
