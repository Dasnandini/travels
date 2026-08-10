"use client";

import { useQuery } from "@tanstack/react-query";
import { busesApi } from "../services/buses-api";

export function useBus(id: string) {
  return useQuery({
    queryKey: ["bus", id],
    queryFn: () => busesApi.getBusById(id),
    enabled: Boolean(id),
  });
}
