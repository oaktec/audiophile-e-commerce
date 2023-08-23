import PatternCircles from "@/assets/home/desktop/pattern-circles.svg";
import { Link } from "@/components/common/Link";
import {
  TypographyDescription,
  TypographyHeader,
  TypographySubHeader,
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
    <div className="container overflow-hidden px-6 sm:px-10">
      <div className="mb-4 mt-28 flex flex-col gap-6 md:gap-8 lg:gap-12">
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
              variant="dark-button"
              className="relative z-10 md:mt-4"
              href={`/product/${products[0].slug}`}
            >
              See product
            </Link>
          </div>
        )}
        {products[1] && (
          <div className="relative flex h-80 flex-col justify-center gap-4 overflow-hidden rounded-lg bg-gray-300 px-8 sm:px-[10%]">
            <div
              style={{
                backgroundImage: `url(${productImages[products[1].slug]})`,
              }}
              className="absolute left-0 top-0 h-full w-full -scale-x-100 bg-no-repeat [background-position:85%_75%] [background-size:165%] sm:[background-position:50%_85%] sm:[background-size:120%] lg:[background-size:100%]"
            />
            <TypographySubHeader className="z-10 pr-8">
              {products[1].name || "Product name"}
            </TypographySubHeader>
            <Link
              variant="button"
              className="relative z-10 border border-black bg-transparent text-black hover:bg-black hover:text-white md:mt-4"
              href={`/product/${products[1].slug}`}
            >
              See product
            </Link>
          </div>
        )}
        {products[2] && (
          <div className="flex flex-col gap-6 sm:flex-row sm:gap-3 lg:gap-6">
            <a className="sm:w-1/2" href={`/product/${products[2].slug}`}>
              <div
                style={{
                  backgroundImage: `url(${productImages[products[2].slug]})`,
                }}
                className="min-h-[12.5rem] rounded-lg bg-cover bg-center bg-no-repeat sm:min-h-[20rem]"
              />
            </a>
            <div className="flex min-h-[12.5rem] flex-col justify-center gap-8 rounded-lg bg-gray-100 p-6 sm:min-h-[20rem] sm:w-1/2">
              <TypographySubHeader className="z-10 pr-8 sm:ml-[10%]">
                {products[2].name || "Product name"}
              </TypographySubHeader>
              <Link
                variant="button"
                className="relative z-10 border border-black bg-transparent text-black hover:bg-black hover:text-white sm:ml-[10%]"
                href={`/product/${products[2].slug}`}
              >
                See product
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGallery;
