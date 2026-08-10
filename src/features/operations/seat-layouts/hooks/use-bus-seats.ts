"use client";

import { useQuery } from "@tanstack/react-query";
import { seatLayoutApi } from "../services/seat-layout-api";

export function useBusSeats(busId: string) {
  return useQuery({
    queryKey: ["bus-seats", busId],
    queryFn: () => seatLayoutApi.getSeatsByBusId(busId),
    enabled: Boolean(busId),
  });
}
