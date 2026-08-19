// "use client";

// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
// import { Input } from "@/components/ui/input";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { loginSchema, LoginSchemaType } from "@/schemas/login";
// import { signIn, useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import Link from "next/link";
// import { useEffect } from "react";

// function LoginForm({
//   className,
//   ...props
// }: React.ComponentProps<"form">) {
//   const router = useRouter();

//   const { data: session, status } = useSession();
//   console.log("The Session =======>",session)

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<LoginSchemaType>({
//     resolver: zodResolver(loginSchema),
//   });

//   async function onSubmit(data: LoginSchemaType) {
//     try {
//       const response = await signIn("credentials", {
//         email: data.email,
//         password: data.password,
//         redirect: false,
//       });

//       if (response?.ok && !response?.error) {
//         toast.success("Login successful!");
//       } else {
//         toast.error("Invalid email or password");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Something went wrong");
//     }
//   }

//  useEffect(() => {
//   if (status === "authenticated") {
//     const role = session?.user?.role;

//     if (role === "admin") {
//       router.push("/dashboard");
//     } else if (role === "artist") {
//       router.push("/dashboard-artist");
//     } else {
//       router.push("/");
//     }
//   }
// }, [status, session, router]);

//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       className={cn("flex flex-col gap-6", className)}
//       {...props}
//     >
//       <FieldGroup>
//         <div className="flex flex-col items-center gap-1 text-center">
//           <h1 className="text-2xl font-bold">Sign In</h1>
//         </div>

//         <Field>
//           <FieldLabel htmlFor="email">Email</FieldLabel>
//           <Input
//             id="email"
//             type="email"
//             placeholder="m@example.com"
//             {...register("email")}
//           />
//           {errors.email && (
//             <p className="text-sm text-red-500">
//               {errors.email.message}
//             </p>
//           )}
//         </Field>

//         <Field>
//           <FieldLabel htmlFor="password">Password</FieldLabel>
//           <Input
//             id="password"
//             type="password"
//             {...register("password")}
//           />
//           {errors.password && (
//             <p className="text-sm text-red-500">
//               {errors.password.message}
//             </p>
//           )}
//         </Field>

//         <Field>
//           <Button
//             type="submit"
//             disabled={isSubmitting}
//             className="bg-black text-white w-full"
//           >
//             {isSubmitting ? "Signing in..." : "Login"}
//           </Button>
//         </Field>

//         <div className="flex justify-center text-sm">
//           <FieldLabel>
//             Don't have an account?{" "}
//             <Link
//               href="/register"
//               className="text-primary hover:underline"
//             >
//               Sign up
//             </Link>
//           </FieldLabel>
//         </div>
//       </FieldGroup>
//     </form>
//   );
// }

// export default LoginForm;

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
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { X } from "lucide-react";

export default function LoginForm({
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

  async function onSubmit(data: LoginSchemaType) {
    try {
      const response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (response?.ok && !response?.error) {
        toast.success("Login successful!");

        const session = await getSession();
        const role = (session?.user as any)?.role;

        if (role === "admin") {
          router.push("/dashboard");
        } else if (role === "artist") {
          router.push("/dashboard-artist");
        } else {
          router.push("/");
        }

        router.refresh();
      } else {
        toast.error(response?.error || "Invalid email or password");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn(
        "relative flex flex-col gap-6 p-8 rounded-2xl bg-[#16161a] border border-white/10 shadow-2xl",
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
          <h1 className="text-2xl font-bold text-white">Sign In</h1>
        </div>

        {/* EMAIL */}
        <Field>
          <FieldLabel htmlFor="email" className="text-zinc-300">
            Email
          </FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            className="bg-[#1e1e24] border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-purple-500 focus-visible:border-purple-500"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-400">{errors.email.message}</p>
          )}
        </Field>

        {/* PASSWORD */}
        <Field>
          <FieldLabel htmlFor="password" className="text-zinc-300">
            Password
          </FieldLabel>
          <Input
            id="password"
            type="password"
            className="bg-[#1e1e24] border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-purple-500 focus-visible:border-purple-500"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-red-400">{errors.password.message}</p>
          )}
        </Field>

        {/* LOGIN BUTTON */}
        <Field>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-medium shadow-lg shadow-purple-500/20 border-0"
          >
            {isSubmitting ? "Signing in..." : "Login"}
          </Button>
        </Field>

        {/* Sign up link */}
        <div className="flex justify-center text-sm">
          <FieldLabel className="text-zinc-400">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-purple-400 hover:text-purple-300 hover:underline font-medium"
            >
              Sign up
            </Link>
          </FieldLabel>
        </div>
      </FieldGroup>
    </form>
  );
}