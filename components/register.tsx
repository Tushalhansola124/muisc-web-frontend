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
import { X } from "lucide-react";

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

      if (res?.status === 201 || res?.success === true) {
        toast.success(res.message || "Registration successful! Please login.");
        router.push("/login");
        return;
      }

      toast.error(res?.message || "Registration failed!");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Registration failed. Please try again.";

      toast.error(message);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn(
        "relative flex flex-col gap-6 p-8 rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-2xl",
        className
      )}
      {...props}
    >
      {/* Close Button - Top Right */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => router.push("/")}
        className="absolute top-4 right-4 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full"
      >
        <X className="h-5 w-5" />
      </Button>

      <FieldGroup>
        {/* Header */}
        <div className="flex flex-col items-center gap-1 text-center pt-2">
          <h1 className="text-2xl font-bold text-white">Sign Up</h1>
        </div>

        {/* First Name */}
        <Field>
          <FieldLabel htmlFor="firstName" className="text-zinc-300">
            First Name
          </FieldLabel>
          <Input
            id="firstName"
            placeholder="John"
            className="bg-[#121212] border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-purple-500 focus-visible:border-purple-500"
            {...register("firstName")}
          />
          {errors.firstName && (
            <p className="text-sm text-red-400">{errors.firstName.message}</p>
          )}
        </Field>

        {/* Last Name */}
        <Field>
          <FieldLabel htmlFor="lastName" className="text-zinc-300">
            Last Name
          </FieldLabel>
          <Input
            id="lastName"
            placeholder="Doe"
            className="bg-[#121212] border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-purple-500 focus-visible:border-purple-500"
            {...register("lastName")}
          />
          {errors.lastName && (
            <p className="text-sm text-red-400">{errors.lastName.message}</p>
          )}
        </Field>

        {/* Username */}
        <Field>
          <FieldLabel htmlFor="username" className="text-zinc-300">
            Username
          </FieldLabel>
          <Input
            id="username"
            placeholder="johndoe"
            className="bg-[#121212] border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-purple-500 focus-visible:border-purple-500"
            {...register("username")}
          />
          {errors.username && (
            <p className="text-sm text-red-400">{errors.username.message}</p>
          )}
        </Field>

        {/* Mobile */}
        <Field>
          <FieldLabel htmlFor="mobileNumber" className="text-zinc-300">
            Mobile Number
          </FieldLabel>
          <Input
            id="mobileNumber"
            placeholder="9876543210"
            className="bg-[#121212] border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-purple-500 focus-visible:border-purple-500"
            {...register("mobileNumber")}
          />
          {errors.mobileNumber && (
            <p className="text-sm text-red-400">{errors.mobileNumber.message}</p>
          )}
        </Field>

        {/* Email */}
        <Field>
          <FieldLabel htmlFor="email" className="text-zinc-300">
            Email
          </FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            className="bg-[#121212] border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-purple-500 focus-visible:border-purple-500"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-400">{errors.email.message}</p>
          )}
        </Field>

        {/* Password */}
        <Field>
          <FieldLabel htmlFor="password" className="text-zinc-300">
            Password
          </FieldLabel>
          <Input
            id="password"
            type="password"
            className="bg-[#121212] border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-purple-500 focus-visible:border-purple-500"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-red-400">{errors.password.message}</p>
          )}
        </Field>

        {/* Hidden Role */}
        <input type="hidden" {...register("role")} value="user" />

        {/* Register Button */}
        <Field>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-medium shadow-lg shadow-purple-500/20 border-0"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </Button>
        </Field>

        {/* Login Link */}
        <div className="flex justify-center text-sm">
          <FieldLabel className="text-zinc-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-purple-400 hover:text-purple-300 hover:underline font-medium"
            >
              Login
            </Link>
          </FieldLabel>
        </div>
      </FieldGroup>
    </form>
  );
}