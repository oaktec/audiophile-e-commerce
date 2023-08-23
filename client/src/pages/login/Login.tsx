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

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

const Login: React.FC = () => {
  const { checkSession, isLoggedIn } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [error, setError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  if (isLoggedIn) {
    navigate("/");
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoggingIn(true);
    api
      .fetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        checkSession().then((user) => {
          if (user && user.id) {
            navigate("/");
            toast({
              variant: "success",
              description: "Logged in as " + user.email,
            });
          } else {
            setError(
              "Invalid email or password. Please try again or register.",
            );
          }
        });
      })
      .catch((err) =>
        toast({
          variant: "destructive",
          description: err.message,
        }),
      )
      .finally(() => {
        setLoggingIn(false);
      });
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onChange={() => setError("")}
          className="max-w-xl space-y-6 rounded-lg bg-white p-6 sm:p-7 lg:p-12"
        >
          <TypographyFormHeader>Welcome back!</TypographyFormHeader>
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
          <FormMessage>{error}</FormMessage>
          <Button type="submit" className="w-full" disabled={loggingIn}>
            {loggingIn ? <AnimatedProgressIcon /> : "Log In"}
          </Button>
        </form>
      </Form>
      <div className="my-6">
        <TypographyParagraph>Don't have an account?</TypographyParagraph>
        <Link variant="dark-button" className="mt-2 flex" href="/signup">
          Register
        </Link>
      </div>
    </>
  );
};

export default Login;
