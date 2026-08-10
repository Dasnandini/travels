import { z } from "zod";

export const routeFormSchema = z.object({
  name: z.string().min(1, "Route name is required."),
  code: z.string().min(1, "Route code is required."),
  description: z.string().nullable().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
  stops: z
    .array(
      z.object({
        stopId: z.string().min(1, "Stop ID is required."),
      })
    )
    .min(2, "A route must contain at least a start and end destination."),
});

export type RouteFormSchemaValues = z.infer<typeof routeFormSchema>;
