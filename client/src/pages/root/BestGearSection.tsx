import { FC } from "react";

import DesktopBestGearImage from "@/assets/shared/desktop/image-best-gear.jpg";
import MobileBestGearImage from "@/assets/shared/mobile/image-best-gear.jpg";
import TabletBestGearImage from "@/assets/shared/tablet/image-best-gear.jpg";
import {
  TypographyDescription,
  TypographySubHeader,
} from "@/components/common/Typography";

const BestGearSection: FC = () => {
  return (
    <div className="container my-[7.5rem] flex flex-col items-center gap-10 px-6 sm:my-24 sm:gap-16 sm:px-10 lg:flex-row-reverse lg:justify-between lg:gap-6">
      <div className="lg:w-1/2">
        <img
          className="block aspect-square rounded-lg object-cover sm:hidden"
          src={MobileBestGearImage}
        />
        <img
          className="hidden rounded-lg object-cover sm:block lg:hidden"
          src={TabletBestGearImage}
        />
        <img
          className="hidden w-full rounded-lg object-cover lg:block"
          src={DesktopBestGearImage}
        />
      </div>
      <div className="lg:ml-auto lg:w-1/2">
        <div className="flex max-w-prose flex-col gap-8 lg:max-w-[50ch]">
          <TypographySubHeader className="text-center tracking-[0.0625rem] sm:text-[2.5rem] sm:tracking-[0.08931] lg:text-left">
            Bringing you the <span className="text-accent">best</span> audio
            gear
          </TypographySubHeader>
          <TypographyDescription className="text-center leading-[1.5625rem] text-black opacity-50 lg:max-w-prose lg:text-left">
            Located at the heart of New York City, Audiophile is the premier
            store for high end headphones, earphones, speakers, and audio
            accessories. We have a large showroom and luxury demonstration rooms
            available for you to browse and experience a wide range of our
            products. Stop by our store to meet some of the fantastic people who
            make Audiophile the best place to buy your portable audio equipment.
          </TypographyDescription>
        </div>
      </div>
    </div>
  );
};

export default BestGearSection;
