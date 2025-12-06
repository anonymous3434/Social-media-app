import React, { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignInValidationSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import Loader from "@/shared/Loader";
import { toast } from "sonner";
import { useSignInAccount } from "@/lib/react-query/queriesAndMutation";
import { useAuthContext } from "@/context/auth.constants";

const Signin = () => {
  const { mutateAsync: createUserSession, isPending: isCreatingSession } =
    useSignInAccount();
  const { checkAuthStatus, isLoading: isUserLoading } = useAuthContext();
  const navigate = useNavigate();
  // 1. Define your form.
  const form = useForm<z.infer<typeof SignInValidationSchema>>({
    resolver: zodResolver(SignInValidationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignInValidationSchema>) {
    const session = await createUserSession({
      email: values.email,
      password: values.password,
    });
    const isLoggedIn = await checkAuthStatus();
    if (isLoggedIn) navigate("/");
    else toast.error("User login failed");
  }
  return (
    <Form {...form}>
      <div className="flex flex-col gap-4">
        <img
          className="h-40 w-full object-fit"
          src="/assets/images/logo.svg"
          alt="logo"
        />
        <p className="text-3xl font-semibold">Login in to you Account</p>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="shad-button_primary" type="submit">
            {isUserLoading ? (
              <div className="flex-center gap-2 font-bold">
                <Loader /> Loading
              </div>
            ) : (
              "Login"
            )}
          </Button>
        </form>
        <p className="text-sm">
          Dont have an account{" "}
          <Link className="text-primary-500 font-semibold ml-1" to="/signup">
            Sign up
          </Link>
        </p>
      </div>
    </Form>
  );
};

export default Signin;
