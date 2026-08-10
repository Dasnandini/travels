import { z } from "zod";
import { StopStatus } from "@/generated/prisma/enums";

export const createStopSchema = z.object({
  name: z.string().min(1, "Stop name is required"),
  code: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().optional().default("India"),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  address: z.string().optional().nullable(),
  landmark: z.string().optional().nullable(),
  googlePlaceId: z.string().optional().nullable(),
  status: z.nativeEnum(StopStatus).optional().default("ACTIVE"),
});

export const updateStopSchema = createStopSchema.partial();

export const listStopsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  search: z.string().optional(),
  city: z.string().optional(),
  status: z.nativeEnum(StopStatus).optional(),
  sortBy: z.string().optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});
