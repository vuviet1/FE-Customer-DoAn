// src/utils/AlertContext.js
import React, { createContext, useContext } from 'react';
import {
  showSuccessAlert,
  showErrorAlert,
  showWarningAlert,
  showConfirmationAlert
} from './alertService';

// Tạo context
const AlertContext = createContext();

// Tạo provider để bọc toàn bộ ứng dụng
export const AlertProvider = ({ children }) => {
  return (
    <AlertContext.Provider value={{ showSuccessAlert, showErrorAlert, showWarningAlert, showConfirmationAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

// Hook để sử dụng context
export const useAlert = () => {
  return useContext(AlertContext);
};
