import { z } from "zod";

export const createArticleSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string.min(1),
  coverImage: z.string().url().optional().nullable(),
  authorId: z.string(),
  tagIds: z.array(z.string()).optional()
})

export const updateArticleSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).optional(),
  coverImage: z.string().url().optional().nullable()
})

export type CreateArticleSchema = z.infer<typeof createArticleSchema>;
export type UpdateArticleSchema = z.infer<typeof updateArticleSchema>;