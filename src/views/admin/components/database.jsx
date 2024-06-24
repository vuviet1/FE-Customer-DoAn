// Import necessary libraries
import $ from "jquery";
import "datatables.net";
import "datatables.net-bs4";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";

// Initialize DataTables on a specific table
function initializeDataTable(selector) {
    return $(selector).DataTable({
        language: {
            lengthMenu: "Hiển thị _MENU_ mục",
            zeroRecords: "Không tìm thấy dữ liệu",
            info: "Hiển thị _START_ đến _END_ của _TOTAL_ mục",
            infoEmpty: "Không có mục nào để hiển thị",
            infoFiltered: "(lọc từ _MAX_ tổng số mục)",
            search: "Tìm kiếm:"
        }
    });
}

// Export the initialize function
const database = {
    initializeDataTable
};
export default database;
