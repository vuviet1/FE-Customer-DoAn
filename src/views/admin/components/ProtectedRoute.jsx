import React, { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        const checkAuth = () => {
            const userData = JSON.parse(localStorage.getItem("user_data"));
            
            if (userData && userData.role === 1) {
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
                if (!window.location.href.includes("login")) {
                    window.alert("Bạn không có quyền đăng nhập vào trang này!");
                    window.location.href = "/login";
                }
            }
        };

        checkAuth();
    }, []);

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    if (isAuthorized === false) {
        return null;
    }

    return children;
};

export default ProtectedRoute;
