import api from "@/api/api";
import { Link } from "@/components/common/Link";
import { TypographySubHeader } from "@/components/common/Typography";
import { AnimatedProgressIcon } from "@/components/icons/Icons";
import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  categoryId: number;
};

const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams();
  const { isLoading, data } = useQuery<Product[]>(
    `products/${categorySlug}`,
    () => api.get(`/products?category=${categorySlug}`) as Promise<Product[]>,
  );

  return (
    <>
      <div className="mt-[89px] flex w-full items-center justify-center bg-dark-background p-8 sm:min-h-[12rem]">
        <h2 className="text-[1.75rem] font-bold uppercase tracking-[0.125rem] text-white sm:text-[2.5rem] sm:leading-[2.75rem] sm:tracking-[0.08931rem]">
          {categorySlug}
        </h2>
      </div>
      <div className="container">
        {isLoading || !data ? (
          <div className="flex w-full items-center justify-center p-8">
            <TypographySubHeader>
              Loading products...{" "}
              <AnimatedProgressIcon className="inline stroke-black" />
            </TypographySubHeader>
          </div>
        ) : (
          data.map((product, index) => {
            return (
              <div key={product.id}>
                <img
                  src={`/product-${product.slug}/mobile/image-category-page-preview.jpg`}
                  alt={product.name}
                />
                {index === 0 && <h4>New product</h4>}
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <Link variant="button">See product</Link>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default CategoryPage;
