import { busRepository } from "./bus.repository";
import { CreateBusDTO, UpdateBusDTO, ListBusesQueryDTO, BusItem } from "./bus.types";
import { ApiError } from "@/utils/api-error";
import { BUS_CONSTANTS } from "./bus.constants";

export class BusService {
  private formatBus(bus: any): BusItem {
    return {
      id: bus.id,
      busNumber: bus.busNumber,
      registrationNumber: bus.registrationNumber,
      name: bus.name ?? null,
      type: bus.type,
      description: bus.description ?? null,
      status: bus.status,
      seatCount: bus._count?.seats ?? 0,
      createdAt: bus.createdAt ? new Date(bus.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: bus.updatedAt ? new Date(bus.updatedAt).toISOString() : new Date().toISOString(),
    };
  }

  async listBuses(params: ListBusesQueryDTO) {
    const validatedParams = {
      page: params.page || BUS_CONSTANTS.PAGINATION.DEFAULT_PAGE,
      limit: params.limit || BUS_CONSTANTS.PAGINATION.DEFAULT_LIMIT,
      search: params.search,
      type: params.type,
      status: params.status,
      sortBy: params.sortBy || BUS_CONSTANTS.SORT.DEFAULT_SORT_BY,
      sortOrder: params.sortOrder || BUS_CONSTANTS.SORT.DEFAULT_SORT_ORDER,
    };

    const result = await busRepository.findMany(validatedParams);

    return {
      items: result.items.map((bus) => this.formatBus(bus)),
      pagination: result.pagination,
    };
  }

  async getBusById(id: string): Promise<BusItem> {
    const bus = await busRepository.findById(id);
    if (!bus) {
      throw ApiError.notFound(`Bus with ID '${id}' not found.`);
    }
    return this.formatBus(bus);
  }

  async createBus(dto: CreateBusDTO): Promise<BusItem> {
    const existingBusNumber = await busRepository.findByBusNumber(dto.busNumber);
    if (existingBusNumber) {
      throw ApiError.conflict(`A bus with bus number '${dto.busNumber.toUpperCase()}' already exists.`);
    }

    const existingReg = await busRepository.findByRegistrationNumber(dto.registrationNumber);
    if (existingReg) {
      throw ApiError.conflict(`A bus with registration number '${dto.registrationNumber.toUpperCase()}' already exists.`);
    }

    const bus = await busRepository.create(dto);
    return this.formatBus(bus);
  }

  async updateBus(id: string, dto: UpdateBusDTO): Promise<BusItem> {
    const existing = await busRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound(`Bus with ID '${id}' not found.`);
    }

    const updated = await busRepository.update(id, dto);
    return this.formatBus(updated);
  }
}

export const busService = new BusService();
