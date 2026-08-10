"use client";

import { useQuery } from "@tanstack/react-query";
import { servicesApi } from "../services/services-api";
import { ListServicesQueryDTO } from "../service.types";

export function useServices(params: ListServicesQueryDTO = {}) {
  return useQuery({
    queryKey: ["bus-services", params],
    queryFn: () => servicesApi.getServices(params),
  });
}
