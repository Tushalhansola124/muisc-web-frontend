import * as z from "zod"

export const CreateAlbumSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title must be less than 100 characters"),

  artist: z
    .string()
    .min(1, "Artist ID is required"),

  releaseDate: z
    .string()
    .min(1, "Release date is required")
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Please enter a valid date",
    }),

  coverImage: z
    .any()
    .optional()
    .refine((file) => {
      if (!file || !file[0]) return true // Optional for edit
      const fileSize = file[0].size
      return fileSize <= 5 * 1024 * 1024 // 5MB limit
    }, "Image size must be less than 5MB")
    .refine((file) => {
      if (!file || !file[0]) return true
      return ["image/jpeg", "image/png", "image/webp"].includes(file[0].type)
    }, "Only JPEG, PNG and WebP images are allowed"),
})

export type CreateAlbumFormData = z.infer<typeof CreateAlbumSchema>