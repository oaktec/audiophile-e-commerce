import React from "react";
import { useParams } from "react-router-dom";

const ProductPage: React.FC = () => {
  const { productSlug } = useParams();

  return (
    <>
      <div className="container mt-40">
        Welcome to product page for {productSlug}
      </div>
    </>
  );
};

export default ProductPage;
