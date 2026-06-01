"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchemaType } from "@/schemas/login";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

 function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

 async function onSubmit(
  data: LoginSchemaType
) {

  try {

  const response = await signIn(
  "credentials",
  {
    email: data.email,
    password: data.password,
    redirect: false,
  }
);

console.log("SignIn Response:", response);

if (response?.ok && !response?.error) {

  toast.success(
    "Login successful!"
  );

  router.push("/dashboard");
  router.refresh();

} else {

  toast.error(
    "Invalid email or password"
  );

}

  } catch (error) {

    console.error(error);

    toast.error(
      "Something went wrong"
    );
  }
}
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Sign In</h1>
        </div>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            {...register("email")}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            {...register("password")}
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </Field>

        <Field>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-black text-white w-full"
          >
            {isSubmitting ? "Signing in..." : "Login"}
          </Button>
        </Field>

        <div className="flex justify-center text-sm">
          <FieldLabel>
            Don't have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </FieldLabel>
        </div>
      </FieldGroup>
    </form>
  );
}
export default LoginForm; 