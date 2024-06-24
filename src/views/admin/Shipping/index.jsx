import React, { useEffect, useState, Fragment } from "react";
import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import database from "../components/database";
import Topbar from "../components/topbar";
import Footer from "../components/footer";
import request from "../../../utils/request";

import AddShippingModal from "./modal-add";
import EditShippingModal from "./modal-edit";

function ShippingAdmin() {
    const [shippings, setShippings] = useState([]);
    const [selectedShippingId, setSelectedShippingId] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await request.get("shipping");
                setShippings(response.data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        let table;
        if (shippings && shippings.length > 0) {
            table = database.initializeDataTable("#dataTableHover");
        }
        return () => {
            if (table) {
                table.destroy();
            }
        };
    }, [shippings]);

    const handleEditButtonClick = (shipping_method_id) => {
        setSelectedShippingId(shipping_method_id);
        setShowEditModal(true);
    };

    const handleAddShipping = () => {
        setShowAddModal(false);
        window.location.reload();
    };

    const handleUpdateShipping = () => {
        setSelectedShippingId(null);
        setShowEditModal(false);
        window.location.reload();
    };

    const deleteShipping = async (shipping_method_id) => {
        if (window.confirm("Bạn có chắc muốn xóa phương thức vận chuyển này không?")) {
            try {
                await request.delete(`shipping/${shipping_method_id}`);
                window.location.reload(); // Reload trang sau khi xóa
            } catch (error) {
                console.error("Error deleting shipping:", error);
            }
        }
    };

    const ShippingTableBody = ({ shippings, handleEditButtonClick, deleteShipping }) => {
        if (!shippings || shippings.length === 0) {
            return (
                <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                        Không có dữ liệu
                    </td>
                </tr>
            );
        }

        return (
            <tbody>
                {shippings.map((shipping, index) => (
                    <tr key={index}>
                        <td style={{ textAlign: "left" }}>{shipping.shipping_method}</td>
                        <td style={{ textAlign: "left" }}>
                            {shipping.status === 1 ? (
                                <span className="badge badge-success">Sử dụng</span>
                            ) : (
                                <span className="badge badge-danger">Không sử dụng</span>
                            )}
                        </td>
                        <td style={{ textAlign: "center" }}>
                            <Button
                                variant="success"
                                onClick={() => handleEditButtonClick(shipping.shipping_method_id)}
                                style={{ marginRight: "5px" }}
                            >
                                <i className="far fa-edit" />
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => deleteShipping(shipping.shipping_method_id)}
                            >
                                <i className="fas fa-trash" />
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        );
    };

    return (
        <Fragment>
            <div id="wrapper">
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        <Topbar />

                        <div className="container-fluid" id="container-wrapper">
                            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                <h1 className="h3 mb-0 text-gray-800">Phương thức vận chuyển</h1>
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link to={"/admin-home"}>Home</Link>
                                    </li>
                                    <li className="breadcrumb-item">Danh mục quản lý</li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        Phương thức vận chuyển
                                    </li>
                                </ol>
                            </div>

                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="card mb-4">
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h6 className="m-0 font-weight-bold text-primary">
                                                Phương thức vận chuyển
                                            </h6>
                                            <Button
                                                variant="primary"
                                                onClick={() => setShowAddModal(true)}
                                            >
                                                <i className="fas fa-plus" /> Thêm mới
                                            </Button>
                                        </div>
                                        <div className="table-responsive p-3">
                                            <Table
                                                className="table align-items-center table-flush table-hover"
                                                id="dataTableHover"
                                            >
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th style={{ textAlign: "left" }}>Tên phương thức</th>
                                                        <th style={{ textAlign: "left" }}>Trạng thái</th>
                                                        <th style={{ textAlign: "center" }}>Hành động</th>
                                                    </tr>
                                                </thead>
                                                <ShippingTableBody
                                                    shippings={shippings}
                                                    handleEditButtonClick={handleEditButtonClick}
                                                    deleteShipping={deleteShipping}
                                                />
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <AddShippingModal show={showAddModal} handleClose={() => setShowAddModal(false)} onAddShipping={handleAddShipping} />
                            {selectedShippingId && (
                                <EditShippingModal
                                    show={showEditModal}
                                    handleClose={() => setShowEditModal(false)}
                                    selectedShippingId={selectedShippingId}
                                    onUpdateShipping={handleUpdateShipping}
                                />
                            )}
                        </div>
                        <Footer />
                    </div>
                </div>
                <a href="#page-top" className="scroll-to-top rounded" onClick={(e) => {e.preventDefault(); window.scrollTo({top: 0, behavior: "smooth"})}}>
                    <i className="fas fa-angle-up" />
                </a>
            </div>
        </Fragment>
    );
}

export default ShippingAdmin;
