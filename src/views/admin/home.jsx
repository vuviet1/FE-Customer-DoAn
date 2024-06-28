/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import Topbar from "./components/topbar";
import Footer from "./components/footer";
import request from "../../utils/request";
import { getErrorMessage } from "../../utils/errorMessages";
import loadLineChart from "./chart-line.js";  // Import the function to load the line chart

function HomeAdmin() {
    const [profit, setProfit] = useState([]);

    const fetchProfit = async () => {
        try {
            const response = await request.get("get-profit");
            console.log(response.data.data);
            setProfit(response.data.data);
        } catch (error) {
            let errorMessage = "Hiển thị doanh thu thất bại: ";
            if (error.response && error.response.status) {
                errorMessage += getErrorMessage(error.response.status);
            } else {
                errorMessage += error.message;
            }
            toast.error(errorMessage, {
                position: "top-right",
            });
        }
    };

    useEffect(() => {
        fetchProfit();
        loadLineChart();
    }, []);

    const handleScrollToTop = (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <>
            <ToastContainer />
            <div id="wrapper">
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        <Topbar />
                        <div className="container-fluid" id="container-wrapper">
                            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                <h1 className="h3 mb-0 text-gray-800">
                                    Bảng điều khiển
                                </h1>
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link to="/">Trang chủ</Link>
                                    </li>
                                    <li
                                        className="breadcrumb-item active"
                                        aria-current="page"
                                    >
                                        Bảng điều khiển
                                    </li>
                                </ol>
                            </div>
                            <div className="row mb-3">
                                {/* Earnings (Monthly) Card Example */}
                                <div className="col-xl-3 col-md-6 mb-4">
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <div className="row align-items-center">
                                                <div className="col mr-2">
                                                    <div className="text-xs font-weight-bold text-uppercase mb-1">
                                                        Doanh thu (Tháng)
                                                    </div>
                                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                                        $40,000
                                                    </div>
                                                    <div className="mt-2 mb-0 text-muted text-xs">
                                                        <span className="text-success mr-2">
                                                            <i className="fa fa-arrow-up" />{" "}
                                                            3.48%
                                                        </span>
                                                        <span>
                                                            Since last month
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="col-auto">
                                                    <i className="fas fa-calendar fa-2x text-primary" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Earnings (Annual) Card Example */}
                                <div className="col-xl-3 col-md-6 mb-4">
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <div className="row no-gutters align-items-center">
                                                <div className="col mr-2">
                                                    <div className="text-xs font-weight-bold text-uppercase mb-1">
                                                        Hóa đơn (Tháng)
                                                    </div>
                                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                                        650
                                                    </div>
                                                    <div className="mt-2 mb-0 text-muted text-xs"></div>
                                                </div>
                                                <div className="col-auto">
                                                    <i className="fas fa-shopping-cart fa-2x text-success" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* New User Card Example */}
                                <div className="col-xl-3 col-md-6 mb-4">
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <div className="row no-gutters align-items-center">
                                                <div className="col mr-2">
                                                    <div className="text-xs font-weight-bold text-uppercase mb-1">
                                                        Người dùng mới (Tháng)
                                                    </div>
                                                    <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                                                        366
                                                    </div>
                                                    <div className="mt-2 mb-0 text-muted text-xs"></div>
                                                </div>
                                                <div className="col-auto">
                                                    <i className="fas fa-users fa-2x text-info" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Pending Requests Card Example */}
                                <div className="col-xl-3 col-md-6 mb-4">
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <div className="row no-gutters align-items-center">
                                                <div className="col mr-2">
                                                    <div className="text-xs font-weight-bold text-uppercase mb-1">
                                                        Hóa đơn đang chờ duyệt
                                                    </div>
                                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                                        18
                                                    </div>
                                                    <div className="mt-2 mb-0 text-muted text-xs"></div>
                                                </div>
                                                <div className="col-auto">
                                                    <i className="fas fa-comments fa-2x text-warning" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Line Chart */}
                                <div className="col-xl col-lg-7">
                                    <div className="card mb-4">
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h6 className="m-0 font-weight-bold text-primary">
                                                Doanh thu theo tháng
                                            </h6>
                                        </div>
                                        <div className="card-body">
                                            <div className="chart-line">
                                                <canvas id="myLineChart" width="500" height="500"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Footer />
                    </div>
                </div>
                <a
                    href="#page-top"
                    className="scroll-to-top rounded scroll-to-top"
                    onClick={handleScrollToTop}
                >
                    <i className="fas fa-angle-up" />
                </a>
            </div>
        </>
    );
}

export default HomeAdmin;
