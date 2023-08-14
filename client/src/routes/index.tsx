import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import React from "react";
import { Route, Routes } from "react-router-dom";

const Router: React.FC = () => {
  return (
    <Routes>
      <Route path="/audiophile-e-commerce/" element={<Layout />}>
        <Route index element={<Home />} />
      </Route>
    </Routes>
  );
};

export default Router;
