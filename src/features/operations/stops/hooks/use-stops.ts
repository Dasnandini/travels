"use client";

import { useQuery } from "@tanstack/react-query";
import { stopsApi } from "../services/stops-api";
import { ListStopsParams } from "../types/stop.types";

export function useStops(params: ListStopsParams) {
  return useQuery({
    queryKey: ["stops", params],
    queryFn: () => stopsApi.list(params),
    placeholderData: (previousData) => previousData,
  });
}
