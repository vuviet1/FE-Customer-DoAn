import React, { useState } from "react";
import { Image, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import request from "../../utils/request";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // const [remember, setRemember] = useState(true);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataLogin = {
            email,
            password,
        };
        try {
            const response = await request.post("auth/login", dataLogin);
            const { access_token, token_type } = response.data;

            localStorage.setItem("access_token", access_token);
            localStorage.setItem("token_type", token_type);

            request.defaults.headers.common[
                "Authorization"
            ] = `${token_type} ${access_token}`;

            // Kiểm tra role người dùng
            const userResponse = await request.post("auth/me");
            const userData = userResponse.data;

            localStorage.setItem("user_data", JSON.stringify(userData));

            if (userData.role === 1) {
                window.location.reload();
                window.location.href = '/admin-home';
            } else if (userData.role === 0) {
                window.location.reload();
                window.location.href = '/';
            }
        } catch (error) {
            toast.error("Đăng nhập thất bại.", {
                position: "top-right",
            });
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <>
        <ToastContainer />
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
                <h1 className="login__title">Đăng nhập</h1>
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
                    <div className="login__box">
                        <i className="ri-lock-2-line login__icon" />
                        <div className="login__box-input">
                            <input
                                type={passwordVisible ? "text" : "password"}
                                required
                                className="login__input"
                                id="login-pass"
                                placeholder=""
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
                                className={
                                    passwordVisible
                                        ? "ri-eye-line login__eye"
                                        : "ri-eye-off-line login__eye"
                                }
                                id="login-eye"
                                onClick={togglePasswordVisibility}
                                style={{ cursor: "pointer" }}
                            />
                        </div>
                    </div>
                </div>
                <div className="login__check">
                    <div className="login__check-group">
                    </div>

                    <div className="login__check-group"></div>
                    <Link to={"/forgot"} className="login__forgot">
                        Quên mật khẩu?
                    </Link>
                </div>
                <button type="submit" className="login__button">
                    Đăng nhập
                </button>
                <p className="login__register">
                    Bạn không có tài khoản?{" "}
                    <Link to={"/register"}>Đăng ký</Link>
                </p>
                <p className="login__register">
                    <Link to={"/"}>Trở lại trang chủ</Link>
                </p>
            </Form>
        </div>
        </>
    );
}

export default Login;
