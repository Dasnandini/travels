import { z } from "zod";
import { BusType, BusStatus } from "@/generated/prisma/enums";
import { BUS_CONSTANTS } from "./bus.constants";

export const createBusSchema = z.object({
  busNumber: z
    .string()
    .transform((val) => val.trim().toUpperCase())
    .pipe(z.string().min(1, "Bus number is required.")),
  registrationNumber: z
    .string()
    .transform((val) => val.trim().toUpperCase())
    .pipe(z.string().min(1, "Registration number is required.")),
  name: z
    .string()
    .optional()
    .transform((val) => (val?.trim() ? val.trim() : undefined)),
  type: z.nativeEnum(BusType, {
    message: "Invalid bus type. Allowed: SEATER, SEMI_SLEEPER, SLEEPER",
  }),
  description: z
    .string()
    .optional()
    .transform((val) => (val?.trim() ? val.trim() : undefined)),
  status: z.nativeEnum(BusStatus).optional().default(BusStatus.ACTIVE),
});

export const updateBusSchema = z.object({
  name: z
    .string()
    .optional()
    .transform((val) => (val?.trim() ? val.trim() : undefined)),
  type: z.nativeEnum(BusType).optional(),
  description: z
    .string()
    .optional()
    .transform((val) => (val?.trim() ? val.trim() : undefined)),
  status: z.nativeEnum(BusStatus).optional(),
});

export const listBusesQuerySchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1)
    .optional()
    .default(BUS_CONSTANTS.PAGINATION.DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(BUS_CONSTANTS.PAGINATION.MAX_LIMIT)
    .optional()
    .default(BUS_CONSTANTS.PAGINATION.DEFAULT_LIMIT),
  search: z
    .string()
    .optional()
    .transform((val) => (val?.trim() ? val.trim() : undefined)),
  type: z.nativeEnum(BusType).optional(),
  status: z.nativeEnum(BusStatus).optional(),
  sortBy: z
    .string()
    .optional()
    .default(BUS_CONSTANTS.SORT.DEFAULT_SORT_BY)
    .refine((val) => BUS_CONSTANTS.SORT.ALLOWED_SORT_FIELDS.includes(val), {
      message: "Invalid sort field",
    }),
  sortOrder: z.enum(["asc", "desc"]).optional().default(BUS_CONSTANTS.SORT.DEFAULT_SORT_ORDER),
});
