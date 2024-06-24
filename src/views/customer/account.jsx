/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */
import React, { Fragment, useEffect, useState } from "react";
import { Form, Button, Image } from "react-bootstrap";
import ReactQuill from "react-quill";
import { htmlToText } from 'html-to-text';

import Header from "./components/header";
import Sidebar from "./components/sidebar";
import Cart from "./components/cart";
import Footer from "./components/footer";

import ImageUploader from "./components/ImageUploader";
import request from "../../utils/request";

function Account() {
    const [images, setImages] = useState([]);
    const [customer, setCustomer] = useState({
        name: "",
        email: "",
        password: "",
        role: 0,
        note: "",
        avatar: "",
        phone: "",
        address: "",
        status: 1,
    });

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user_data"));
        if (userData) {
            setCustomer(userData);
        }
    }, []);

    const updateCustomer = async (e) => {
        e.preventDefault();
        try {
            const formData = {
                name: customer.name,
                email: customer.email,
                password: customer.password,
                role: customer.role,
                note: htmlToText(customer.note, { wordwrap: false }),
                avatar: images[0],
                phone: customer.phone,
                address: customer.address,
                status: customer.status,
                google_id: customer.google_id,
            };

            await request.put(`user/${customer.id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating admin:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomer({ ...customer, [name]: value });
    };

    const handleNoteChange = (value) => {
        setCustomer({ ...customer, note: value });
    };

    return (
        <Fragment>
            <Header />
            <Sidebar />
            <Cart />
            {/* Content */}
            <>
                {/* Title page */}
                <section
                    className="bg-img1 txt-center p-lr-15 p-tb-92"
                    style={{
                        backgroundImage:
                            'url("assets/customer/images/bg-01.jpg")',
                    }}
                >
                    <h2 className="ltext-105 cl0 txt-center">TRANG CÁ NHÂN</h2>
                </section>
                {/* Content page */}
                <section className="bg0 p-t-104 p-b-116 col-12">
                    <div className="container">
                        <div className="col-12">
                            <div className="">
                                <h4 className="mtext-105 cl2 txt-center p-b-30">
                                    Thông tin cá nhân
                                </h4>
                                <Form onSubmit={updateCustomer}>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-6">
                                                <div
                                                    className=" m-b-20 how-pos4-parent"
                                                    // style={{
                                                    //     display: "flex",
                                                    //     flexDirection: "column",
                                                    //     alignItems: "center",
                                                    // }}
                                                >
                                                    <Form.Label>
                                                        Ảnh đại diện
                                                    </Form.Label>
                                                    <ImageUploader
                                                        images={images}
                                                        setImages={setImages}
                                                    />
                                                    {!images.length &&
                                                        customer.avatar && (
                                                            <Image
                                                                src={`http://127.0.0.1:8000/uploads/avatar/${customer.avatar}`}
                                                                alt={
                                                                    customer.name
                                                                }
                                                                style={{
                                                                    width: "250px",
                                                                    height: "250px",
                                                                }}
                                                                thumbnail
                                                            />
                                                        )}
                                                </div>
                                            </div>

                                            <div className="col-6">
                                                <Form.Label>Tên</Form.Label>
                                                <Form.Group className="m-b-20 how-pos4-parent">
                                                    <Form.Control
                                                        className="stext-111 cl2 plh3 size-116 p-r-30"
                                                        type="text"
                                                        placeholder="Tên của bạn ..."
                                                        name="name"
                                                        value={customer.name}
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                    />
                                                </Form.Group>

                                                <Form.Label>Email</Form.Label>
                                                <Form.Group className="m-b-20 how-pos4-parent">
                                                    <Form.Control
                                                        className="stext-111 cl2 plh3 size-116 p-r-30"
                                                        type="email"
                                                        placeholder="Email của bạn ..."
                                                        name="email"
                                                        value={customer.email}
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                    />
                                                </Form.Group>

                                                <Form.Label>Mật khẩu</Form.Label>
                                                <Form.Group className="m-b-20 how-pos4-parent">
                                                    <Form.Control
                                                        className="stext-111 cl2 plh3 size-116 p-r-30"
                                                        type="password"
                                                        placeholder="Mật khẩu của bạn ..."
                                                        name="password"
                                                        value={customer.password}
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                    />
                                                </Form.Group>

                                                <Form.Label>Số điện thoại</Form.Label>
                                                <Form.Group className="m-b-20 how-pos4-parent">
                                                    <Form.Control
                                                        className="stext-111 cl2 plh3 size-116 p-r-30"
                                                        type="number"
                                                        placeholder="Số điện thoại của bạn ..."
                                                        name="phone"
                                                        value={customer.phone}
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                    />
                                                </Form.Group>

                                                <Form.Label>Địa chỉ</Form.Label>
                                                <Form.Group className="m-b-20 how-pos4-parent">
                                                    <Form.Control
                                                        className="stext-111 cl2 plh3 size-116 p-r-30"
                                                        type="text"
                                                        placeholder="Địa chỉ của bạn ..."
                                                        name="address"
                                                        value={customer.address}
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                    />
                                                </Form.Group>
                                            </div>
                                            <Form.Group
                                                controlId="profileNotes"
                                                className="m-b-30"
                                            >
                                                <Form.Label>Ghi chú</Form.Label>
                                                <ReactQuill
                                                    value={customer.note}
                                                    onChange={handleNoteChange}
                                                    placeholder="Ghi chú ..."
                                                    style={{
                                                        height: "200px",
                                                        marginBottom: "50px",
                                                    }}
                                                />
                                            </Form.Group>
                                        </div>

                                        <Button
                                            className="flex-c-m stext-101 cl0 size-121 bg3 bor1 hov-btn3 p-lr-15 trans-04 pointer"
                                            type="submit"
                                        >
                                            Cập nhật
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </section>
            </>

            {/* End Content */}
            <Footer />
        </Fragment>
    );
}
export default Account;
