import React from "react";
import { useParams } from "react-router-dom";

const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams();

  return (
    <>
      <div className="container mt-40">
        Welcome to category page for {categorySlug}
      </div>
    </>
  );
};

export default CategoryPage;
