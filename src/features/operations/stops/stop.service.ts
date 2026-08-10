import { stopRepository } from "./stop.repository";
import { CreateStopInput, UpdateStopInput, ListStopsQuery, StopResponseDTO } from "./stop.types";
import { StopStatus } from "@/generated/prisma/enums";
import type { Stop } from "@/generated/prisma/client";
import { ApiError } from "@/utils/api-error";

export class StopService {
  async createStop(data: CreateStopInput): Promise<StopResponseDTO> {
    const existing = await stopRepository.findByIdentity(data.name, data.city, data.state);
    if (existing) {
      throw ApiError.conflict(`Stop '${data.name}' already exists in ${data.city}, ${data.state}`);
    }

    const created = await stopRepository.create(data);
    return this.mapToDTO(created);
  }

  async getStop(id: string): Promise<StopResponseDTO> {
    const stop = await stopRepository.findById(id);
    if (!stop) {
      throw ApiError.notFound(`Stop with ID '${id}' not found`);
    }
    return this.mapToDTO(stop);
  }

  async listStops(query: ListStopsQuery) {
    const items = await stopRepository.findMany(query);
    const total = await stopRepository.count(query);
    return {
      items: items.map((item) => this.mapToDTO(item)),
      total,
    };
  }

  async updateStop(
    id: string,
    data: UpdateStopInput
  ): Promise<{ stop: StopResponseDTO; warning?: string }> {
    const existing = await stopRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound(`Stop with ID '${id}' not found`);
    }

    let warning: string | undefined;

    if (data.city && data.city !== existing.city) {
      const activeRoutes = await stopRepository.countActiveRoutesForStop(id);
      if (activeRoutes > 0) {
        warning = `City updated from '${existing.city}' to '${data.city}'. Note: This stop is currently used in ${activeRoutes} active route(s).`;
      }
    }

    const updated = await stopRepository.update(id, data);

    return {
      stop: this.mapToDTO(updated),
      ...(warning && { warning }),
    };
  }

  private mapToDTO(stop: Stop): StopResponseDTO {
    return {
      id: stop.id,
      name: stop.name,
      code: stop.name.slice(0, 3).toUpperCase(),
      city: stop.city,
      state: stop.state,
      country: stop.country,
      address: stop.address,
      landmark: stop.landmark,
      googlePlaceId: stop.googlePlaceId,
      latitude: stop.latitude ? Number(stop.latitude) : null,
      longitude: stop.longitude ? Number(stop.longitude) : null,
      status: stop.status as any,
      createdAt: stop.createdAt.toISOString(),
      updatedAt: stop.updatedAt.toISOString(),
    };
  }
}

export const stopService = new StopService();
