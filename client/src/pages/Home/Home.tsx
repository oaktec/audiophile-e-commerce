import React from "react";
import Categories from "./Categories";
import Hero from "./Hero";
import ProductGallery from "./ProductGallery";

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <Categories />
      <ProductGallery />
    </>
  );
};

export default Home;
