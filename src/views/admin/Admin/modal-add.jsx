import React, { useState } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import { useAlert } from "@utils/AlertContext";

import ImageUploader from "../components/ImageUploader";
import request from "@utils/request";

function AddAdminModal({ show, handleClose, onAddAdmin }) {
    const [admin, setAdmin] = useState({
        name: "",
        email: "",
        password: "",
        role: 1,
        google_id: "",
        avatar: "",
        phone: "",
        address: "",
        status: 1,
    });
    const [images, setImages] = useState([]);
    const { showSuccessAlert, showErrorAlert } = useAlert();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const adminData = {
                name: admin.name,
                email: admin.email,
                password: admin.password,
                role: admin.role,
                avatar: images[0],
                phone: admin.phone,
                address: admin.address,
                status: admin.status,
                google_id: admin.google_id,
            };
            console.log(adminData);

            await request.post("user", adminData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            showSuccessAlert("Thành công!", "Thêm nhân viên thành công!");
            onAddAdmin();
            setImages([]);
            handleClose();
        } catch (error) {
            showErrorAlert("Lỗi!", "Thêm nhân viên thất bại");
            handleClose();
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Thêm mới Admin</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <h5>Thông tin chung</h5>
                    <div className="row">
                        <div className="col-6">
                            <Form.Group controlId="inputImage">
                                <Form.Label>Ảnh đại diện</Form.Label>
                                <ImageUploader
                                    images={images}
                                    setImages={setImages}
                                />
                            </Form.Group>
                        </div>
                        <div className="col-6">
                            <Form.Group controlId="inputName">
                                <Form.Label>Tên quản trị viên</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Tên quản trị viên..."
                                    value={admin.name}
                                    onChange={(e) =>
                                        setAdmin({
                                            ...admin,
                                            name: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="inputEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Email..."
                                    value={admin.email}
                                    onChange={(e) =>
                                        setAdmin({
                                            ...admin,
                                            email: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="inputPassword">
                                <Form.Label>Mật khẩu</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Mật khẩu..."
                                    value={admin.password}
                                    onChange={(e) =>
                                        setAdmin({
                                            ...admin,
                                            password: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="inputPhone">
                                <Form.Label>Số điện thoại</Form.Label>
                                <Form.Control
                                    type="tel"
                                    name="phone"
                                    placeholder="Số điện thoại..."
                                    value={admin.phone}
                                    onChange={(e) => {
                                        const numericValue =
                                            e.target.value.replace(/\D/g, "");
                                        setAdmin({
                                            ...admin,
                                            phone: numericValue,
                                        });
                                    }}
                                    maxlength="10"
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="inputStatus">
                                <Form.Label>Trạng thái</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={admin.status}
                                    onChange={(e) =>
                                        setAdmin({
                                            ...admin,
                                            status: e.target.value,
                                        })
                                    }
                                >
                                    <option value="1">Sử dụng</option>
                                    <option value="0">Không sử dụng</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="inputRole">
                                <Form.Label>Vai trò</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={admin.role}
                                    onChange={(e) =>
                                        setAdmin({
                                            ...admin,
                                            role: e.target.value,
                                        })
                                    }
                                >
                                    <option value="1">Quản trị viên</option>
                                </Form.Control>
                            </Form.Group>
                        </div>
                        <div className="col-12">
                            <Form.Group controlId="inputAddress">
                                <Form.Label>Địa chỉ</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Địa chỉ..."
                                    value={admin.address}
                                    onChange={(e) =>
                                        setAdmin({
                                            ...admin,
                                            address: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="inputGoogleId">
                                <Form.Label>Google ID</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Google ID..."
                                    value={admin.google_id}
                                    onChange={(e) =>
                                        setAdmin({
                                            ...admin,
                                            google_id: e.target.value,
                                        })
                                    }
                                />
                            </Form.Group>
                        </div>
                    </div>
                    <hr />
                    <Modal.Footer>
                        <Button variant="outline-primary" onClick={handleClose}>
                            Hủy bỏ
                        </Button>
                        <Button variant="primary" type="submit">
                            Thêm mới
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default AddAdminModal;
