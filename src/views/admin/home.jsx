/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import Topbar from "./components/topbar";
import Footer from "./components/footer";
import request from "../../utils/request";
import { getErrorMessage } from "../../utils/errorMessages";
import loadLineChart from "./chart-line.js"; // Import the function to load the line chart

function HomeAdmin() {
    const [report, setReport] = useState([]);
    // const [profit, setProfit] = useState([]);

    const fetchReport = async () => {
        try {
            const response = await request.get("report");
            console.log(response.data.data);
            setReport(response.data.data);
        } catch (error) {
            let errorMessage = "Hiển thị báo cáo thất bại: ";
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

    // const fetchProfit = async () => {
    //     try {
    //         const response = await request.get("get-profit");
    //         console.log(response.data.data);
    //         setProfit(response.data.data);
    //     } catch (error) {
    //         let errorMessage = "Hiển thị doanh thu thất bại: ";
    //         if (error.response && error.response.status) {
    //             errorMessage += getErrorMessage(error.response.status);
    //         } else {
    //             errorMessage += error.message;
    //         }
    //         toast.error(errorMessage, {
    //             position: "top-right",
    //         });
    //     }
    // };

    useEffect(() => {
        fetchReport()
        // fetchProfit();
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
                                {/* Doanh thu theo tháng */}
                                <div className="col-xl-3 col-md-6 mb-4">
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <div className="row align-items-center">
                                                <div className="col mr-2">
                                                    <div className="text-xs font-weight-bold text-uppercase mb-1">
                                                        Doanh thu (Tháng)
                                                    </div>
                                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                                        {typeof report.monthly_profit ===
                                                        "number"
                                                            ? report.monthly_profit.toLocaleString(
                                                                  "vi-VN",
                                                                  {
                                                                      style: "currency",
                                                                      currency:
                                                                          "VND",
                                                                  }
                                                              )
                                                            : "Invalid profit value"}
                                                    </div>
                                                </div>
                                                <div className="col-auto">
                                                    <i className="fas fa-calendar fa-2x text-primary" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Số hóa đơn trong tháng */}
                                <div className="col-xl-3 col-md-6 mb-4">
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <div className="row no-gutters align-items-center">
                                                <div className="col mr-2">
                                                    <div className="text-xs font-weight-bold text-uppercase mb-1">
                                                        Hóa đơn (Tháng)
                                                    </div>
                                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                                        {report.orders_count}
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
                                {/* Người dùng mới của tháng */}
                                <div className="col-xl-3 col-md-6 mb-4">
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <div className="row no-gutters align-items-center">
                                                <div className="col mr-2">
                                                    <div className="text-xs font-weight-bold text-uppercase mb-1">
                                                        Người dùng mới (Tháng)
                                                    </div>
                                                    <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                                                        {report.new_users_count}
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
                                {/* Số hóa đơn chờ duyệt */}
                                <div className="col-xl-3 col-md-6 mb-4">
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <div className="row no-gutters align-items-center">
                                                <div className="col mr-2">
                                                    <div className="text-xs font-weight-bold text-uppercase mb-1">
                                                        Hóa đơn đang chờ duyệt
                                                    </div>
                                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                                        {report.pending_invoices_count}
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
                                                <canvas
                                                    id="myLineChart"
                                                    width="500"
                                                    height="500"
                                                />
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
