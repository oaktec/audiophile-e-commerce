import PatternCircles from "@/assets/home/desktop/pattern-circles.svg";
import { Link } from "@/components/common/Link";
import {
  TypographyDescription,
  TypographyHeader,
} from "@/components/common/Typography";
import { HIGHLIGHTED_PRODUCTS } from "@/config/config";
import { FC, useEffect, useState } from "react";

const products = HIGHLIGHTED_PRODUCTS.slice(1, 4);

type ProductImageMap = {
  [key: string]: string;
};

const ProductGallery: FC = () => {
  const [productImages, setProductImages] = useState<ProductImageMap>({});

  useEffect(() => {
    const loadImages = async () => {
      const images: ProductImageMap = {};
      for (const product of products) {
        images[product.slug] = (
          await import(`../../assets/home/desktop/image-${product.slug}.png`)
        ).default;
      }
      setProductImages(images);
    };

    loadImages();
  }, []);

  return (
    <div className="container">
      <div className="mx-6 mb-4 mt-28 flex flex-col gap-6 md:mx-10 md:gap-8 lg:gap-12">
        {products[0] && (
          <div className="flex flex-col items-center gap-6 rounded-lg bg-accent px-6 py-14 sm:px-[20%] md:px-[25%] md:py-16 lg:relative lg:h-[35rem] lg:items-start lg:overflow-hidden lg:px-[10%] lg:pl-[62%] lg:pt-32">
            <div className="relative mb-2 w-[60%] max-w-[13rem] sm:mb-10 lg:absolute lg:-bottom-4 lg:left-[12.5%] lg:mb-0 lg:max-w-[26rem]">
              <img
                className="relative z-10"
                src={productImages[products[0].slug]}
                alt={`${products[0].name} image`}
              />
              <img
                src={PatternCircles}
                alt="Pattern Circles"
                className="absolute left-0 top-[10%] scale-[3.5] md:scale-[4.5] lg:top-[20%] lg:scale-[2.5]"
              />
            </div>
            <TypographyHeader className="px-4 text-center lg:px-0 lg:text-left">
              {products[0].name || "Product name"}
            </TypographyHeader>
            <TypographyDescription className="text-center lg:text-left">
              {products[0].description || "Product description"}
            </TypographyDescription>
            <Link
              variant="button"
              className="relative z-10 bg-black hover:bg-[#4c4c4c] md:mt-4"
              href="#"
            >
              See product
            </Link>
          </div>
        )}
        {products[1] && (
          <div className="bg-gray-100">
            {products[1].name || "Product name"}
          </div>
        )}
        {products[2] && (
          <div className="flex flex-col gap-6 md:flex-row md:gap-3 lg:gap-6">
            <div className="flex-1 bg-accent">
              image of {products[2].name || "product"}
            </div>
            <div className="flex-1 bg-gray-100">
              {products[2].name || "Product Name"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGallery;
