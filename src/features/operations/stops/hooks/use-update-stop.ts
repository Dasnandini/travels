"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { stopsApi } from "../services/stops-api";
import { StopFormValues } from "../types/stop.types";
import { toast } from "sonner";

export function useUpdateStop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<StopFormValues> }) =>
      stopsApi.update(id, data),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ["stops"] });
      queryClient.invalidateQueries({ queryKey: ["stop", variables.id] });

      if (res.warning) {
        toast.warning(res.warning);
      } else {
        toast.success(`Stop "${res.stop.name}" updated successfully.`);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update stop. Please try again.");
    },
  });
}
