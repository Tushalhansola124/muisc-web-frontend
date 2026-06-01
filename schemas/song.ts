import * as z from "zod"

export const CreateSongSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title cannot exceed 100 characters"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters"),

  artist: z
    .string()
    .min(1, "Artist is required"),

  album: z
    .string()
    .min(1, "Album is required"),

  genre: z
    .array(z.string())
    .min(1, "At least one genre is required"),

  duration: z
    .number()
    .min(1, "Duration must be at least 1 second")
    .max(3600, "Duration cannot exceed 60 minutes"),

  // isPublished: z.boolean().default(false),
  isPublished: z.boolean(),

  // Files are optional for validation (handled in form)
  audio: z.any().optional(),
  thumbnail: z.any().optional(),
})

export type CreateSongFormData = z.infer<typeof CreateSongSchema>