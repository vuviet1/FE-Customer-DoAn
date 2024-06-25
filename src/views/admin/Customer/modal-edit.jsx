import React, { useState, useEffect } from "react";
import { Form, Modal, Button, Image } from "react-bootstrap";
import { toast } from "react-toastify";

import ImageUploader from "../components/ImageUploader";
import request from "../../../utils/request";
import { getErrorMessage } from "../../../utils/errorMessages";

function EditCustomerModal({ show, handleClose, selectedCustomerId, onUpdateCustomer }) {
    const [customer, setCustomer] = useState({
        name: "",
        email: "",
        password: "",
        role: 0,
        avatar: "",
        phone: "",
        address: "",
        status: 1,
        google_id: "",
    });

    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const response = await request.get(`user/${selectedCustomerId}`);
                if (response.data.data) {
                    setCustomer(response.data.data);
                } else {
                    console.error("No data returned from the API");
                }
            } catch (error) {
                let errorMessage = "Hiển thị khách hàng thất bại: ";
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

        if (selectedCustomerId) {
            fetchCustomer();
        }
    }, [selectedCustomerId]);

    const updateCustomer = async (e) => {
        e.preventDefault();
        try {
            if (!customer.name) {
                toast.error("Trường tên khách hàng là bắt buộc.", {
                    position: "top-right",
                });
                return;
            }

            const formData = {
                name: customer.name,
                email: customer.email,
                password: customer.password,
                role: customer.role,
                avatar: images[0],
                phone: customer.phone,
                address: customer.address,
                status: customer.status,
                google_id: customer.google_id,
            };

            console.log(formData);

            await request.post(`user/${selectedCustomerId}?_method=PUT`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                mode: "no-cors",
            });
            toast.success("Cập nhật khách hàng thành công!", {
                position: "top-right",
            });
            onUpdateCustomer();
            handleClose();
        } catch (error) {
            let errorMessage = "Cập nhật khách hàng thất bại: ";
            if (error.response && error.response.status) {
                errorMessage += getErrorMessage(error.response.status);
            } else {
                errorMessage += error.message;
            }
            toast.error(errorMessage, {
                position: "top-right",
            });
            console.error("Cập nhật khách hàng thất bại:", error);
            handleClose();
        }
    };

    return (
        <>
            <Modal show={show} onHide={handleClose} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Cập nhật Khách hàng</Modal.Title>
                </Modal.Header>
                <Form onSubmit={updateCustomer}>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-6" style={{ textAlign: "center" }}>
                                <Form.Group controlId="customerAvatar">
                                    <Form.Label>Ảnh đại diện</Form.Label>
                                    <ImageUploader
                                        images={images}
                                        setImages={setImages}
                                    />
                                    {!images.length && (
                                        <Image
                                            src={
                                                "http://127.0.0.1:8000/uploads/avatar/" +
                                                customer.avatar
                                            }
                                            alt={customer.name}
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
                                <Form.Group controlId="customerNameEdit">
                                    <Form.Label>Tên Khách hàng</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Cập nhật tên Khách hàng ..."
                                        value={customer.name}
                                        onChange={(e) =>
                                            setCustomer({
                                                ...customer,
                                                name: e.target.value,
                                            })
                                        }
                                    />
                                </Form.Group>
                                <Form.Group controlId="customerEmailEdit">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Cập nhật email ..."
                                        value={customer.email}
                                        onChange={(e) =>
                                            setCustomer({
                                                ...customer,
                                                email: e.target.value,
                                            })
                                        }
                                    />
                                </Form.Group>
                                <Form.Group controlId="customerPasswordEdit">
                                    <Form.Label>Mật khẩu</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Cập nhật mật khẩu ..."
                                        value={customer.password}
                                        onChange={(e) =>
                                            setCustomer({
                                                ...customer,
                                                password: e.target.value,
                                            })
                                        }
                                    />
                                </Form.Group>
                                <Form.Group controlId="customerRoleEdit">
                                    <Form.Label>Vai trò</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={customer.role === 0 ? "Khách hàng": "Quản trị viên"}
                                        readOnly
                                    >
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="customerStatusEdit">
                                    <Form.Label>Trạng thái</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={customer.status}
                                        onChange={(e) =>
                                            setCustomer({
                                                ...customer,
                                                status: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="1">Sử dụng</option>
                                        <option value="0">Không sử dụng</option>
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-12">
                                <Form.Group controlId="inputPhone">
                                    <Form.Label>Số điện thoại</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Cập nhật số điện thoại ..."
                                        value={customer.phone}
                                        onChange={(e) =>
                                            setCustomer({
                                                ...customer,
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
                                        value={customer.address}
                                        onChange={(e) =>
                                            setCustomer({
                                                ...customer,
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
                                        value={customer.google_id}
                                        onChange={(e) =>
                                            setCustomer({
                                                ...customer,
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

export default EditCustomerModal;
