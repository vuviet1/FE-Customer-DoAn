import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./views/customer/home";
import Contact from "./views/customer/contact";
import Blog from "./views/customer/blog";
import BlogDetail from "./views/customer/blog-detail";
import Tracking from "./views/customer/tracking";
import Category from "./views/customer/category";
import Cart from "./views/customer/cart";
import Checkout from "./views/customer/checkout";
import ProductDetail from "./views/customer/product-detail";

import Login from "./views/login/login";
import Register from "./views/login/register";
import Forgot from "./views/login/forgot";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog-detail" element={<BlogDetail />} />
        <Route path="/tracking" element={<Tracking />} />
        <Route path="/category" element={<Category />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/product-detail" element={<ProductDetail />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<Forgot />} />
      </Routes>
    </Router>
  );
}

export default App;
