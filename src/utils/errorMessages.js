const errorMessages = {
    400: "Yêu cầu không hợp lệ.",
    401: "Không được phép.",
    403: "Bị cấm.",
    404: "Không tìm thấy.",
    409: "Xung đột dữ liệu.",
    500: "Lỗi máy chủ.",
    default: "Đã xảy ra lỗi. Vui lòng thử lại sau."
};

export const getErrorMessage = (status) => {
    return errorMessages[status] || `Mã lỗi ${status}`;
};
