import React, { useState } from "react";
import { Image, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import request from "../../utils/request";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(true);
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

            // Lưu token vào localStorage
            localStorage.setItem("access_token", access_token);
            localStorage.setItem("token_type", token_type);

            // Thêm token vào header cho các yêu cầu tiếp theo
            request.defaults.headers.common[
                "Authorization"
            ] = `${token_type} ${access_token}`;

            // Kiểm tra role người dùng
            const userResponse = await request.post("auth/me");
            const userData = userResponse.data;

            console.log(userData);
            localStorage.setItem("user_data", JSON.stringify(userData));

            if (userData.role === 1) {
                window.location.href = `http://localhost:3001`;
            } else if (userData.role === 0) {
                window.location.href = "http://localhost:3002";
            }
        } catch (error) {
            console.error("Failed to check user:", error);
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className="login">
            <link
                href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css"
                rel="stylesheet"
            ></link>
            <link rel="stylesheet" href="assets/css/login.css"></link>
            <Image
                src="assets/images/login-bg.png"
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
                        <input
                            type="checkbox"
                            className="login__check-input"
                            id="login-check"
                            value={remember}
                            onChange={(e) => setRemember(e.target.value)}
                        />
                        <label
                            htmlFor="login-check"
                            className="login__check-label"
                        >
                            Ghi nhớ tôi
                        </label>
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
            </Form>
        </div>
    );
}

export default Login;
