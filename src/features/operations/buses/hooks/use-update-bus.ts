"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { busesApi } from "../services/buses-api";
import { UpdateBusDTO } from "../bus.types";
import { toast } from "sonner";

export function useUpdateBus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateBusDTO }) =>
      busesApi.updateBus(id, dto),
    onSuccess: (updatedBus) => {
      queryClient.invalidateQueries({ queryKey: ["buses"] });
      queryClient.invalidateQueries({ queryKey: ["bus", updatedBus.id] });
      toast.success(`Bus '${updatedBus.busNumber}' updated successfully!`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update bus.");
    },
  });
}
