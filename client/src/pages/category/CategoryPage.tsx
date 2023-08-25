import React from "react";
import { useParams } from "react-router-dom";

const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams();

  return (
    <>
      <div className="mt-[89px] flex w-full items-center justify-center bg-dark-background p-8 sm:min-h-[12rem]">
        <h2 className="text-[1.75rem] font-bold uppercase tracking-[0.125rem] text-white sm:text-[2.5rem] sm:leading-[2.75rem] sm:tracking-[0.08931rem]">
          {categorySlug}
        </h2>
      </div>
      <div className="container"></div>
    </>
  );
};

export default CategoryPage;
