import React from "react";
import BestGearSection from "./BestGearSection";
import Categories from "./Categories";
import Hero from "./Hero";
import ProductGallery from "./ProductGallery";

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <Categories />
      <ProductGallery />
      <BestGearSection />
    </>
  );
};

export default Home;
