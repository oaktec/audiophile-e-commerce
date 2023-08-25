import api from "@/api/api";
import Categories from "@/components/common/Categories";
import { Link } from "@/components/common/Link";
import {
  TypographyNewProduct,
  TypographyParagraph,
  TypographyProductTitle,
  TypographySubHeader,
} from "@/components/common/Typography";
import { AnimatedProgressIcon } from "@/components/icons/Icons";
import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import BestGearSection from "../root/BestGearSection";

const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams();
  const { isLoading, data } = useQuery<Product[]>(
    `products/category/${categorySlug}`,
    () => api.get(`/products?category=${categorySlug}`) as Promise<Product[]>,
  );

  return (
    <>
      <div className="mt-[89px] flex w-full items-center justify-center bg-dark-background p-8 sm:min-h-[12rem]">
        <h2 className="text-[1.75rem] font-bold uppercase tracking-[0.125rem] text-white sm:text-[2.5rem] sm:leading-[2.75rem] sm:tracking-[0.08931rem]">
          {categorySlug}
        </h2>
      </div>
      <div className="container px-6 sm:px-10">
        {isLoading || !data ? (
          <div className="flex w-full items-center justify-center p-8 sm:p-10">
            <TypographySubHeader>
              <AnimatedProgressIcon className="inline stroke-black" />
            </TypographySubHeader>
          </div>
        ) : (
          <div className="mb-[7.5rem] mt-16 space-y-28 sm:mt-[7.5rem] lg:mb-40">
            {data
              .slice(0)
              .reverse()
              .map((product, index) => {
                return (
                  <div
                    key={product.id}
                    className={`flex flex-col text-center lg:items-center lg:justify-center lg:text-left ${
                      index % 2 ? "lg:flex-row-reverse" : "lg:flex-row"
                    }`}
                  >
                    <picture>
                      <source
                        media="(min-width: 1024px)"
                        srcSet={`/product-${product.slug}/desktop/image-category-page-preview.jpg`}
                      />
                      <source
                        media="(min-width: 640px)"
                        srcSet={`/product-${product.slug}/tablet/image-category-page-preview.jpg`}
                      />
                      <img
                        src={`/product-${product.slug}/mobile/image-category-page-preview.jpg`}
                        alt={product.name}
                        loading="lazy"
                        className="mb-8 rounded-lg object-cover sm:mb-[3.25rem] lg:mb-0 lg:max-w-[min(35rem,40vw,50vh)]"
                      />
                    </picture>
                    <div className="hidden min-w-[2rem] max-w-[8rem] flex-1 lg:block" />
                    <div className="flex flex-col items-center gap-y-6 sm:gap-y-4 lg:items-start">
                      {product.new && (
                        <TypographyNewProduct>New product</TypographyNewProduct>
                      )}
                      <TypographyProductTitle className="max-w-[15ch]">
                        {product.name}
                      </TypographyProductTitle>
                      <TypographyParagraph className="max-w-prose sm:mb-2 lg:max-w-[45ch]">
                        {product.description}
                      </TypographyParagraph>
                      <Link variant="button" href={`/product/${product.slug}`}>
                        See product
                      </Link>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
      <Categories className="mb-[7.5rem] lg:mb-40" />
      <BestGearSection />
    </>
  );
};

export default CategoryPage;
