import api from "@/api/api";
import { AnimatedProgressIcon } from "@/components/icons/Icons";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(
  "pk_test_51Nl6r6L9i9SFX7pdzhWxhzzmYRJ0hH2CntwytBFYw2saAMVTyAeBvu7XXb5nNvO1WymRp4zdZxyr08mvAQnbmxyy00MEaHwHpX",
);

const CheckoutPage: React.FC = () => {
  const [clientSecret, setClientSecret] = useState("");

  const { isLoading: loadingCartData, data: cartData } = useQuery(
    "cart",
    () => api.get("/cart") as Promise<Cart>,
  );

  const stripeOptions = {
    clientSecret,
  };

  const SHIPPING_COST = 25;
  const getTotalCost = (items: CartItem[]) =>
    items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0) +
    SHIPPING_COST;

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
    <Elements stripe={stripePromise} options={stripeOptions}>
      <CheckoutForm
        cartData={cartData}
        shippingCost={SHIPPING_COST}
        totalCost={getTotalCost(cartData?.items) + SHIPPING_COST}
      />
    </Elements>
  );
};

export default CheckoutPage;
