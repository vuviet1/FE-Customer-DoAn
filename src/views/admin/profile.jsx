/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Form, Image, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAlert } from '@utils/AlertContext';

import Topbar from "./components/topbar";
import Footer from "./components/footer";
import ImageUploader from "./components/ImageUploader";
import request from "@utils/request";

function ProfileAdmin() {
    const [images, setImages] = useState([]);
    const [admin, setAdmin] = useState({
        name: "",
        email: "",
        password: "",
        role: 1,
        note: "",
        avatar: "",
        phone: "",
        address: "",
        status: 1,
    });
    const { showSuccessAlert, showErrorAlert } = useAlert();

    const fetchData = async () => {
        const userData = JSON.parse(localStorage.getItem("user_data"));
        const userId = userData.user_id;
        if (userId) {
            try {
                const response = await request.get(
                    `user/${userId}`
                );
                setAdmin(response.data.data);
            } catch (error) {
                showErrorAlert('Lỗi!', 'Lấy dữ liệu thất bại');
            }
        }
    };

    useEffect(() => {
        fetchData()
    }, []);

    const updateAdmin = async (e) => {
        e.preventDefault();
        try {
            const formData = {
                name: admin.name,
                email: admin.email,
                password: admin.password,
                role: admin.role,
                note: admin.note,
                avatar: images[0],
                phone: admin.phone,
                address: admin.address,
                status: admin.status,
                google_id: admin.google_id,
            };

            const token_type = localStorage.getItem("token_type");
            const access_token = localStorage.getItem("access_token");
            request.defaults.headers.common[
                "Authorization"
            ] = `${token_type} ${access_token}`;
            await request.post(`user/${admin.user_id}?_method=PUT`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const updatedAdmin = {
                ...admin,
                avatar: images[0].name,
            };
            localStorage.setItem("user_data", JSON.stringify(updatedAdmin));

            showSuccessAlert('Thành công!', 'Cập nhật thông tin thành công!');
            window.location.reload();
        } catch (error) {
            showErrorAlert('Lỗi!', 'Cập nhật thông tin thất bại');
        }
    };

    const handleScrollToTop = (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAdmin({ ...admin, [name]: value });
    };

    return (
            <div id="wrapper">
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        <Topbar />
                        <div className="container-fluid" id="container-wrapper">
                            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                <h1 className="h3 mb-0 text-gray-800">
                                    Trang cá nhân
                                </h1>
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link to={"/admin-home"}>
                                            Trang chủ
                                        </Link>
                                    </li>
                                    <li
                                        className="breadcrumb-item active"
                                        aria-current="page"
                                    >
                                        Trang cá nhân
                                    </li>
                                </ol>
                            </div>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="card mb-4">
                                        <div className="card-header py-3">
                                            <h6 className="m-0 font-weight-bold text-primary">
                                                Thông tin cá nhân
                                            </h6>
                                        </div>
                                        <Form onSubmit={updateAdmin}>
                                            <div className="card-body">
                                                <div className="row">
                                                    <div
                                                        className="col-md-4"
                                                        style={{
                                                            display: "flex",
                                                            flexDirection:
                                                                "column",
                                                            alignItems:
                                                                "center",
                                                        }}
                                                    >
                                                        <Form.Label>
                                                            Ảnh đại diện
                                                        </Form.Label>
                                                        <ImageUploader
                                                            images={images}
                                                            setImages={
                                                                setImages
                                                            }
                                                        />
                                                        {!images.length &&
                                                            admin.avatar && (
                                                                <Image
                                                                    src={`http://127.0.0.1:8000/uploads/avatar/${admin.avatar}`}
                                                                    alt={
                                                                        admin.name
                                                                    }
                                                                    style={{
                                                                        width: "250px",
                                                                        height: "250px",
                                                                    }}
                                                                    thumbnail
                                                                    roundedCircle
                                                                />
                                                            )}
                                                    </div>
                                                    <div className="col-md-8">
                                                        <Form.Group controlId="profileName">
                                                            <Form.Label>
                                                                Tên
                                                            </Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Tên của bạn ..."
                                                                name="name"
                                                                value={
                                                                    admin.name
                                                                }
                                                                onChange={
                                                                    handleInputChange
                                                                }
                                                                required
                                                            />
                                                        </Form.Group>

                                                        <Form.Group
                                                            controlId="profileEmail"
                                                            className="mt-3"
                                                        >
                                                            <Form.Label>
                                                                Email
                                                            </Form.Label>
                                                            <Form.Control
                                                                type="email"
                                                                placeholder="Email của bạn ..."
                                                                name="email"
                                                                value={
                                                                    admin.email
                                                                }
                                                                onChange={
                                                                    handleInputChange
                                                                }
                                                                required
                                                            />
                                                        </Form.Group>
                                                        <Form.Group
                                                            controlId="profilePassword"
                                                            className="mt-3"
                                                        >
                                                            <Form.Label>
                                                                Mật khẩu
                                                            </Form.Label>
                                                            <Form.Control
                                                                type="password"
                                                                placeholder="Cập nhật mật khẩu ..."
                                                                name="password"
                                                                value={
                                                                    admin.password
                                                                }
                                                                onChange={
                                                                    handleInputChange
                                                                }
                                                            />
                                                        </Form.Group>
                                                        <Form.Group
                                                            controlId="profilePhone"
                                                            className="mt-3"
                                                        >
                                                            <Form.Label>
                                                                Số điện thoại
                                                            </Form.Label>
                                                            <Form.Control
                                                                type="tel"
                                                                placeholder="Số điện thoại của bạn ..."
                                                                name="phone"
                                                                value={
                                                                    admin.phone
                                                                }
                                                                onChange={
                                                                    handleInputChange
                                                                }
                                                                required
                                                            />
                                                        </Form.Group>

                                                        <Form.Group
                                                            controlId="profileAddress"
                                                            className="mt-3"
                                                        >
                                                            <Form.Label>
                                                                Địa chỉ
                                                            </Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Địa chỉ của bạn ..."
                                                                name="address"
                                                                value={
                                                                    admin.address
                                                                }
                                                                onChange={
                                                                    handleInputChange
                                                                }
                                                                required
                                                            />
                                                        </Form.Group>
                                                        <Button
                                                            type="submit"
                                                            className="btn btn-primary mt-4"
                                                        >
                                                            Cập nhật thông tin
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Footer />
                    </div>
                </div>
                <a
                    href="#page-top"
                    className="scroll-to-top rounded"
                    onClick={handleScrollToTop}
                >
                    <i className="fas fa-angle-up" />
                </a>
            </div>
    );
}

export default ProfileAdmin;
