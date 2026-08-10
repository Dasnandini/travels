import { ApiResponse, PaginatedData, ApiErrorResponse } from "@/types/api.types";
import { RouteItem, ListRoutesParams, RouteFormValues } from "../types/route.types";

export const routesApi = {
  async list(params: ListRoutesParams): Promise<PaginatedData<RouteItem>> {
    const query = new URLSearchParams();

    if (params.page) query.set("page", params.page.toString());
    if (params.limit) query.set("limit", params.limit.toString());
    if (params.search) query.set("search", params.search);
    if (params.status) query.set("status", params.status);
    if (params.sortBy) query.set("sortBy", params.sortBy);
    if (params.sortOrder) query.set("sortOrder", params.sortOrder);

    const res = await fetch(`/api/admin/operations/routes?${query.toString()}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    const json: ApiResponse<PaginatedData<RouteItem>> = await res.json();
    if (!res.ok || !json.success) {
      const errJson = json as ApiErrorResponse;
      const msg = errJson.error?.message || "Failed to fetch routes";
      throw new Error(msg);
    }

    return json.data;
  },

  async getById(id: string): Promise<RouteItem> {
    const res = await fetch(`/api/admin/operations/routes/${id}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    const json: ApiResponse<RouteItem> = await res.json();
    if (!res.ok || !json.success) {
      const errJson = json as ApiErrorResponse;
      const msg = errJson.error?.message || "Failed to fetch route details";
      throw new Error(msg);
    }

    return json.data;
  },

  async create(data: RouteFormValues): Promise<RouteItem> {
    const res = await fetch("/api/admin/operations/routes", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
    });

    const json: ApiResponse<RouteItem> = await res.json();
    if (!res.ok || !json.success) {
      const errJson = json as ApiErrorResponse;
      const msg = errJson.error?.message || "Failed to create route";
      throw new Error(msg);
    }

    return json.data;
  },

  async update(id: string, data: Partial<RouteFormValues>): Promise<RouteItem> {
    const res = await fetch(`/api/admin/operations/routes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
    });

    const json: ApiResponse<RouteItem> = await res.json();
    if (!res.ok || !json.success) {
      const errJson = json as ApiErrorResponse;
      const msg = errJson.error?.message || "Failed to update route";
      throw new Error(msg);
    }

    return json.data;
  },
};
