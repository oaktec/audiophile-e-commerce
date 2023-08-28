import api from "@/api/api";
import Categories from "@/components/common/Categories";
import { Link } from "@/components/common/Link";
import NumberInput from "@/components/common/NumberInput";
import {
  TypographyNewProduct,
  TypographyParagraph,
  TypographyProductSubHeader,
  TypographySubHeader,
} from "@/components/common/Typography";
import { AnimatedProgressIcon } from "@/components/icons/Icons";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/hooks/useUser";
import { shortenName } from "@/lib/utils";
import React, { useState } from "react";
import { useQueries, useQuery } from "react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BestGearSection from "../root/BestGearSection";

const ProductPage: React.FC = () => {
  const { productSlug } = useParams();
  const navigate = useNavigate();
  const { isLoading, data: mainProduct } = useQuery<FullProduct>(
    `products/${productSlug}`,
    () => api.get(`/products/${productSlug}`) as Promise<FullProduct>,
  );
  const similarProductQueries = useQueries(
    mainProduct?.similarProducts.map((productSlug) => ({
      queryKey: `products/${productSlug}`,
      queryFn: () =>
        api.get(`/products/${productSlug}`) as Promise<FullProduct>,
    })) || [],
  );

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const quantityParams = params.get("quantity");

  const { toast } = useToast();
  const { isLoggedIn } = useUser();

  const [quantity, setQuantity] = useState(Number(quantityParams) || 1);

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
        {isLoading || !mainProduct ? (
          <div className="flex w-full items-center justify-center p-8 sm:p-10">
            <TypographySubHeader>
              <AnimatedProgressIcon className="inline stroke-black" />
            </TypographySubHeader>
          </div>
        ) : (
          <div className="flex flex-col space-y-[5.5rem]">
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
                  alt={mainProduct?.name}
                  className="w-full rounded-lg sm:max-h-[30rem] lg:max-h-[35rem]"
                />
              </picture>
              <div className="min-w-4 hidden max-w-[5rem] flex-1 sm:block lg:max-w-[8rem]" />
              <div className="space-y-6 sm:flex-[4]">
                {mainProduct?.new && (
                  <TypographyNewProduct className="">
                    New Product
                  </TypographyNewProduct>
                )}
                <p className="max-w-[15ch] text-[1.75rem] font-bold uppercase tracking-[0.0625rem] lg:text-[2.5rem] lg:leading-[2.75rem] lg:tracking-[0.08931rem]">
                  {mainProduct?.name}
                </p>
                <TypographyParagraph className="max-w-prose">
                  {mainProduct?.description}
                </TypographyParagraph>
                <p className="text-lg font-bold uppercase tracking-[0.08038rem]">
                  £{Number(mainProduct?.price).toLocaleString()}
                </p>
                <div className="flex items-center gap-4">
                  <NumberInput
                    min={1}
                    max={10}
                    value={quantity}
                    setValue={async (val) => setQuantity(val)}
                  />
                  <Button
                    variant="default"
                    onClick={() => {
                      if (!isLoggedIn) {
                        navigate(
                          `/login?redirect=/product/zx9-speaker?quantity=${quantity}`,
                        );
                      }

                      if (quantity < 1 || quantity > 10) {
                        setQuantity(Math.min(Math.max(1, quantity), 10));
                        toast({
                          variant: "destructive",
                          description: "Quantity must be between 1 and 10.",
                        });
                        return;
                      } else {
                        api
                          .post(`/cart/add/${mainProduct.id}`, {
                            quantity,
                          })
                          .then(() => {
                            toast({
                              variant: "success",
                              description: `${quantity} ${mainProduct.name} added to cart!`,
                            });
                          });
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
                  {mainProduct?.features}
                </TypographyParagraph>
              </div>
              <div className="hidden flex-1  lg:block" />
              <div className="flex flex-col gap-y-6 sm:flex-row lg:flex-col">
                <TypographyProductSubHeader className="sm:min-w-[40%] lg:min-w-min">
                  In the box
                </TypographyProductSubHeader>
                <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-2">
                  {mainProduct?.boxContents.map((item) => (
                    <React.Fragment key={item.item}>
                      <span className="text-[0.9375rem] font-bold leading-[1.5625rem] text-accent">
                        {item.quantity}x
                      </span>
                      <TypographyParagraph>{item.item}</TypographyParagraph>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="hidden flex-1 lg:block" />
            </div>
            <div
              className={`justify flex w-full flex-col justify-stretch gap-5 self-center sm:grid sm:[grid-template:"a_c"_auto_"b_c"_auto]`}
            >
              <picture className="sm:[grid-area:a]">
                <source
                  media="(min-width: 1024px)"
                  srcSet={`/product-${productSlug}/desktop/image-gallery-1.jpg`}
                />
                <source
                  media="(min-width: 640px)"
                  srcSet={`/product-${productSlug}/tablet/image-gallery-1.jpg`}
                />
                <img
                  src={`/product-${productSlug}/mobile/image-gallery-1.jpg`}
                  alt={mainProduct?.name}
                  className="h-full rounded-lg object-cover"
                />
              </picture>
              <picture className="sm:[grid-area:b]">
                <source
                  media="(min-width: 1024px)"
                  srcSet={`/product-${productSlug}/desktop/image-gallery-2.jpg`}
                />
                <source
                  media="(min-width: 640px)"
                  srcSet={`/product-${productSlug}/tablet/image-gallery-2.jpg`}
                />
                <img
                  src={`/product-${productSlug}/mobile/image-gallery-2.jpg`}
                  alt={mainProduct?.name}
                  className="h-full rounded-lg object-cover"
                />
              </picture>
              <picture className="sm:[grid-area:c]">
                <source
                  media="(min-width: 1024px)"
                  srcSet={`/product-${productSlug}/desktop/image-gallery-3.jpg`}
                />
                <source
                  media="(min-width: 640px)"
                  srcSet={`/product-${productSlug}/tablet/image-gallery-3.jpg`}
                />
                <img
                  src={`/product-${productSlug}/mobile/image-gallery-3.jpg`}
                  alt={mainProduct?.name}
                  className="h-full w-full rounded-lg object-cover"
                />
              </picture>
            </div>
            <div>
              <TypographyProductSubHeader className="mb-10 text-center sm:mb-[3.5rem] lg:mb-16">
                You may also like
              </TypographyProductSubHeader>
              <div className="flex flex-col gap-[3.5rem] sm:flex-row sm:gap-8 lg:justify-center">
                {!similarProductQueries ? (
                  <div className="flex w-full items-center justify-center p-8 sm:p-10">
                    <TypographySubHeader>
                      <AnimatedProgressIcon className="inline stroke-black" />
                    </TypographySubHeader>
                  </div>
                ) : (
                  similarProductQueries.map((similarProduct, index) => (
                    <div
                      key={similarProduct.data?.slug || index}
                      className="flex flex-col items-center gap-8 sm:flex-1 sm:justify-between"
                    >
                      {similarProduct.data && (
                        <img
                          src={`/product-${similarProduct.data.slug}/desktop/image-product.jpg`}
                          alt={mainProduct?.name}
                          className="max-h-[7.5rem] w-full rounded-lg bg-[#f1f1f1] object-contain sm:mb-2 sm:min-h-[20rem]"
                        />
                      )}
                      <p className="max-w-[15ch] text-center text-2xl font-bold uppercase">
                        {shortenName(similarProduct.data?.name || "")}
                      </p>
                      <Link
                        variant="button"
                        href={`/product/${similarProduct.data?.slug}`}
                      >
                        See product
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div />
          </div>
        )}
      </div>
      <Categories />
      <BestGearSection />
    </>
  );
};

export default ProductPage;
