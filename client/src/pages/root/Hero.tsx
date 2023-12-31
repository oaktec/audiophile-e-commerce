import { Link } from "@/components/common/Link";
import {
  TypographyDescription,
  TypographyHeader,
} from "@/components/common/Typography";
import { HIGHLIGHTED_PRODUCTS } from "@/config/config";

const Hero = () => (
  <div className="h-[600px] w-full bg-dark-background sm:h-[729px]">
    <div className="container relative flex h-full w-full items-center justify-center overflow-hidden px-6 sm:px-10 lg:justify-start">
      <div className="soften-edges-to-dark-background absolute inset-0 left-1/2 w-[750px] -translate-x-1/2 bg-tablet-header bg-contain bg-center bg-no-repeat opacity-50 lg:left-auto lg:translate-x-12 lg:opacity-100" />
      <div className="z-10 flex max-w-sm flex-col items-center gap-4 sm:gap-6 lg:items-start">
        <span className="font-manrope text-sm uppercase tracking-[10px] text-white opacity-50">
          New product
        </span>
        <TypographyHeader className="text-center lg:text-left">
          {HIGHLIGHTED_PRODUCTS[0]?.name || "Product name"}
        </TypographyHeader>
        <TypographyDescription className="text-center lg:text-left">
          {HIGHLIGHTED_PRODUCTS[0]?.description || "Product description"}
        </TypographyDescription>
        <Link
          variant="button"
          href={`/product/${HIGHLIGHTED_PRODUCTS[0]?.slug || ""}`}
        >
          See product
        </Link>
      </div>
    </div>
  </div>
);

export default Hero;
