import { z } from "zod";

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters"),

  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters"),

  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters"),

  email: z
    .string()
    .email("Please enter a valid email"),

  mobileNumber: z
    .string()
    .min(10, "Mobile number must be 10 digits")
    .max(10, "Mobile number must be 10 digits"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),

 role: z.string().default("user"),
});

export type RegisterSchemaType = z.infer<
  typeof registerSchema
>;