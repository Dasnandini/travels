import { ApiResponse, PaginatedData, ApiErrorResponse } from "@/types/api.types";
import { StopItem, ListStopsParams, StopFormValues, PlaceSearchItem } from "../types/stop.types";

export const stopsApi = {
  async list(params: ListStopsParams): Promise<PaginatedData<StopItem>> {
    const query = new URLSearchParams();

    if (params.page) query.set("page", params.page.toString());
    if (params.limit) query.set("limit", params.limit.toString());
    if (params.search) query.set("search", params.search);
    if (params.city) query.set("city", params.city);
    if (params.state) query.set("state", params.state);
    if (params.status) query.set("status", params.status);
    if (params.sortBy) query.set("sortBy", params.sortBy);
    if (params.sortOrder) query.set("sortOrder", params.sortOrder);

    const res = await fetch(`/api/admin/operations/stops?${query.toString()}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    const json: ApiResponse<PaginatedData<StopItem>> = await res.json();
    if (!res.ok || !json.success) {
      const errJson = json as ApiErrorResponse;
      const msg = errJson.error?.message || "Failed to fetch stops";
      throw new Error(msg);
    }

    return json.data;
  },

  async getById(id: string): Promise<StopItem> {
    const res = await fetch(`/api/admin/operations/stops/${id}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    const json: ApiResponse<StopItem> = await res.json();
    if (!res.ok || !json.success) {
      const errJson = json as ApiErrorResponse;
      const msg = errJson.error?.message || "Failed to fetch stop details";
      throw new Error(msg);
    }

    return json.data;
  },

  async create(data: StopFormValues): Promise<StopItem> {
    const res = await fetch("/api/admin/operations/stops", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
    });

    const json: ApiResponse<StopItem> = await res.json();
    if (!res.ok || !json.success) {
      const errJson = json as ApiErrorResponse;
      const msg = errJson.error?.message || "Failed to create stop";
      throw new Error(msg);
    }

    return json.data;
  },

  async update(id: string, data: Partial<StopFormValues>): Promise<{ stop: StopItem; warning?: string }> {
    const res = await fetch(`/api/admin/operations/stops/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
    });

    const json: ApiResponse<StopItem & { warning?: string }> = await res.json();
    if (!res.ok || !json.success) {
      const errJson = json as ApiErrorResponse;
      const msg = errJson.error?.message || "Failed to update stop";
      throw new Error(msg);
    }

    const { warning, ...stopData } = json.data;
    return { stop: stopData as StopItem, warning };
  },

  async searchPlaces(queryStr: string): Promise<PlaceSearchItem[]> {
    if (!queryStr.trim()) return [];

    const res = await fetch(`/api/admin/operations/stops/search-place?query=${encodeURIComponent(queryStr.trim())}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    const json: ApiResponse<PlaceSearchItem[]> = await res.json();
    if (!res.ok || !json.success) {
      return [];
    }

    return json.data;
  },
};
