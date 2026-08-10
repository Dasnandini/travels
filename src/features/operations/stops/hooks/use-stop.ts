"use client";

import { useQuery } from "@tanstack/react-query";
import { stopsApi } from "../services/stops-api";

export function useStop(id: string) {
  return useQuery({
    queryKey: ["stop", id],
    queryFn: () => stopsApi.getById(id),
    enabled: Boolean(id),
  });
}
