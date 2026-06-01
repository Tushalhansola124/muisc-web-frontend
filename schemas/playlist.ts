import * as z from "zod";

export const CreatePlaylistSchema = z.object({
  name: z
    .string()
    .min(3, "Playlist name must be at least 3 characters")
    .max(100, "Playlist name cannot exceed 100 characters"),

  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional()
    .default(""),

  songs: z
    .array(z.string())
    .min(1, "Please select at least one song"),
});
export type CreatePlaylistFormData = z.infer<typeof CreatePlaylistSchema>;