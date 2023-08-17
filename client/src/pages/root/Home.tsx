import React from "react";
import Categories from "../../components/common/Categories";
import BestGearSection from "./BestGearSection";
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
