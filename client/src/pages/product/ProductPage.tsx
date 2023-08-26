import api from "@/api/api";
import { Link } from "@/components/common/Link";
import {
  TypographyNewProduct,
  TypographyParagraph,
  TypographyProductSubHeader,
  TypographySubHeader,
} from "@/components/common/Typography";
import { AnimatedProgressIcon } from "@/components/icons/Icons";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";

const ProductPage: React.FC = () => {
  const { productSlug } = useParams();
  const navigate = useNavigate();
  const { isLoading, data } = useQuery<FullProduct>(
    `products/${productSlug}`,
    () => api.get(`/products/${productSlug}`) as Promise<FullProduct>,
  );
  const { toast } = useToast();

  const [quantity, setQuantity] = useState(1);

  return (
    <>
      <div className="container mt-[89px] px-6 sm:px-10">
        <Link
          variant="go-back"
          onClick={() => navigate(-1)}
          className="mb-6 block pt-4 sm:pt-8 lg:mb-[3.5rem] lg:pt-20"
        >
          Go Back
        </Link>
        {isLoading || !data ? (
          <div className="flex w-full items-center justify-center p-8 sm:p-10">
            <TypographySubHeader>
              <AnimatedProgressIcon className="inline stroke-black" />
            </TypographySubHeader>
          </div>
        ) : (
          <div className="space-y-[5.5rem]">
            <div className="flex flex-col gap-y-8 sm:flex-row sm:items-center sm:justify-between sm:gap-1">
              <picture>
                <source
                  media="(min-width: 1024px)"
                  srcSet={`/product-${productSlug}/desktop/image-product.jpg`}
                />
                <source
                  media="(min-width: 640px)"
                  srcSet={`/product-${productSlug}/tablet/image-product.jpg`}
                />
                <img
                  src={`/product-${productSlug}/mobile/image-product.jpg`}
                  alt={data?.name}
                  className="w-full rounded-lg sm:max-h-[30rem] lg:max-h-[35rem]"
                />
              </picture>
              <div className="min-w-4 hidden max-w-[5rem] flex-1 sm:block lg:max-w-[8rem]" />
              <div className="space-y-6 sm:flex-[4]">
                {data?.new && (
                  <TypographyNewProduct className="">
                    New Product
                  </TypographyNewProduct>
                )}
                <p className="max-w-[15ch] text-[1.75rem] font-bold uppercase tracking-[0.0625rem] lg:text-[2.5rem] lg:leading-[2.75rem] lg:tracking-[0.08931rem]">
                  {data?.name}
                </p>
                <TypographyParagraph className="max-w-prose">
                  {data?.description}
                </TypographyParagraph>
                <p className="text-lg font-bold uppercase tracking-[0.08038rem]">
                  £{Number(data?.price).toLocaleString()}
                </p>
                <div className="flex items-center gap-4">
                  <div className="relative  flex h-12 w-[7.5rem] items-center bg-gray-100 align-middle">
                    <button
                      className="absolute px-4 py-3 font-bold opacity-75 hover:opacity-100 disabled:opacity-25"
                      onClick={() => {
                        if (quantity > 1) {
                          setQuantity(Math.min(quantity - 1, 10));
                        }
                      }}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      className="w-full bg-inherit text-center"
                      value={quantity}
                      max={10}
                      min={1}
                      onChange={(e) => {
                        setQuantity(Number(e.target.value));
                      }}
                    />
                    <button
                      className="absolute right-0 px-4 py-3 font-bold opacity-75 hover:opacity-100 disabled:opacity-25"
                      onClick={() => {
                        if (quantity < 10)
                          setQuantity(Math.max(1, quantity + 1));
                      }}
                      disabled={quantity >= 10}
                    >
                      +
                    </button>
                  </div>
                  <Button
                    variant="default"
                    onClick={() => {
                      if (quantity < 1 || quantity > 10) {
                        setQuantity(Math.min(Math.max(1, quantity), 10));
                        toast({
                          variant: "destructive",
                          description: "Quantity must be between 1 and 10.",
                        });
                        return;
                      }
                    }}
                  >
                    Add to cart
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-y-[5.5rem] lg:flex-row lg:justify-between lg:gap-x-8">
              <div>
                <TypographyProductSubHeader className="mb-6 sm:mb-8">
                  Features
                </TypographyProductSubHeader>
                <TypographyParagraph className="max-w-prose whitespace-pre-wrap">
                  {data?.features}
                </TypographyParagraph>
              </div>
              <div className="hidden lg:block" />
              <div className="flex flex-col gap-y-6 sm:flex-row lg:flex-col">
                <TypographyProductSubHeader className="sm:min-w-[50%] lg:min-w-min">
                  In the box
                </TypographyProductSubHeader>
                <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-2">
                  {data?.boxContents.map((item) => (
                    <>
                      <span className="text-[0.9375rem] font-bold leading-[1.5625rem] text-accent">
                        {item.quantity}x
                      </span>
                      <TypographyParagraph>{item.item}</TypographyParagraph>
                    </>
                  ))}
                </div>
              </div>
              <div className="hidden lg:block" />
            </div>
            <div />
          </div>
        )}
      </div>
    </>
  );
};

export default ProductPage;
