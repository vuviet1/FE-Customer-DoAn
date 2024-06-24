import React from "react";
import { Form, Modal, Button } from "react-bootstrap";

function ViewCustomerModal({ show, handleClose, customerData }) {
    return (
        <Modal show={show} onHide={handleClose} size="xl" centered>
            <Modal.Header closeButton>
                <Modal.Title>Thông tin chi tiết khách hàng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-6">
                        <label htmlFor="viewImg" className="form-label">
                            Ảnh đại diện
                        </label>
                        <img
                            src={customerData.image}
                            alt="Avatar"
                            className="img-fluid"
                        />
                    </div>
                    <div className="col-6">
                        <Form.Group controlId="viewName">
                            <Form.Label>Tên khách hàng</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Tên khách hàng ..."
                                value={customerData.name}
                                readOnly
                            />
                        </Form.Group>
                        <Form.Group controlId="viewEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Email ..."
                                value={customerData.email}
                                readOnly
                            />
                        </Form.Group>
                        <Form.Group controlId="viewPhone">
                            <Form.Label>Số điện thoại</Form.Label>
                            <Form.Control
                                type="tel"
                                placeholder="Số điện thoại ..."
                                value={customerData.phone}
                                readOnly
                            />
                        </Form.Group>
                        <Form.Group controlId="viewPassword">
                            <Form.Label>Mật khẩu</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Mật khẩu ..."
                                value="******"
                                readOnly
                            />
                        </Form.Group>
                    </div>
                </div>
                <div className="row">
                    <div className="col-6 mt-3">
                        <Form.Group controlId="viewStatus">
                            <Form.Label>Trạng thái</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Trạng thái ..."
                                value={
                                    customerData.status === "1"
                                        ? "Sử dụng"
                                        : "Không sử dụng"
                                }
                                readOnly
                            />
                        </Form.Group>
                    </div>
                    <div className="col-6 mt-3">
                        <Form.Group controlId="viewRole">
                            <Form.Label>Quyền</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Quyền ..."
                                value={customerData.role}
                                readOnly
                            />
                        </Form.Group>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 mt-3">
                        <Form.Group controlId="viewAddress">
                            <Form.Label>Địa chỉ</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Địa chỉ ..."
                                value={customerData.address}
                                readOnly
                            />
                        </Form.Group>
                    </div>
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

export default ViewCustomerModal;
