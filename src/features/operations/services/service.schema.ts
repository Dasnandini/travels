import { z } from "zod";
import { ServiceStatus, Weekday } from "@/generated/prisma/enums";
import { SERVICE_CONSTANTS } from "./service.constants";

export const createServiceStopSchema = z.object({
  routeStopId: z.string().min(1, "Route stop ID is required."),
  arrivalTime: z.string().nullable().optional(),
  departureTime: z.string().nullable().optional(),
  boardingAllowed: z.boolean().default(true),
  droppingAllowed: z.boolean().default(true),
});

export const createServiceSchema = z.object({
  serviceCode: z
    .string()
    .transform((val) => val.trim().toUpperCase())
    .pipe(z.string().min(1, "Service code is required.")),
  name: z
    .string()
    .transform((val) => val.trim())
    .pipe(z.string().min(1, "Service name is required.")),
  busId: z.string().min(1, "Bus selection is required."),
  routeId: z.string().min(1, "Route selection is required."),
  status: z.nativeEnum(ServiceStatus).optional().default(ServiceStatus.ACTIVE),
  operatingDays: z
    .array(z.nativeEnum(Weekday))
    .min(1, "At least one operating day must be selected."),
  stops: z
    .array(createServiceStopSchema)
    .min(2, "At least start and destination service stops are required."),
});

export const updateServiceSchema = z.object({
  name: z
    .string()
    .optional()
    .transform((val) => (val?.trim() ? val.trim() : undefined)),
  status: z.nativeEnum(ServiceStatus).optional(),
  operatingDays: z
    .array(z.nativeEnum(Weekday))
    .min(1, "At least one operating day must be selected.")
    .optional(),
  stops: z
    .array(createServiceStopSchema)
    .min(2, "At least start and destination service stops are required.")
    .optional(),
});

export const listServicesQuerySchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1)
    .optional()
    .default(SERVICE_CONSTANTS.PAGINATION.DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(SERVICE_CONSTANTS.PAGINATION.MAX_LIMIT)
    .optional()
    .default(SERVICE_CONSTANTS.PAGINATION.DEFAULT_LIMIT),
  search: z
    .string()
    .optional()
    .transform((val) => (val?.trim() ? val.trim() : undefined)),
  status: z.nativeEnum(ServiceStatus).optional(),
  busId: z.string().optional(),
  routeId: z.string().optional(),
  sortBy: z
    .string()
    .optional()
    .default(SERVICE_CONSTANTS.SORT.DEFAULT_SORT_BY)
    .refine((val) => SERVICE_CONSTANTS.SORT.ALLOWED_SORT_FIELDS.includes(val), {
      message: "Invalid sort field",
    }),
  sortOrder: z.enum(["asc", "desc"]).optional().default(SERVICE_CONSTANTS.SORT.DEFAULT_SORT_ORDER),
});
