"use client";

import { useQuery } from "@tanstack/react-query";
import { busesApi } from "../services/buses-api";
import { ListBusesQueryDTO } from "../bus.types";

export function useBuses(params: ListBusesQueryDTO = {}) {
  return useQuery({
    queryKey: ["buses", params],
    queryFn: () => busesApi.getBuses(params),
  });
}
