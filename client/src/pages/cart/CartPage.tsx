import FormInput from "@/components/common/FormInput";
import {
  TypographyFormHeader,
  TypographyFormSectionHeader,
} from "@/components/common/Typography";
import { AnimatedProgressIcon } from "@/components/icons/Icons";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useUser } from "@/hooks/useUser";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
  phoneNumber: z.string().optional(),
  address: z.string().min(2),
  postcode: z.string().min(2),
  city: z.string().min(2),
  paymentMethod: z.string().min(2),
});

type formValues = z.infer<typeof formSchema>;

const CartPage: React.FC = () => {
  const { user, isLoggedIn } = useUser();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      phoneNumber: "",
      postcode: "",
      city: "",
      paymentMethod: "e-Money",
    },
  });

  if (!user) {
    return <AnimatedProgressIcon />;
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onChange={() => setError("")}
        >
          <div className="max-w-[45rem] rounded-lg bg-white p-6  sm:p-7">
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
                type="radio"
                radioInputs={["e-Money", "Cash on Delivery"]}
                formControl={form.control}
              />
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-x-4"></div>
              <Button type="submit" className="col-span-2 w-full">
                Submit
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};

export default CartPage;
