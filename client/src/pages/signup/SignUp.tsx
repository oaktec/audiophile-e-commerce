import api from "@/api/api";
import FormInput from "@/components/common/FormInput";
import { Link } from "@/components/common/Link";
import {
  TypographyFormHeader,
  TypographyParagraph,
} from "@/components/common/Typography";
import { AnimatedProgressIcon } from "@/components/icons/Icons";
import { Button } from "@/components/ui/button";
import { Form, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/hooks/useUser";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

const formSchema = z
  .object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    address: z.string().min(2),
    password: z
      .string()
      .min(8)
      .refine((password) => /\d/.test(password), {
        message: "Password must contain at least one number",
      })
      .refine(
        (password) => /[A-Z]/.test(password),
        "Password must contain at least one uppercase letter",
      )
      .refine(
        (password) => /[a-z]/.test(password),
        "Password must contain at least one lowercase letter",
      )
      .refine(
        (password) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
        "Password must contain at least one symbol",
      ),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type formValues = z.infer<typeof formSchema>;

const SignUp: React.FC = () => {
  const { checkSession, isLoggedIn } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [error, setError] = useState<string | null>(null);
  const [signingUp, setSigningUp] = useState(false);

  if (isLoggedIn) {
    navigate("/");
  }

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      address: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setSigningUp(true);
    api
      .post("/auth/register", JSON.stringify(values), {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const res = response as { message?: string };
        if (res.message) {
          setError(res.message);
        } else {
          checkSession().then((user) => {
            if (user && user.id) {
              navigate("/");
              toast({
                variant: "success",
                description: "Account registered!",
              });
            }
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
        setSigningUp(false);
      });
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onChange={() => setError("")}
          className="max-w-xl gap-y-6 space-y-6 rounded-lg bg-white p-6 sm:p-7 md:grid md:max-w-5xl md:grid-flow-row md:grid-cols-2 md:gap-4 md:gap-y-6 md:space-y-0 lg:p-12"
        >
          <TypographyFormHeader className="col-span-2">
            Register
          </TypographyFormHeader>

          <FormInput
            name="firstName"
            label="First Name"
            placeholder="Your first name"
            formControl={form.control}
          />
          <FormInput
            name="lastName"
            label="Last Name"
            placeholder="Your last name"
            formControl={form.control}
          />
          <div className="col-span-2">
            <FormInput
              name="email"
              placeholder="Your email address"
              formControl={form.control}
            />
          </div>
          <FormInput
            name="password"
            placeholder="Enter a password"
            formControl={form.control}
            type="password"
          />
          <FormInput
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm your password"
            formControl={form.control}
            type="password"
          />

          <div className="col-span-2">
            <FormInput
              name="address"
              placeholder="Your address"
              formControl={form.control}
            />
          </div>

          <div className="col-span-2">
            <FormMessage>{error}</FormMessage>
          </div>

          <div className="col-span-2 hidden md:block"></div>
          <Button
            type="submit"
            className="col-span-2 w-full"
            disabled={signingUp}
          >
            {signingUp ? <AnimatedProgressIcon /> : "Submit"}
          </Button>
        </form>
      </Form>
      <div className="my-6">
        <TypographyParagraph>Already have an account?</TypographyParagraph>
        <Link variant="dark-button" className="mt-2 flex" href="/login">
          Log In
        </Link>
      </div>
    </>
  );
};

export default SignUp;
