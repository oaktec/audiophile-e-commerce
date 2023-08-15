import {
  TypographyHeaderDescription,
  TypographyHeaderMain,
} from "@/components/common/Typography";
import { Button } from "@/components/ui/button";
import React from "react";

const Home: React.FC = () => {
  return (
    <div className="h-[600px] w-full bg-dark-background sm:h-[729px]">
      <div className="container relative flex h-full w-full items-center justify-center overflow-hidden lg:justify-start">
        <div className="bg-tablet-header absolute inset-0 left-1/2 w-[750px] -translate-x-1/2 transform bg-contain bg-center bg-no-repeat opacity-50 lg:left-auto lg:translate-x-12 lg:opacity-100" />
        <div className="z-10 mx-6 flex max-w-sm flex-col items-center gap-4 sm:gap-6 lg:items-start">
          <span className="font-manrope text-sm uppercase tracking-[10px] text-white opacity-50">
            New product
          </span>
          <TypographyHeaderMain className="text-center lg:text-left">
            XX99 Mark II Headphones
          </TypographyHeaderMain>
          <TypographyHeaderDescription className="text-center lg:text-left">
            Experience natural, lifelike audio and exceptional build quality
            made for the passionate music enthusiast.
          </TypographyHeaderDescription>
          <Button>See product</Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
