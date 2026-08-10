import { z } from "zod";

export const paginationQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .pipe(z.number().int().min(1, "Page must be at least 1")),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 20))
    .pipe(
      z
        .number()
        .int()
        .min(1, "Limit must be at least 1")
        .max(100, "Limit cannot exceed 100")
    ),
  search: z.string().optional().transform((val) => val?.trim() || undefined),
  sortOrder: z
    .enum(["asc", "desc"])
    .optional()
    .default("asc"),
});

export type PaginationQueryInput = z.infer<typeof paginationQuerySchema>;
