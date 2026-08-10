"use client";

import { useQuery } from "@tanstack/react-query";
import { routesApi } from "../services/routes-api";
import { ListRoutesParams } from "../types/route.types";

export function useRoutes(params: ListRoutesParams) {
  return useQuery({
    queryKey: ["routes", params],
    queryFn: () => routesApi.list(params),
    placeholderData: (previousData) => previousData,
  });
}
