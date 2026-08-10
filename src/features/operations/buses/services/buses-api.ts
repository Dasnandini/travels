import { BusItem, CreateBusDTO, UpdateBusDTO, ListBusesQueryDTO } from "../bus.types";
import { ApiErrorResponse, ApiSuccessResponse } from "@/types/api.types";

export const busesApi = {
  async getBuses(params: ListBusesQueryDTO = {}) {
    const query = new URLSearchParams();
    if (params.page) query.set("page", params.page.toString());
    if (params.limit) query.set("limit", params.limit.toString());
    if (params.search) query.set("search", params.search);
    if (params.type) query.set("type", params.type);
    if (params.status) query.set("status", params.status);
    if (params.sortBy) query.set("sortBy", params.sortBy);
    if (params.sortOrder) query.set("sortOrder", params.sortOrder);

    const res = await fetch(`/api/admin/operations/buses?${query.toString()}`);
    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error((json as ApiErrorResponse).error?.message || "Failed to fetch buses.");
    }

    return (json as ApiSuccessResponse<{ items: BusItem[]; pagination: any }>).data;
  },

  async getBusById(id: string) {
    const res = await fetch(`/api/admin/operations/buses/${id}`);
    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error((json as ApiErrorResponse).error?.message || "Failed to fetch bus details.");
    }

    return (json as ApiSuccessResponse<BusItem>).data;
  },

  async createBus(dto: CreateBusDTO) {
    const res = await fetch("/api/admin/operations/buses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error((json as ApiErrorResponse).error?.message || "Failed to create bus.");
    }

    return (json as ApiSuccessResponse<BusItem>).data;
  },

  async updateBus(id: string, dto: UpdateBusDTO) {
    const res = await fetch(`/api/admin/operations/buses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error((json as ApiErrorResponse).error?.message || "Failed to update bus.");
    }

    return (json as ApiSuccessResponse<BusItem>).data;
  },
};
