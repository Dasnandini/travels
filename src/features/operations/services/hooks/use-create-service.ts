"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { servicesApi } from "../services/services-api";
import { CreateServiceDTO } from "../service.types";
import { toast } from "sonner";

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateServiceDTO) => servicesApi.createService(dto),
    onSuccess: (newService) => {
      queryClient.invalidateQueries({ queryKey: ["bus-services"] });
      toast.success(`Service '${newService.serviceCode}' created successfully!`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create bus service.");
    },
  });
}
