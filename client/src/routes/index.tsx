import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home/Home";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import React from "react";
import { Route, Routes } from "react-router-dom";

const Router: React.FC = () => {
  return (
    <Routes>
      <Route path="/audiophile-e-commerce/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
      </Route>
    </Routes>
  );
};

export default Router;
