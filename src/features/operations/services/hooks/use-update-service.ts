"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { servicesApi } from "../services/services-api";
import { UpdateServiceDTO } from "../service.types";
import { toast } from "sonner";

export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateServiceDTO }) =>
      servicesApi.updateService(id, dto),
    onSuccess: (updatedService) => {
      queryClient.invalidateQueries({ queryKey: ["bus-services"] });
      queryClient.invalidateQueries({ queryKey: ["bus-service", updatedService.id] });
      toast.success(`Service '${updatedService.serviceCode}' updated successfully!`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update bus service.");
    },
  });
}
