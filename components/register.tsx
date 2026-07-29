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
import { registerSchema, RegisterSchemaType } from "@/schemas/register";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Register } from "@/app/register/controller";
import Link from "next/link";

export function RegisterPage({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "user",
    },
  });

  async function onSubmit(data: RegisterSchemaType) {
    try {
      const res = await Register(data);

      // Success cases
      if (res?.status === 201 || res?.success === true) {
        toast.success(res.message || "Registration successful! Please login.");
        router.push("/login");
        return;
      }

      // Backend returned error but didn't throw
      toast.error(res?.message || "Registration failed!");
    } catch (error: any) {
      // Extract proper message from backend
      const message =
        error?.response?.data?.message ||   // Axios error from backend
        error?.message ||                   // Thrown Error message
        "Registration failed. Please try again.";

      toast.error(message);
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
          <h1 className="text-2xl font-bold">Sign Up</h1>
        </div>

        {/* First Name */}
        <Field>
          <FieldLabel htmlFor="firstName">First Name</FieldLabel>
          <Input
            id="firstName"
            placeholder="John"
            {...register("firstName")}
          />
          {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName.message}</p>
          )}
        </Field>

        {/* Last Name */}
        <Field>
          <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
          <Input
            id="lastName"
            placeholder="Doe"
            {...register("lastName")}
          />
          {errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName.message}</p>
          )}
        </Field>

        {/* Username */}
        <Field>
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <Input
            id="username"
            placeholder="johndoe"
            {...register("username")}
          />
          {errors.username && (
            <p className="text-sm text-red-500">{errors.username.message}</p>
          )}
        </Field>

        {/* Mobile */}
        <Field>
          <FieldLabel htmlFor="mobileNumber">Mobile Number</FieldLabel>
          <Input
            id="mobileNumber"
            placeholder="9876543210"
            {...register("mobileNumber")}
          />
          {errors.mobileNumber && (
            <p className="text-sm text-red-500">{errors.mobileNumber.message}</p>
          )}
        </Field>

        {/* Email */}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </Field>

        {/* Password */}
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </Field>

        {/* Hidden Role */}
        <input type="hidden" {...register("role")} value="user" />

        {/* Button */}
        <Field>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-black text-white w-full"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </Button>
        </Field>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
      </FieldGroup>
    </form>
  );
}