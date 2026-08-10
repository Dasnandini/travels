"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { busesApi } from "../services/buses-api";
import { CreateBusDTO } from "../bus.types";
import { toast } from "sonner";

export function useCreateBus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateBusDTO) => busesApi.createBus(dto),
    onSuccess: (newBus) => {
      queryClient.invalidateQueries({ queryKey: ["buses"] });
      toast.success(`Bus '${newBus.busNumber}' created successfully!`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create bus.");
    },
  });
}
