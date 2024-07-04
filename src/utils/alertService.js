// src/alertService.js
import Swal from 'sweetalert2';

export const showSuccessAlert = (title, text) => {
  Swal.fire({
    title,
    text,
    icon: 'success',
    confirmButtonText: 'OK'
  });
};

export const showErrorAlert = (title, text) => {
  Swal.fire({
    title,
    text,
    icon: 'error',
    confirmButtonText: 'OK'
  });
};

export const showWarningAlert = (title, text) => {
  Swal.fire({
    title,
    text,
    icon: 'warning',
    confirmButtonText: 'OK'
  });
};

export const showConfirmationAlert = (title, text, confirmCallback) => {
  Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, confirm it!'
  }).then((result) => {
    if (result.isConfirmed) {
      confirmCallback();
      Swal.fire(
        'Confirmed!',
        'Your action has been confirmed.',
        'success'
      );
    }
  });
};
