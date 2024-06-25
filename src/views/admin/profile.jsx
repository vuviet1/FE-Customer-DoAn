/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Form, Image, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
// import ReactQuill from "react-quill";

import Topbar from "./components/topbar";
import Footer from "./components/footer";
import ImageUploader from "./components/ImageUploader";
import request from "../../utils/request";

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

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user_data"));
        if (userData) {
            setAdmin(userData);
        }
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

            await request.put(`user/${admin.id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating admin:", error);
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

    // const handleNoteChange = (value) => {
    //     setAdmin({ ...admin, note: value });
    // };

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
                                    <Link to={"/admin-home"}>Trang chủ</Link>
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
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <Form.Label>
                                                        Ảnh đại diện
                                                    </Form.Label>
                                                    <ImageUploader
                                                        images={images}
                                                        setImages={setImages}
                                                    />
                                                    {!images.length &&
                                                        admin.avatar && (
                                                            <Image
                                                                src={`http://127.0.0.1:8000/uploads/avatar/${admin.avatar}`}
                                                                alt={admin.name}
                                                                style={{
                                                                    width: "250px",
                                                                    height: "250px",
                                                                }}
                                                                thumbnail
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
                                                            value={admin.name}
                                                            onChange={
                                                                handleInputChange
                                                            }
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
                                                            value={admin.email}
                                                            onChange={
                                                                handleInputChange
                                                            }
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
                                                            value={admin.phone}
                                                            onChange={
                                                                handleInputChange
                                                            }
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
                                                        />
                                                    </Form.Group>

                                                    {/* <Form.Group
                                                        controlId="profileNotes"
                                                        className="mt-3"
                                                    >
                                                        <Form.Label>
                                                            Ghi chú
                                                        </Form.Label>
                                                        <ReactQuill
                                                            value={admin.note}
                                                            onChange={
                                                                handleNoteChange
                                                            }
                                                            placeholder="Ghi chú ..."
                                                            style={{
                                                                height: "200px",
                                                                marginBottom:
                                                                    "30px",
                                                            }}
                                                        />
                                                    </Form.Group> */}

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
