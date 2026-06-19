"use client";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";

import {
  useForm,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  registerSchema,
  RegisterSchemaType,
} from "@/schemas/register";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Register } from "@/app/register/controller";

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
});

 async function onSubmit(
  data: RegisterSchemaType
) {

  const payload = {
    ...data,
    role: "user",
  };

  try {

    const res = await Register(payload);


    if (res.status === 201) {
      toast.success("Registration successful! Please login.");
      router.push("/login");
    }
    else{
      toast.error(
        res.message || "Registration failed!"
      );
    }

  } catch (error: any) {

    toast.error(
      error.message || "Registration failed!"
    );

  }
}

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn(
        "flex flex-col gap-6",
        className
      )}
      {...props}
    >
      <FieldGroup>

        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">
            SignUp
          </h1>
        </div>

           <Field>
          <FieldLabel htmlFor="email">
            First Name
          </FieldLabel>

          <Input
            id="firstName"
            type="text"
            placeholder="John Doe"
            className="bg-background"
            {...register("firstName")}
          />

          {errors.firstName && (
            <p className="text-sm text-red-500">
              {errors.firstName.message}
            </p>
          )}
        </Field>

             <Field>
          <FieldLabel htmlFor="email">
            LastName
          </FieldLabel>

          <Input
            id="lastName"
            type="text"
            placeholder="Doe"
            className="bg-background"
            {...register("lastName")}
          />

          {errors.lastName && (
            <p className="text-sm text-red-500">
              {errors.lastName.message}
            </p>
          )}
        </Field>
           <Field>
          <FieldLabel htmlFor="username">
            UserName
          </FieldLabel>

          <Input
            id="username"
            type="username"
            placeholder="Enter Your Username"
            className="bg-background"
            {...register("username")}
          />

          {errors.username && (
            <p className="text-sm text-red-500">
              {errors.username.message}
            </p>
          )}
        </Field>
              <Field>
          <FieldLabel htmlFor="email">
            Mobile Number
          </FieldLabel>

          <Input
            id="mobileNumber"
            type="text"
            placeholder="Enter Your Mobile Number"
            className="bg-background"
            {...register("mobileNumber")}
          />

          {errors.mobileNumber && (
            <p className="text-sm text-red-500">
              {errors.mobileNumber.message}
            </p>
          )}
        </Field>
        



        {/* EMAIL */}
        <Field>
          <FieldLabel htmlFor="email">
            Email
          </FieldLabel>

          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            className="bg-background"
            {...register("email")}
          />

          {errors.email && (
            <p className="text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </Field>

        {/* PASSWORD */}
        <Field>
          <FieldLabel htmlFor="password">
            Password
          </FieldLabel>

          <Input
            id="password"
            type="password"
            className="bg-background"
            {...register("password")}
          />

          {errors.password && (
            <p className="text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </Field>

        {/* BUTTON */}
        <Field>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-black text-white"
          >
            {
              isSubmitting
                ? "Loading..."
                : "Register"
            }
          </Button>
        </Field>
       
      </FieldGroup>
    </form>
  );
}