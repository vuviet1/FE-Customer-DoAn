/* eslint-disable no-undef */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Đăng nhập đăng ký
import Login from "./views/login/login";
import Register from "./views/login/register";
import Forgot from "./views/login/forgot";

// Customer
import Home from "./views/customer/home";
import Product from './views/customer/product';
import ProductDetail from './views/customer/product-detail';
import ShoppingCart from './views/customer/shopping-cart';
import Contact from './views/customer/contact';
import About from './views/customer/about';
import Order from './views/customer/order';
import Account from './views/customer/account';
import Favorite from './views/customer/favorite';

// Admin
import HomeAdmin from "./views/admin/home";
import AdminAdmin from "./views/admin/Admin";
import BrandAdmin from "./views/admin/Brand";
import CategoryAdmin from "./views/admin/Category";
import ColorAdmin from "./views/admin/Color";
import CustomerAdmin from "./views/admin/Customer";
import OrderAdmin from "./views/admin/Order";
import PaymentAdmin from "./views/admin/Payment";
import ProductAdmin from "./views/admin/Product";
import ShippingAdmin from "./views/admin/Shipping";
import SizeAdmin from "./views/admin/Size";
import VoucherAdmin from "./views/admin/Voucher";
import ProfileAdmin from "./views/admin/profile";

// Utils
import ProtectedRoute from "./views/admin/components/ProtectedRoute";
import ScriptManager from './utils/ScriptManager';
import StyleManager from './utils/StyleManager';
import ReloadWrapper from './utils/ReloadWrapper';

const App = () => {

  return (
    <Router>
      <Routes>
        {/* Login Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<Forgot />} />

        {/* Customer Route */}
        {customerRoutes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={
              <ReloadWrapper element={
                <>
                  <StyleManager urls={customerStyles} idPrefix="customer" />
                  <ScriptManager urls={customerScripts} idPrefix="customer" />
                  {element}
                </>
              } />
            } />
        ))}

        {/* Admin Routes */}
        {adminRoutes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute>
                <>
                  <StyleManager urls={adminStyles} idPrefix="admin" />
                  <ScriptManager urls={adminScripts} idPrefix="admin" />
                  {element}
                </>
              </ProtectedRoute>
            }
          />
        ))}
      </Routes>
    </Router>
  );
};

export default App;

// Custom routes
const customerRoutes = [
  { path: '/', element: <Home /> },
  { path: '/product', element: <Product /> },
  { path: '/shopping-cart', element: <ShoppingCart /> },
  { path: '/order', element: <Order /> },
  { path: '/contact', element: <Contact /> },
  { path: '/product-detail', element: <ProductDetail /> },
  { path: '/about', element: <About /> },
  { path: '/account', element: <Account /> },
  { path: '/favorite', element: <Favorite /> },
];

// Define script and style URLs
export const customerScripts = [
  "assets/customer/vendor/jquery/jquery-3.2.1.min.js",
  "assets/customer/vendor/animsition/js/animsition.min.js",
  "assets/customer/vendor/bootstrap/js/popper.js",
  "assets/customer/vendor/bootstrap/js/bootstrap.min.js",
  "assets/customer/vendor/select2/select2.min.js",
  "assets/customer/vendor/daterangepicker/moment.min.js",
  "assets/customer/vendor/daterangepicker/daterangepicker.js",
  "assets/customer/vendor/slick/slick.min.js",
  "assets/customer/js/slick-custom.js",
  "assets/customer/vendor/parallax100/parallax100.js",
  "assets/customer/vendor/MagnificPopup/jquery.magnific-popup.min.js",
  "assets/customer/vendor/isotope/isotope.pkgd.min.js",
  "assets/customer/vendor/sweetalert/sweetalert.min.js",
  "assets/customer/vendor/perfect-scrollbar/perfect-scrollbar.min.js",
  "assets/customer/js/main.js",
];

export const customerStyles = [
  "assets/customer/vendor/bootstrap/css/bootstrap.min.css",
  "assets/customer/fonts/font-awesome-4.7.0/css/font-awesome.min.css",
  "assets/customer/fonts/iconic/css/material-design-iconic-font.min.css",
  "assets/customer/fonts/linearicons-v1.0.0/icon-font.min.css",
  "assets/customer/vendor/animate/animate.css",
  "assets/customer/vendor/css-hamburgers/hamburgers.min.css",
  "assets/customer/vendor/animsition/css/animsition.min.css",
  "assets/customer/vendor/select2/select2.min.css",
  "assets/customer/vendor/daterangepicker/daterangepicker.css",
  "assets/customer/vendor/slick/slick.css",
  "assets/customer/vendor/MagnificPopup/magnific-popup.css",
  "assets/customer/vendor/perfect-scrollbar/perfect-scrollbar.css",
  "assets/customer/css/util.css",
  "assets/customer/css/main.css",
  "assets/customer/css/detail.css",
  "assets/customer/css/product.css",
  "assets/customer/css/filter.css",
];

// Admin routes
const adminRoutes = [
  { path: '/admin-home', element: <HomeAdmin /> },
  { path: '/admin-admin', element: <AdminAdmin /> },
  { path: '/admin-brand', element: <BrandAdmin /> },
  { path: '/admin-category', element: <CategoryAdmin /> },
  { path: '/admin-color', element: <ColorAdmin /> },
  { path: '/admin-customer', element: <CustomerAdmin /> },
  { path: '/admin-order', element: <OrderAdmin /> },
  { path: '/admin-payment', element: <PaymentAdmin /> },
  { path: '/admin-product', element: <ProductAdmin /> },
  { path: '/admin-shipping', element: <ShippingAdmin /> },
  { path: '/admin-size', element: <SizeAdmin /> },
  { path: '/admin-voucher', element: <VoucherAdmin /> },
  { path: '/admin-profile', element: <ProfileAdmin /> },
];

const adminScripts = [
  "assets/admin/vendors/jquery/jquery.min.js",
  "assets/admin/vendors/jquery-easing/jquery.easing.min.js",
  "assets/admin/vendors/bootstrap/js/bootstrap.bundle.min.js",
  "assets/admin/js/ruang-admin.js",
];

const adminStyles = [
  "assets/admin/vendors/fontawesome-free/css/all.min.css",
  "assets/admin/vendors/bootstrap/css/bootstrap.min.css",
  "assets/admin/css/ruang-admin.min.css",
  "assets/admin/vendors/datatables/dataTables.bootstrap4.min.css",
];