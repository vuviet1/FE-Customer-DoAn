import React, { useEffect, useState, Fragment } from "react"
import { Table, Button } from "react-bootstrap"
import { Link } from "react-router-dom"
import { toast } from "react-toastify";

import database from "../components/database"
import Topbar from "../components/topbar"
import Footer from "../components/footer"
import request from "../../../utils/request"
import { getErrorMessage } from "../../../utils/errorMessages"

import AddSizeModal from "./modal-add"
import EditSizeModal from "./modal-edit"

function SizeAdmin() {
    const [sizes, setSizes] = useState([])
    const [selectedSizeId, setSelectedSizeId] = useState(null)
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)

    const fetchData = async () => {
        try {
            const response = await request.get("size")
            setSizes(response.data.data)
        } catch (error) {
            let errorMessage = "Hiển thị kích cỡ thất bại: "
        if (error.response && error.response.status) {
            errorMessage += getErrorMessage(error.response.status)
        } else {
            errorMessage += error.message
        }
        toast.error(errorMessage, {
            position: "top-right"
        })
        console.error("Error fetching data:", error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        let table
        if (sizes && sizes.length > 0) {
            table = database.initializeDataTable("#dataTableHover")
        }
        return () => {
            if (table) {
                table.destroy()
            }
        }
    }, [sizes])

    const handleEditButtonClick = (size_id) => {
        setSelectedSizeId(size_id)
        setShowEditModal(true)
    }

    const handleAddSize = () => {
        setShowAddModal(false)
        fetchData()
    }

    const handleUpdateSize = () => {
        setSelectedSizeId(null)
        setShowEditModal(false)
        fetchData()
    }

    const deleteSize = async (size_id) => {
        if (window.confirm("Bạn có chắc muốn xóa kích thước này không?")) {
            try {
                await request.delete(`size/${size_id}`)
                toast.success("Xóa phương thức thanh toán thành công!", {
                    position: "top-right",
                })
                fetchData()
            } catch (error) {
                let errorMessage = "Xóa phương thức thanh toán thất bại: "
                if (error.response && error.response.status) {
                    errorMessage += getErrorMessage(error.response.status)
                } else {
                    errorMessage += error.message
                }
                toast.error(errorMessage, {
                    position: "top-right",
                })
                console.error("Xóa phương thức thất bại:", error)
            }
        }
    }

    const SizeTableBody = ({ sizes, handleEditButtonClick, deleteSize }) => {
        if (!sizes || sizes.length === 0) {
            return (
                <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                        Không có dữ liệu
                    </td>
                </tr>
            )
        }

        return (
            <tbody>
                {sizes.map((size, index) => (
                    <tr key={index}>
                        <td style={{ textAlign: "left" }}>{size.size}</td>
                        <td style={{ textAlign: "left" }}>
                            {size.status === 1 ? (
                                <span className="badge badge-success">Sử dụng</span>
                            ) : (
                                <span className="badge badge-danger">Không sử dụng</span>
                            )}
                        </td>
                        <td style={{ textAlign: "center" }}>
                            <Button
                                variant="success"
                                onClick={() => handleEditButtonClick(size.size_id)}
                                style={{ marginRight: "5px" }}
                            >
                                <i className="far fa-edit" />
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => deleteSize(size.size_id)}
                            >
                                <i className="fas fa-trash" />
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        )
    }

    return (
        <Fragment>
            <div id="wrapper">
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        <Topbar />

                        <div className="container-fluid" id="container-wrapper">
                            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                <h1 className="h3 mb-0 text-gray-800">Kích thước</h1>
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link to={"/admin-home"}>Home</Link>
                                    </li>
                                    <li className="breadcrumb-item">Danh mục quản lý</li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        Kích thước
                                    </li>
                                </ol>
                            </div>

                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="card mb-4">
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h6 className="m-0 font-weight-bold text-primary">
                                                Kích thước
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
                                                        <th style={{ textAlign: "left" }}>Kích thước</th>
                                                        <th style={{ textAlign: "left" }}>Trạng thái</th>
                                                        <th style={{ textAlign: "center" }}>Hành động</th>
                                                    </tr>
                                                </thead>
                                                <SizeTableBody
                                                    sizes={sizes}
                                                    handleEditButtonClick={handleEditButtonClick}
                                                    deleteSize={deleteSize}
                                                />
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <AddSizeModal show={showAddModal} handleClose={() => setShowAddModal(false)} onAddSize={handleAddSize} />
                            {selectedSizeId && (
                                <EditSizeModal
                                    show={showEditModal}
                                    handleClose={() => setShowEditModal(false)}
                                    selectedSizeId={selectedSizeId}
                                    onUpdateSize={handleUpdateSize}
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
    )
}

export default SizeAdmin
