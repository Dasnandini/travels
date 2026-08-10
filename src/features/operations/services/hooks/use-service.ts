"use client";

import { useQuery } from "@tanstack/react-query";
import { servicesApi } from "../services/services-api";

export function useService(id: string) {
  return useQuery({
    queryKey: ["bus-service", id],
    queryFn: () => servicesApi.getServiceById(id),
    enabled: Boolean(id),
  });
}
