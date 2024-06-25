import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Image } from "react-bootstrap";
import { toast } from "react-toastify";

import request from "../../../utils/request";
import ImageUploader from "../components/ImageUploader";
import { getErrorMessage } from "../../../utils/errorMessages";

function EditAdminModal({ show, handleClose, selectedAdminId, onUpdateAdmin }) {
    const [admin, setAdmin] = useState({
        name: "",
        email: "",
        password: "",
        role: 1,
        avatar: "",
        phone: "",
        address: "",
        status: 1,
        google_id: "",
    });

    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const response = await request.get(`user/${selectedAdminId}`);
                if (response.data.data) {
                    setAdmin(response.data.data);
                } else {
                    console.error("No data returned from the API");
                }
            } catch (error) {
                let errorMessage = "Hiển thị nhân viên thất bại: ";
                if (error.response && error.response.status) {
                    errorMessage += getErrorMessage(error.response.status);
                } else {
                    errorMessage += error.message;
                }
                toast.error(errorMessage, {
                    position: "top-right",
                });
                console.error("Lỗi khi lấy dữ liệu:", error);
            }
        };

        if (selectedAdminId) {
            fetchAdmin();
        }
    }, [selectedAdminId]);

    const updateAdmin = async (e) => {
        e.preventDefault();
        try {
            if (!admin.name) {
                toast.error("Trường tên nhân viên là bắt buộc.", {
                    position: "top-right",
                });
                return;
            }

            const formData = {
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

            console.log(formData);

            await request.post(`user/${selectedAdminId}?_method=PUT`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                mode: "no-cors",
            });
            toast.success("Cập nhật nhân viên thành công!", {
                position: "top-right",
            });
            onUpdateAdmin();
            handleClose();
        } catch (error) {
            let errorMessage = "Cập nhật nhân viên thất bại: ";
            if (error.response && error.response.status) {
                errorMessage += getErrorMessage(error.response.status);
            } else {
                errorMessage += error.message;
            }
            toast.error(errorMessage, {
                position: "top-right",
            });
            console.error("Cập nhật nhân viên thất bại:", error);
            handleClose();
        }
    };

    return (
        <>
            <Modal show={show} onHide={handleClose} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Cập nhật Admin</Modal.Title>
                </Modal.Header>
                <Form onSubmit={updateAdmin}>
                    <Modal.Body>
                        <div className="row">
                            <div
                                className="col-6"
                                style={{ textAlign: "center" }}
                            >
                                <Form.Group controlId="adminAvatar">
                                    <Form.Label>Ảnh đại diện</Form.Label>
                                    <ImageUploader
                                        images={images}
                                        setImages={setImages}
                                    />
                                    {!images.length && (
                                        <Image
                                            src={
                                                "http://127.0.0.1:8000/uploads/avatar/" +
                                                admin.avatar
                                            }
                                            alt={admin.name}
                                            style={{
                                                width: "250px",
                                                height: "250px",
                                            }}
                                            thumbnail
                                        />
                                    )}
                                </Form.Group>
                            </div>
                            <div className="col-6">
                                <Form.Group controlId="adminNameEdit">
                                    <Form.Label>Tên Admin</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Cập nhật tên Admin ..."
                                        value={admin.name}
                                        onChange={(e) =>
                                            setAdmin({
                                                ...admin,
                                                name: e.target.value,
                                            })
                                        }
                                    />
                                </Form.Group>
                                <Form.Group controlId="adminEmailEdit">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Cập nhật email ..."
                                        value={admin.email}
                                        onChange={(e) =>
                                            setAdmin({
                                                ...admin,
                                                email: e.target.value,
                                            })
                                        }
                                    />
                                </Form.Group>
                                <Form.Group controlId="adminPasswordEdit">
                                    <Form.Label>Mật khẩu</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Cập nhật mật khẩu ..."
                                        value={admin.password}
                                        onChange={(e) =>
                                            setAdmin({
                                                ...admin,
                                                password: e.target.value,
                                            })
                                        }
                                    />
                                </Form.Group>
                                <Form.Group controlId="adminRoleEdit">
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
                                        <option value="0">
                                            Khách hàng
                                        </option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="adminStatusEdit">
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
                                        <option value="1">Hoạt động</option>
                                        <option value="0">
                                            Không hoạt động
                                        </option>
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-12">
                                <Form.Group controlId="inputPhone">
                                    <Form.Label>Số điện thoại</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Cập nhật số điện thoại ..."
                                        value={admin.phone}
                                        onChange={(e) =>
                                            setAdmin({
                                                ...admin,
                                                phone: e.target.value,
                                            })
                                        }
                                    />
                                </Form.Group>
                                <Form.Group controlId="inputAddress">
                                    <Form.Label>Địa chỉ</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Cập nhật địa chỉ ..."
                                        value={admin.address}
                                        onChange={(e) =>
                                            setAdmin({
                                                ...admin,
                                                address: e.target.value,
                                            })
                                        }
                                    />
                                </Form.Group>
                                <Form.Group controlId="inputGoogleId">
                                    <Form.Label>Google ID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Cập nhật Google ID ..."
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
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Hủy bỏ
                        </Button>
                        <Button type="submit" variant="primary">
                            Cập nhật
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}

export default EditAdminModal;
