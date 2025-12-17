import z from "zod";

export const createTagSchema = z.object({
  name: z.string().min(1).max(50),
});

export const updateTagSchema = z.object({
  name: z.string().min(1).max(50).optional(),
});

export type CreateTagSchema = z.infer<typeof createTagSchema>;
export type UpdateTagSchema = z.infer<typeof updateTagSchema>;