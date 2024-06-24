import React, { useState } from "react";
import { Image, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import request from "../../utils/request";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataLogin = {
            name,
            email,
            password,
            confirm_password: confirmPassword,
        }

        console.log(dataLogin);
        try {
            const response = await request.post("auth/register", dataLogin);
            console.log(response.data);
            console.log("Check user successfully:", response.data);
            window.location.href='http://localhost:3000'
        } catch (error) {
            console.error("Failed to check user:", error);
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
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
                <h1 className="login__title">Đăng ký</h1>
                <div className="login__content">
                <div className="login__box">
                        <i className="ri-user-3-line login__icon" />
                        <div className="login__box-input">
                            <input
                                type="text"
                                required
                                className="login__input"
                                id="login-email"
                                placeholder=" "
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <label
                                htmlFor="login-email"
                                className="login__label"
                            >
                                Tên
                            </label>
                        </div>
                    </div>
                    <div className="login__box">
                        <i className="ri-user-3-line login__icon" />
                        <div className="login__box-input">
                            <input
                                type="email"
                                required
                                className="login__input"
                                id="login-email"
                                placeholder=" "
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
                    <div className="login__box">
                        <i className="ri-lock-2-line login__icon" />
                        <div className="login__box-input">
                            <input
                                type={passwordVisible ? "text" : "password"}
                                required
                                className="login__input"
                                id="login-pass"
                                placeholder=" "
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <label
                                htmlFor="login-pass"
                                className="login__label"
                            >
                                Mật khẩu
                            </label>
                            <i
                                className={passwordVisible ? "ri-eye-line login__eye" : "ri-eye-off-line login__eye"}
                                id="login-eye"
                                onClick={togglePasswordVisibility}
                                style={{ cursor: "pointer" }}
                            />
                        </div>
                    </div>
                    <div className="login__box">
                        <i className="ri-lock-2-line login__icon" />
                        <div className="login__box-input">
                            <input
                                type={confirmPasswordVisible ? "text" : "password"}
                                required
                                className="login__input"
                                id="login-pass"
                                placeholder=" "
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <label
                                htmlFor="login-pass"
                                className="login__label"
                            >
                                Nhập lại mật khẩu
                            </label>
                            <i
                                className={confirmPasswordVisible ? "ri-eye-line login__eye" : "ri-eye-off-line login__eye"}
                                id="login-eye"
                                onClick={toggleConfirmPasswordVisibility}
                                style={{ cursor: "pointer" }}
                            />
                        </div>
                    </div>
                </div>
                <div className="login__check"></div>
                <button type="submit" className="login__button">
                    Đăng ký
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
export default Register;
