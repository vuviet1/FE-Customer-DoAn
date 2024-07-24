/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAlert } from '@utils/AlertContext';

const GoogleCallback = () => {
    const location = useLocation();
    const { showSuccessAlert, showErrorAlert } = useAlert();

    useEffect(() => {
        const handleGoogleResponse = () => {
            const query = new URLSearchParams(location.search);
            const accessToken = query.get("access_token");
            const tokenType = query.get("token_type");
            const userData = query.get("user");

            console.log('accessToken:', accessToken);
            console.log('tokenType:', tokenType);
            console.log('userData:', userData);

            if (accessToken && tokenType && userData) {
                try {
                    localStorage.setItem("access_token", accessToken);
                    localStorage.setItem("token_type", tokenType);
                    localStorage.setItem("user_data", decodeURIComponent(userData));

                    showSuccessAlert('Thành công!', 'Đăng nhập thành công.');
                    window.location.href = '/'; // Điều hướng đến trang chính của ứng dụng
                } catch (error) {
                    showErrorAlert('Lỗi!', 'Có lỗi xảy ra khi lưu thông tin.');
                    console.error('Error storing data:', error);
                }
            } else {
                showErrorAlert('Lỗi!', 'Đăng nhập Google thất bại');
            }
        };

        handleGoogleResponse();
    }, [location]);

    return <div>Đang xử lý đăng nhập Google...</div>;
};

export default GoogleCallback;
