import api from "@/api/api";
import FormInput from "@/components/common/FormInput";
import {
  TypographyFormHeader,
  TypographyFormSectionHeader,
} from "@/components/common/Typography";
import { AnimatedProgressIcon } from "@/components/icons/Icons";
import { Button } from "@/components/ui/button";
import { Form, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/hooks/useUser";
import { shortenName } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z
  .object({
    phoneNumber: z.string().optional(),
    address: z.string().min(2),
    postcode: z.string().min(2),
    city: z.string().min(2),
    paymentMethod: z.string().min(2),
    paymentParams: z
      .object({
        eMoneyNumber: z.string().optional(),
        eMoneyPin: z.string().optional(),
      })
      .optional(),
  })
  .refine(
    (data) =>
      data.paymentMethod !== "e-Money" || data.paymentParams?.eMoneyNumber,
    {
      message: "Please provide e-Money Number",
      path: ["paymentParams", "eMoneyNumber"],
    },
  )
  .refine(
    (data) => data.paymentMethod !== "e-Money" || data.paymentParams?.eMoneyPin,
    {
      message: "Please provide e-Money PIN",
      path: ["paymentParams", "eMoneyPin"],
    },
  );
type formValues = z.infer<typeof formSchema>;

interface CheckoutFormProps {
  cartData: Cart;
  shippingCost: number;
  totalCost: number;
  setOrderComplete: (value: boolean) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  cartData,
  shippingCost,
  totalCost,
  setOrderComplete,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { toast } = useToast();
  const { user } = useUser();
  const stripe = useStripe();
  const elements = useElements();

  const params = new URLSearchParams(window.location.search);
  const formValues = {
    address: params.get("address") || "",
    phoneNumber: params.get("phoneNumber") || "",
    postcode: params.get("postcode") || "",
    city: params.get("city") || "",
  };

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: formValues.address,
      phoneNumber: formValues.phoneNumber,
      postcode: formValues.postcode,
      city: formValues.city,
      paymentMethod: "Stripe Payment",
      paymentParams: {
        eMoneyNumber: "",
        eMoneyPin: "",
      },
    },
  });

  const completeOrder = useCallback(() => {
    api
      .post("/cart/checkout", JSON.stringify(form.getValues()), {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const res = response as { message?: string };
        if (res.message) {
          setError(res.message);
        } else {
          setError("");
          toast({
            variant: "success",
            description: "Checkout successful!",
          });
          setOrderComplete(true);
        }
      })
      .catch((err) => {
        if (err?.response?.data?.message) {
          setError(err.response.data.message);
        } else
          toast({
            variant: "destructive",
            description: `Something went wrong. Please try again later. Error: ${err.message}`,
          });
      })
      .finally(() => {
        setSubmitting(false);
      });
  }, [form, toast]);

  useEffect(() => {
    if (window.location.pathname === "/checkout/success") {
      const clientSecret = new URLSearchParams(window.location.search).get(
        "payment_intent_client_secret",
      );

      if (!clientSecret || !stripe) return;
      stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
        if (!paymentIntent) return;
        switch (paymentIntent.status) {
          case "succeeded":
            completeOrder();
            break;
          case "processing":
            setError("Payment is processing. Please wait.");
            break;
          case "requires_payment_method":
            setError("Payment failed. Please try another payment method.");
            break;
          default:
            setError("Something went wrong.");
            break;
        }
      });
    }
  }, [stripe, completeOrder]);

  if (!user) {
    return <AnimatedProgressIcon />;
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);

    if (values.paymentMethod === "Stripe Payment") {
      if (!stripe || !elements) return;

      stripe
        .confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/checkout/success?phoneNumber=${values.phoneNumber}&address=${values.address}&postcode=${values.postcode}&city=${values.city}`,
          },
        })
        .then((res) => {
          if (res.error) {
            if (res.error.message) setError(res.error.message);
            else
              setError(
                "Something went wrong during Stripe payment. Please try again later.",
              );
          }
        })
        .finally(() => {
          setSubmitting(false);
        });
    } else {
      completeOrder();
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onChange={() => setError("")}
        className="container relative flex w-full flex-col gap-8 lg:flex-row"
      >
        <div className="flex-[4] rounded-lg bg-white p-6  sm:p-7 lg:max-w-[50rem]">
          <TypographyFormHeader className="mb-8 sm:mb-10">
            Checkout
          </TypographyFormHeader>
          <div>
            <TypographyFormSectionHeader className="mb-4">
              Billing Details
            </TypographyFormSectionHeader>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-x-4">
              <FormInput
                name="name"
                defaultValue={`${user.firstName} ${user.lastName}`}
                formControl={form.control}
                disabled={true}
              />
              <FormInput
                label="Email Address"
                name="email"
                defaultValue={user.email}
                formControl={form.control}
                disabled={true}
              />
              <FormInput
                label="Phone Number (optional)"
                name="phoneNumber"
                formControl={form.control}
              />
            </div>
          </div>
          <div className="mt-8 sm:mt-12">
            <TypographyFormSectionHeader className="mb-4">
              Shipping Info
            </TypographyFormSectionHeader>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-x-4">
              <div className="sm:col-span-2">
                <FormInput
                  label="Your Address"
                  name="address"
                  formControl={form.control}
                />
              </div>
              <FormInput name="postcode" formControl={form.control} />
              <FormInput name="city" formControl={form.control} />
            </div>
          </div>
          <div className="mt-8 sm:mt-12">
            <TypographyFormSectionHeader className="mb-4">
              Payment Details
            </TypographyFormSectionHeader>
            <FormInput
              name="paymentMethod"
              label="Payment Method"
              radio
              radioInputs={["Stripe Payment", "e-Money", "Cash on Delivery"]}
              formControl={form.control}
            />
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-x-4">
              {form.watch("paymentMethod") === "e-Money" ? (
                <>
                  <FormInput
                    name="paymentParams.eMoneyNumber"
                    label="e-Money Number"
                    formControl={form.control}
                  />
                  <FormInput
                    name="paymentParams.eMoneyPin"
                    label="e-Money PIN"
                    formControl={form.control}
                  />
                </>
              ) : (
                form.watch("paymentMethod") === "Stripe Payment" && (
                  <PaymentElement className="sm:col-span-2" />
                )
              )}
            </div>
          </div>
        </div>
        <div className="h-min min-w-[20rem] flex-1 rounded-lg bg-white p-6 sm:p-7 lg:sticky lg:top-[100px] lg:max-w-[45rem]">
          <TypographyFormHeader className="mb-8 pb-0 text-[1.125rem] tracking-[0.08038rem] sm:mb-10 sm:text-[1.125rem]">
            Summary
          </TypographyFormHeader>
          <div className="space-y-6">
            {cartData.items.map((item) => (
              <div key={item.slug} className="flex items-center gap-4">
                <img
                  src={`/product-${item.slug}/desktop/image-product.jpg`}
                  alt={item.name}
                  className="mr-4 h-16 w-16 rounded-lg"
                />
                <div className="grid w-full grid-cols-[1fr_auto] items-center font-bold leading-[1.5625rem]">
                  <p className="text-[0.9375rem] ">{shortenName(item.name)}</p>
                  <p className="text-[0.9375rem] opacity-50">
                    x{item.quantity}
                  </p>
                  <p className="text-sm opacity-50">
                    £{Number(item.price).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div>
            <div className="mt-8 grid grid-cols-2 items-center gap-2">
              <span className="text-[0.9375rem] font-medium uppercase leading-[1.5625rem] opacity-50">
                Total
              </span>
              <span className="ml-auto text-lg  font-bold">
                £{Number(totalCost - shippingCost).toLocaleString()}
              </span>
              <span className="text-[0.9375rem] font-medium uppercase leading-[1.5625rem] opacity-50">
                Shipping
              </span>
              <span className="ml-auto text-lg font-bold">
                £{shippingCost.toLocaleString()}
              </span>
              <span className="text-[0.9375rem] font-medium uppercase leading-[1.5625rem] opacity-50">
                VAT (Included)
              </span>
              {cartData && (
                <>
                  <span className="ml-auto text-lg font-bold">
                    £
                    {Number(totalCost / 6).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <span className="mt-6 text-[0.9375rem] font-medium uppercase leading-[1.5625rem] opacity-50">
                    Grand Total
                  </span>
                  <span className="ml-auto mt-6 text-lg font-bold text-accent">
                    £{Number(totalCost).toLocaleString()}
                  </span>
                </>
              )}
            </div>
          </div>

          <FormMessage className="my-6">{error}</FormMessage>
          <Button
            type="submit"
            className="col-span-2 mt-8 w-full"
            disabled={submitting}
          >
            {!submitting ? "Continue & Pay" : <AnimatedProgressIcon />}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CheckoutForm;
