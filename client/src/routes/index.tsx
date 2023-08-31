import Layout from "@/components/layout/Layout";
import CategoryPage from "@/pages/category/CategoryPage";
import CheckoutPage from "@/pages/checkout/CheckoutPage";
import Login from "@/pages/login/Login";
import ProductPage from "@/pages/product/ProductPage";
import Home from "@/pages/root/Home";
import SignUp from "@/pages/signup/SignUp";
import React from "react";
import { Route, Routes } from "react-router-dom";

const Router: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="category/:categorySlug" element={<CategoryPage />} />
        <Route path="product/:productSlug" element={<ProductPage />} />
      </Route>

      <Route path="/" element={<Layout isForm />}>
        <Route path="checkout" element={<CheckoutPage />}>
          <Route path="success" />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
      </Route>
    </Routes>
  );
};

export default Router;
