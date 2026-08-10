import { BusServiceItem, CreateServiceDTO, UpdateServiceDTO, ListServicesQueryDTO } from "../service.types";
import { ApiErrorResponse, ApiSuccessResponse } from "@/types/api.types";

export const servicesApi = {
  async getServices(params: ListServicesQueryDTO = {}) {
    const query = new URLSearchParams();
    if (params.page) query.set("page", params.page.toString());
    if (params.limit) query.set("limit", params.limit.toString());
    if (params.search) query.set("search", params.search);
    if (params.status) query.set("status", params.status);
    if (params.busId) query.set("busId", params.busId);
    if (params.routeId) query.set("routeId", params.routeId);
    if (params.sortBy) query.set("sortBy", params.sortBy);
    if (params.sortOrder) query.set("sortOrder", params.sortOrder);

    const res = await fetch(`/api/admin/operations/services?${query.toString()}`);
    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error((json as ApiErrorResponse).error?.message || "Failed to fetch services.");
    }

    return (json as ApiSuccessResponse<{ items: BusServiceItem[]; pagination: any }>).data;
  },

  async getServiceById(id: string) {
    const res = await fetch(`/api/admin/operations/services/${id}`);
    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error((json as ApiErrorResponse).error?.message || "Failed to fetch service details.");
    }

    return (json as ApiSuccessResponse<BusServiceItem>).data;
  },

  async createService(dto: CreateServiceDTO) {
    const res = await fetch("/api/admin/operations/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error((json as ApiErrorResponse).error?.message || "Failed to create service.");
    }

    return (json as ApiSuccessResponse<BusServiceItem>).data;
  },

  async updateService(id: string, dto: UpdateServiceDTO) {
    const res = await fetch(`/api/admin/operations/services/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error((json as ApiErrorResponse).error?.message || "Failed to update service.");
    }

    return (json as ApiSuccessResponse<BusServiceItem>).data;
  },
};
