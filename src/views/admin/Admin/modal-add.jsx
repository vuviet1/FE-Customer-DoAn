import React, { useState } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import ImageUploader from "../components/ImageUploader"; // Giả sử bạn có component ImageUploader cho việc upload ảnh
import request from "../../../utils/request";

function AddAdminModal({ show, handleClose, onAddAdmin }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState(1);
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [status, setStatus] = useState(1);
    const [googleId, setGoogleId] = useState("");
    const [images, setImages] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const adminData = {
                name,
                email,
                password,
                role,
                avatar: images[0],
                phone,
                address,
                status,
                google_id: googleId,
            };
            console.log(adminData);

            const response = await request.post("user", adminData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log("Admin added successfully:", response.data);

            onAddAdmin();
            setImages([]);
            handleClose();
        } catch (error) {
            console.error("Failed to add admin:", error);
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
                                <Form.Label>Tên</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Tên Admin..."
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId="inputEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Email..."
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId="inputPassword">
                                <Form.Label>Mật khẩu</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Mật khẩu..."
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                            </Form.Group>
                            <Form.Group controlId="inputPhone">
                                <Form.Label>Số điện thoại</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Số điện thoại..."
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId="inputStatus">
                                <Form.Label>Trạng thái</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="1">Sử dụng</option>
                                    <option value="0">Không sử dụng</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="inputRole">
                                <Form.Label>Vai trò</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="1">Quản trị viên</option>
                                    <option value="0">Khách hàng</option>
                                </Form.Control>
                            </Form.Group>
                        </div>
                        <div className="col-12">
                            <Form.Group controlId="inputAddress">
                                <Form.Label>Địa chỉ</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Địa chỉ..."
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group controlId="inputGoogleId">
                                <Form.Label>Google ID</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Google ID..."
                                    value={googleId}
                                    onChange={(e) =>
                                        setGoogleId(e.target.value)
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
