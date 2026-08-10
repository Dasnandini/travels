"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { routesApi } from "../services/routes-api";
import { RouteFormValues } from "../types/route.types";
import { toast } from "sonner";

export function useCreateRoute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RouteFormValues) => routesApi.create(data),
    onSuccess: (newRoute) => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
      toast.success(`Route "${newRoute.name}" (${newRoute.code}) created successfully.`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create route. Please try again.");
    },
  });
}
