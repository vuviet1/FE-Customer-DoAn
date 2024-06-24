import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    const handleLogout = () => {
        // Xóa token khỏi localStorage
        localStorage.removeItem("access_token");
        localStorage.removeItem("token_type");
        localStorage.removeItem("user_data");

        // Điều hướng đến trang đăng nhập
        window.location.href = '/'
    };

    return (
        <>
            {/* Modal Logout */}
            <div
                className="modal fade"
                id="logoutModal"
                tabIndex={-1}
                role="dialog"
                aria-labelledby="exampleModalLabelLogout"
                aria-hidden="true"
            >
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5
                                className="modal-title"
                                id="exampleModalLabelLogout"
                            >
                                Thoát chương trình
                            </h5>
                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                            >
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Bạn có chắc là muốn thoát khỏi phiên làm việc?</p>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-outline-primary"
                                data-dismiss="modal"
                            >
                                Hủy bỏ
                            </button>
                            <Link className="btn btn-danger" onClick={handleLogout}>
                                Đăng xuất
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            {/* Footer */}
            <footer className="sticky-footer bg-white">
                <div className="container my-auto">
                    <div className="copyright text-center my-auto">
                        <span>Copyright © , All rights Reserved</span>
                    </div>
                </div>
            </footer>
            {/* Footer */}
        </>
    );
};
export default Footer;
