import React from "react";

const Home: React.FC = () => {
  return (
    <>
      <div className="relative h-[600px] w-full overflow-hidden bg-dark-background">
        <div className="bg-tablet-header absolute inset-0 left-1/2 w-[750px] -translate-x-1/2 transform bg-contain bg-center bg-no-repeat opacity-50"></div>
      </div>
    </>
  );
};

export default Home;
