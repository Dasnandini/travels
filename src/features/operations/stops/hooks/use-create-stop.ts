"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { stopsApi } from "../services/stops-api";
import { StopFormValues } from "../types/stop.types";
import { toast } from "sonner";

export function useCreateStop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StopFormValues) => stopsApi.create(data),
    onSuccess: (newStop) => {
      queryClient.invalidateQueries({ queryKey: ["stops"] });
      toast.success(`Stop "${newStop.name}" created successfully.`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create stop. Please try again.");
    },
  });
}
