"use client";

import { useQuery } from "@tanstack/react-query";
import { routesApi } from "../services/routes-api";

export function useRoute(id: string) {
  return useQuery({
    queryKey: ["route", id],
    queryFn: () => routesApi.getById(id),
    enabled: Boolean(id),
  });
}
