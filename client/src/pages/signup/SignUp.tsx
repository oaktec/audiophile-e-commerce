import api from "@/api/api";
import FormInput from "@/components/common/FormInput";
import { Link } from "@/components/common/Link";
import {
  TypographyFormHeader,
  TypographyParagraph,
} from "@/components/common/Typography";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useUser } from "@/hooks/useUser";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
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
      .refine(
        (password) => {
          const hasNumber = /\d/.test(password);
          const hasUpper = /[A-Z]/.test(password);
          const hasLower = /[a-z]/.test(password);
          const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(
            password,
          );
          const hasSpace = /\s/.test(password);
          return hasNumber && hasUpper && hasLower && hasSymbol && !hasSpace;
        },
        {
          message:
            "Password must contain at least one number, one uppercase letter, one lowercase letter, one symbol, and no spaces",
          path: ["password"],
        },
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

  if (isLoggedIn) {
    navigate("/");
  }

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    api
      .fetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        checkSession().then(() => {
          navigate("/");
        });
      })
      .catch(console.error);
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-xl space-y-6 rounded-lg bg-white p-6 sm:p-7 lg:p-12"
        >
          <TypographyFormHeader>Register</TypographyFormHeader>

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
          <FormInput
            name="address"
            placeholder="Your address"
            formControl={form.control}
          />
          <FormInput
            name="email"
            placeholder="Your email address"
            formControl={form.control}
          />
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
          <div />
          <Button type="submit" className="w-full">
            Submit
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
