import { BusSeatItem, SaveSeatLayoutDTO, UpdateSeatDTO } from "../seat-layout.types";
import { ApiErrorResponse, ApiSuccessResponse } from "@/types/api.types";

export const seatLayoutApi = {
  async getSeatsByBusId(busId: string) {
    const res = await fetch(`/api/admin/operations/buses/${busId}/seats`);
    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error((json as ApiErrorResponse).error?.message || "Failed to fetch seat layout.");
    }

    return (json as ApiSuccessResponse<BusSeatItem[]>).data;
  },

  async saveBusLayout(busId: string, dto: SaveSeatLayoutDTO) {
    const res = await fetch(`/api/admin/operations/buses/${busId}/seats/layout`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error((json as ApiErrorResponse).error?.message || "Failed to save seat layout.");
    }

    return (json as ApiSuccessResponse<BusSeatItem[]>).data;
  },

  async updateSingleSeat(busId: string, seatId: string, dto: UpdateSeatDTO) {
    const res = await fetch(`/api/admin/operations/buses/${busId}/seats/${seatId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error((json as ApiErrorResponse).error?.message || "Failed to update seat.");
    }

    return (json as ApiSuccessResponse<BusSeatItem>).data;
  },
};
