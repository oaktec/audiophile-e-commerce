import api from "@/api/api";
import { Link } from "@/components/common/Link";
import { TypographyParagraph } from "@/components/common/Typography";
import {
  AnimatedProgressIcon,
  OrderConfirmation,
} from "@/components/icons/Icons";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { shortenName } from "@/lib/utils";
import { Elements } from "@stripe/react-stripe-js";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(
  "pk_test_51Nl6r6L9i9SFX7pdzhWxhzzmYRJ0hH2CntwytBFYw2saAMVTyAeBvu7XXb5nNvO1WymRp4zdZxyr08mvAQnbmxyy00MEaHwHpX",
);

const CheckoutPage: React.FC = () => {
  const [clientSecret, setClientSecret] = useState("");
  const [orderComplete, setOrderComplete] = useState(false);
  const [listExpanded, setListExpanded] = useState(false);

  const { isLoading: loadingCartData, data: cartData } = useQuery(
    "cart",
    () => api.get("/cart") as Promise<Cart>,
    {
      enabled: !orderComplete,
    },
  );

  const stripeOptions: StripeElementsOptions = {
    clientSecret,
    fonts: [
      {
        cssSrc: "https://fonts.googleapis.com/css?family=Manrope",
      },
    ],
    appearance: {
      theme: "stripe",
      variables: {
        fontFamily: "Manrope",
        spacingGridRow: "2rem",
      },
    },
  };

  const SHIPPING_COST = 25;
  const getTotalCost = (items: CartItem[]) =>
    items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0) +
    SHIPPING_COST;
  const getTotalUnits = (items: CartItem[]) =>
    items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    if (!cartData) return;
    api
      .get("/stripe-secret", {
        params: {
          amount: getTotalCost(cartData?.items) + SHIPPING_COST,
        },
      })
      .then((res) => {
        const data = res as { clientSecret: string };
        setClientSecret(data.clientSecret);
      });
  }, [cartData]);

  return loadingCartData || clientSecret === "" || !cartData ? (
    <AnimatedProgressIcon />
  ) : (
    <>
      <Elements stripe={stripePromise} options={stripeOptions}>
        <CheckoutForm
          cartData={cartData}
          shippingCost={SHIPPING_COST}
          totalCost={getTotalCost(cartData?.items) + SHIPPING_COST}
          setOrderComplete={setOrderComplete}
        />
      </Elements>
      <Dialog open={orderComplete}>
        <DialogContent className="max-h-[85dvh] w-max  max-w-[90%] overflow-auto p-8 sm:right-auto">
          <OrderConfirmation />
          <p className="max-w-[20ch] text-2xl font-bold uppercase leading-7 tracking-[0.05356rem] sm:mt-4 sm:text-[2rem] sm:leading-9 sm:tracking-[0.07144rem]">
            Thank you for your order
          </p>
          <TypographyParagraph className="sm:mt-2">
            You will receive an email confirmation shortly.
          </TypographyParagraph>
          <div className="mt-2 flex flex-col sm:mt-4 sm:flex-row">
            <div className="flex min-h-[8.75rem] flex-col rounded-t-lg bg-[#f1f1f1] px-6 pt-6 sm:flex-[1.5] sm:rounded-none sm:rounded-l-lg">
              {cartData.items.map(
                (item, index) =>
                  (index === 0 || listExpanded) && (
                    <div
                      key={item.slug}
                      className="mb-2 flex items-center gap-1"
                    >
                      <img
                        src={`/product-${item.slug}/desktop/image-product.jpg`}
                        alt={item.name}
                        className="mr-1 h-14 w-14 rounded-lg"
                      />
                      <div className="grid w-full grid-cols-[1fr_auto] items-center font-bold leading-[1.5625rem]">
                        <p className="text-[0.9375rem] ">
                          {shortenName(item.name)}
                        </p>
                        <p className="text-[0.9375rem] opacity-50">
                          x{item.quantity}
                        </p>
                        <p className="text-sm opacity-50">
                          £{Number(item.price).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ),
              )}
              {cartData.items.length > 1 && (
                <button
                  onClick={() => setListExpanded(!listExpanded)}
                  className="flex min-h-[50px]  w-full flex-1 items-center justify-center border-t border-black border-opacity-10 hover:text-accent"
                >
                  <TypographyParagraph className="text-inherit opacity-75">
                    {listExpanded
                      ? "View less"
                      : `and ${
                          getTotalUnits(cartData.items) -
                          (cartData.items[0]?.quantity || 1)
                        } other item(s)`}
                  </TypographyParagraph>
                </button>
              )}
            </div>
            <div className="min-h-[5.75rem] flex-1 rounded-b-lg bg-black p-6 sm:flex sm:flex-col sm:justify-center sm:rounded-none sm:rounded-r-lg">
              <p className="text-[0.9375rem] font-medium uppercase leading-[1.5625rem] text-white opacity-50">
                Grand Total
              </p>
              <p className="text-lg font-bold text-white">
                £
                {Number(
                  getTotalCost(cartData.items) + SHIPPING_COST,
                ).toLocaleString()}
              </p>
            </div>
          </div>
          <Link href="/" variant="button" className="mt-2 w-full">
            Back to home
          </Link>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CheckoutPage;
