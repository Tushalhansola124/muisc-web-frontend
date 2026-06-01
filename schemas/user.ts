import * as z from "zod";

export const CreateUserSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name is too long"),

  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name is too long"),

  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username is too long")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscore"),

  email: z
    .string()
    .email("Please enter a valid email address"),

  mobileNumber: z
    .string()
    .min(10, "Mobile number must be at least 10 digits")
    .max(15, "Mobile number is too long"),

 password: z.string().optional(),

role: z.enum(["user", "admin", "artist"]),

  profileImage: z.any().optional(),
});

export type CreateUserFormData = z.infer<typeof CreateUserSchema>;