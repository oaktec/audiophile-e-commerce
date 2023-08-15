import React from "react";

const Home: React.FC = () => {
  return (
    <div className="h-[600px] w-full bg-dark-background sm:h-[729px]">
      <div className="container relative flex h-full w-full items-center justify-center overflow-hidden">
        <div className="bg-tablet-header absolute inset-0 left-1/2 w-[750px] -translate-x-1/2 transform bg-contain bg-center bg-no-repeat opacity-50 lg:left-auto lg:translate-x-12" />
        <div className="flex flex-col">
          <span>New product</span>
          <span>XX99 Mark II Headphones</span>
          <span>
            Experience natural, lifelike audio and exceptional build quality
            made for the passionate music enthusiast.
          </span>
          <span>See product</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
