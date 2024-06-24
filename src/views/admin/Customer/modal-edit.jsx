import React, { useState, useEffect } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import ImageUploader from "../components/ImageUploader";

function EditCustomerModal({
    show,
    handleClose,
    customerData,
    onUpdateCustomer,
}) {
    const [name, setName] = useState(customerData.name);
    const [email, setEmail] = useState(customerData.email);
    const [phone, setPhone] = useState(customerData.phone);
    const [password, setPassword] = useState(customerData.password);
    const [status, setStatus] = useState(customerData.status);
    const [role, setRole] = useState(customerData.role);
    const [address, setAddress] = useState(customerData.address);
    const [image, setImage] = useState(customerData.image);

    useEffect(() => {
        setName(customerData.name);
        setEmail(customerData.email);
        setPhone(customerData.phone);
        setPassword(customerData.password);
        setStatus(customerData.status);
        setRole(customerData.role);
        setAddress(customerData.address);
        setImage(customerData.image);
    }, [customerData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Xử lý logic cập nhật khách hàng
        onUpdateCustomer({
            ...customerData,
            name,
            email,
            phone,
            password,
            status,
            role,
            address,
            image,
        });
        handleClose();
    };

    const handleImageChange = (image) => {
        setImage(image.name);
    };

    return (
        <Modal show={show} onHide={handleClose} size="xl" centered>
            <Modal.Header closeButton>
                <Modal.Title>Cập nhật khách hàng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-6">
                            <label htmlFor="editImg" className="form-label">
                                Ảnh đại diện
                            </label>
                            <ImageUploader onImageChange={handleImageChange} />
                        </div>
                        <div className="col-6">
                            <Form.Group controlId="editName">
                                <Form.Label>Tên khách hàng</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Tên khách hàng mới ..."
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId="editEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Email ..."
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId="editPhone">
                                <Form.Label>Số điện thoại</Form.Label>
                                <Form.Control
                                    type="tel"
                                    placeholder="Số điện thoại ..."
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId="editPassword">
                                <Form.Label>Mật khẩu</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Mật khẩu ..."
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                            </Form.Group>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6 mt-3">
                            <Form.Group controlId="editStatus">
                                <Form.Label>Trạng thái</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="1">Sử dụng</option>
                                    <option value="2">Không sử dụng</option>
                                </Form.Control>
                            </Form.Group>
                        </div>
                        <div className="col-6 mt-3">
                            <Form.Group controlId="editRole">
                                <Form.Label>Quyền</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Quyền ..."
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                />
                            </Form.Group>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 mt-3">
                            <Form.Group controlId="editAddress">
                                <Form.Label>Địa chỉ</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Địa chỉ ..."
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </Form.Group>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <Button variant="outline-primary" onClick={handleClose}>
                            Hủy bỏ
                        </Button>
                        <Button variant="primary" type="submit">
                            Cập nhật
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default EditCustomerModal;
