import { z } from "zod";
import { RouteStatus } from "@/generated/prisma/enums";

export const createRouteSchema = z.object({
  name: z.string().min(1, "Route name is required"),
  code: z.string().min(1, "Route code is required"),
  description: z.string().optional().nullable(),
  status: z.nativeEnum(RouteStatus).optional().default("ACTIVE"),
  stops: z.array(z.object({ stopId: z.string() })).min(2, "At least 2 stops are required"),
});

export const updateRouteSchema = createRouteSchema.partial();

export const listRoutesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  search: z.string().optional(),
  status: z.nativeEnum(RouteStatus).optional(),
  sortBy: z.enum(["name", "code", "status", "createdAt", "updatedAt"]).optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});
