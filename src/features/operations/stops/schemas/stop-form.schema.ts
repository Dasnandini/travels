import { z } from "zod";

export const stopFormSchema = z.object({
  name: z.string().min(1, "Stop name is required."),
  city: z.string().min(1, "City is required."),
  state: z.string().min(1, "State is required."),
  country: z.string().default("India"),
  address: z.string().nullable().optional(),
  landmark: z.string().nullable().optional(),
  googlePlaceId: z.string().nullable().optional(),
  latitude: z
    .number({ message: "Latitude must be a valid number." })
    .min(-90, "Latitude must be between -90 and 90.")
    .max(90, "Latitude must be between -90 and 90.")
    .nullable()
    .optional(),
  longitude: z
    .number({ message: "Longitude must be a valid number." })
    .min(-180, "Longitude must be between -180 and 180.")
    .max(180, "Longitude must be between -180 and 180.")
    .nullable()
    .optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export type StopFormSchemaValues = z.infer<typeof stopFormSchema>;
