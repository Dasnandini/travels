import { z } from "zod";
import { isValidDateString } from "@/lib/date/date-utils";
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  DEFAULT_PASSENGERS,
  MAX_LIMIT,
  MAX_PASSENGERS,
  MIN_PASSENGERS,
} from "./bus-search.constants";

export const busSearchSchema = z.object({
  from: z
    .string({ message: "Origin stop ID ('from') is required." })
    .trim()
    .min(1, "Origin stop ID ('from') is required."),
  to: z
    .string({ message: "Destination stop ID ('to') is required." })
    .trim()
    .min(1, "Destination stop ID ('to') is required."),
  date: z
    .string({ message: "Search date ('date') is required." })
    .trim()
    .min(1, "Search date ('date') is required.")
    .refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), {
      message: "Invalid date format. Expected YYYY-MM-DD.",
    })
    .refine((val) => isValidDateString(val), {
      message: "Invalid calendar date.",
    }),
  passengers: z.coerce
    .number()
    .int("Passengers must be an integer.")
    .min(MIN_PASSENGERS, `Passengers must be at least ${MIN_PASSENGERS}.`)
    .max(MAX_PASSENGERS, `Passengers cannot exceed ${MAX_PASSENGERS}.`)
    .default(DEFAULT_PASSENGERS),
  page: z.coerce
    .number()
    .int("Page must be an integer.")
    .min(1, "Page must be at least 1.")
    .default(DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int("Limit must be an integer.")
    .min(1, "Limit must be at least 1.")
    .max(MAX_LIMIT, `Limit cannot exceed ${MAX_LIMIT}.`)
    .default(DEFAULT_LIMIT),
});

export type BusSearchSchemaInput = z.infer<typeof busSearchSchema>;
