"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { routesApi } from "../services/routes-api";
import { RouteFormValues } from "../types/route.types";
import { toast } from "sonner";

export function useUpdateRoute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RouteFormValues> }) =>
      routesApi.update(id, data),
    onSuccess: (updatedRoute, variables) => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
      queryClient.invalidateQueries({ queryKey: ["route", variables.id] });
      toast.success(`Route "${updatedRoute.name}" updated successfully.`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update route. Please try again.");
    },
  });
}
