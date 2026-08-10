"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { seatLayoutApi } from "../services/seat-layout-api";
import { SaveSeatLayoutDTO } from "../seat-layout.types";
import { toast } from "sonner";

export function useSaveSeatLayout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ busId, dto }: { busId: string; dto: SaveSeatLayoutDTO }) =>
      seatLayoutApi.saveBusLayout(busId, dto),
    onSuccess: (newSeats, { busId }) => {
      queryClient.invalidateQueries({ queryKey: ["bus-seats", busId] });
      queryClient.invalidateQueries({ queryKey: ["bus", busId] });
      queryClient.invalidateQueries({ queryKey: ["buses"] });
      toast.success(`Saved physical layout with ${newSeats.length} seats!`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to save seat layout.");
    },
  });
}
