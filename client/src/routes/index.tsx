import Layout from "@/components/layout/Layout";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import CartPage from "@/pages/cart/CartPage";
import CategoryPage from "@/pages/category/CategoryPage";
import ProductPage from "@/pages/product/ProductPage";
import Home from "@/pages/root/Home";
import React from "react";
import { Route, Routes } from "react-router-dom";

const Router: React.FC = () => {
  return (
    <Routes>
      <Route path="/audiophile-e-commerce/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="category/:categorySlug" element={<CategoryPage />} />
        <Route path="product/:productSlug" element={<ProductPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
      </Route>
    </Routes>
  );
};

export default Router;
