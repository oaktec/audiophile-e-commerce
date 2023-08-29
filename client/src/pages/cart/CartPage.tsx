import api from "@/api/api";
import FormInput from "@/components/common/FormInput";
import {
  TypographyFormHeader,
  TypographyFormSectionHeader,
} from "@/components/common/Typography";
import { AnimatedProgressIcon } from "@/components/icons/Icons";
import { Button } from "@/components/ui/button";
import { Form, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@/hooks/useUser";
import { shortenName } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
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

const CartPage: React.FC = () => {
  const { user } = useUser();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { isLoading: loadingCartData, data: cartData } = useQuery(
    "cart",
    () => api.get("/cart") as Promise<Cart>,
  );

  const totalCost = cartData?.items?.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0,
  );

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      phoneNumber: "",
      postcode: "",
      city: "",
      paymentMethod: "e-Money",
      paymentParams: {
        eMoneyNumber: "",
        eMoneyPin: "",
      },
    },
  });

  if (!user) {
    return <AnimatedProgressIcon />;
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);
    api
      .post("/cart/checkout", JSON.stringify(values), {
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

    console.log(values);
  }

  return (
    <>
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
                radioInputs={["e-Money", "Cash on Delivery"]}
                formControl={form.control}
              />
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-x-4">
                {form.watch("paymentMethod") === "e-Money" && (
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
                )}
              </div>
            </div>
          </div>
          <div className="h-min min-w-[20rem] flex-1 rounded-lg bg-white p-6 sm:p-7 lg:sticky lg:top-[100px] lg:max-w-[45rem]">
            <TypographyFormHeader className="mb-8 pb-0 text-[1.125rem] tracking-[0.08038rem] sm:mb-10 sm:text-[1.125rem]">
              Summary
            </TypographyFormHeader>
            {!loadingCartData && cartData ? (
              <>
                <div className="space-y-6">
                  {cartData.items.map((item) => (
                    <div key={item.slug} className="flex items-center gap-4">
                      <img
                        src={`/product-${item.slug}/desktop/image-product.jpg`}
                        alt={item.name}
                        className="mr-4 h-16 w-16 rounded-lg"
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
                  ))}
                </div>
                <div>
                  <div className="mt-8 grid grid-cols-2 items-center gap-2">
                    <span className="text-[0.9375rem] font-medium uppercase leading-[1.5625rem] opacity-50">
                      Total
                    </span>
                    <span className="ml-auto text-lg  font-bold">
                      £{Number(totalCost).toLocaleString()}
                    </span>
                    <span className="text-[0.9375rem] font-medium uppercase leading-[1.5625rem] opacity-50">
                      Shipping
                    </span>
                    <span className="ml-auto text-lg font-bold">
                      £{Number(50).toLocaleString()}
                    </span>
                    <span className="text-[0.9375rem] font-medium uppercase leading-[1.5625rem] opacity-50">
                      VAT (Included)
                    </span>
                    {totalCost && (
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
                          £{Number(totalCost + 50).toLocaleString()}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <FormMessage className="mb-6">{error}</FormMessage>
                <Button
                  type="submit"
                  className="col-span-2 mt-8 w-full"
                  disabled={submitting}
                >
                  {!submitting ? "Continue & Pay" : <AnimatedProgressIcon />}
                </Button>
              </>
            ) : (
              <p className="text-[0.9375rem] opacity-50">
                Loading cart data... <AnimatedProgressIcon />
              </p>
            )}
          </div>
        </form>
      </Form>
    </>
  );
};

export default CartPage;
