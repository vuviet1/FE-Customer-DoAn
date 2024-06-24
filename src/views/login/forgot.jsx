import React, { useState } from "react";
import { Form, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import request from "../../utils/request";

function Forgot() {
    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await request.post("auth/me", email);
            console.log(response.data);
            console.log("Check user successfully:", response.data);
        } catch (error) {
            console.error("Failed to check user:", error);
        }
    };

    return (
        <div className="login">
            <link
                href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css"
                rel="stylesheet"
            ></link>
            <link rel="stylesheet" href="assets/login/css/styles.css"></link>
            <Image
                src="assets/login/img/login-bg.png"
                alt="login image"
                className="login__img"
            />
            <Form onSubmit={handleSubmit} className="login__form">
                <h1 className="login__title">Quên mật khẩu</h1>
                <div className="login__content">
                    <div className="login__box">
                        <i className="ri-user-3-line login__icon" />
                        <div className="login__box-input">
                            <input
                                type="email"
                                required
                                className="login__input"
                                id="login-email"
                                placeholder=""
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label
                                htmlFor="login-email"
                                className="login__label"
                            >
                                Email
                            </label>
                        </div>
                    </div>
                </div>
                <button type="submit" className="login__button">
                    Gửi mã xác nhận
                </button>
                <p className="login__register">
                    <Link to={"/login"}>
                        <i class="fas fa-chevron-left"></i> Trở lại trang đăng
                        nhập
                    </Link>
                </p>
            </Form>
        </div>
    );
}
export default Forgot;
