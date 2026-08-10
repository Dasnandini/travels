import { serviceRepository } from "./service.repository";
import { busRepository } from "@/features/operations/buses/bus.repository";
import { routeService } from "@/features/operations/routes/route.service";
import { CreateServiceDTO, UpdateServiceDTO, ListServicesQueryDTO, BusServiceItem } from "./service.types";
import { ApiError } from "@/utils/api-error";
import { SERVICE_CONSTANTS } from "./service.constants";
import { BusStatus, RouteStatus } from "@/generated/prisma/enums";

export class ServiceService {
  private formatService(raw: any): BusServiceItem {
    // Sort service stops by routeStop sequence
    const sortedStops = [...(raw.stops || [])].sort(
      (a: any, b: any) => (a.routeStop?.sequence || 0) - (b.routeStop?.sequence || 0)
    );

    const stops = sortedStops.map((st: any) => ({
      id: st.id,
      routeStopId: st.routeStopId,
      sequence: st.routeStop?.sequence || 0,
      stopName: st.routeStop?.stop?.name || "",
      city: st.routeStop?.stop?.city || "",
      state: st.routeStop?.stop?.state || "",
      arrivalTime: st.arrivalTime || null,
      departureTime: st.departureTime || null,
      boardingAllowed: st.boardingAllowed ?? true,
      droppingAllowed: st.droppingAllowed ?? true,
    }));

    const createdAtStr = raw.createdAt ? new Date(raw.createdAt).toISOString() : new Date().toISOString();
    const updatedAtStr = raw.updatedAt ? new Date(raw.updatedAt).toISOString() : new Date().toISOString();

    const busFormatted = raw.bus
      ? {
          id: raw.bus.id,
          busNumber: raw.bus.busNumber,
          registrationNumber: raw.bus.registrationNumber,
          name: raw.bus.name ?? null,
          type: raw.bus.type,
          description: raw.bus.description ?? null,
          status: raw.bus.status,
          seatCount: raw.bus._count?.seats ?? 0,
          createdAt: raw.bus.createdAt ? new Date(raw.bus.createdAt).toISOString() : new Date().toISOString(),
          updatedAt: raw.bus.updatedAt ? new Date(raw.bus.updatedAt).toISOString() : new Date().toISOString(),
        }
      : null;

    const routeStops = raw.route?.stops || [];
    const routeFormatted = raw.route
      ? {
          id: raw.route.id,
          name: raw.route.name,
          code: raw.route.code,
          description: raw.route.description ?? null,
          status: raw.route.status,
          createdAt: raw.route.createdAt ? new Date(raw.route.createdAt).toISOString() : new Date().toISOString(),
          updatedAt: raw.route.updatedAt ? new Date(raw.route.updatedAt).toISOString() : new Date().toISOString(),
          startDestination: {
            id: routeStops[0]?.stop?.id || "",
            name: routeStops[0]?.stop?.name || "",
            city: routeStops[0]?.stop?.city || "",
            state: routeStops[0]?.stop?.state || "",
            country: routeStops[0]?.stop?.country || "India",
          },
          endDestination: {
            id: routeStops[routeStops.length - 1]?.stop?.id || "",
            name: routeStops[routeStops.length - 1]?.stop?.name || "",
            city: routeStops[routeStops.length - 1]?.stop?.city || "",
            state: routeStops[routeStops.length - 1]?.stop?.state || "",
            country: routeStops[routeStops.length - 1]?.stop?.country || "India",
          },
          stops: routeStops.map((rs: any) => ({
            id: rs.id,
            sequence: rs.sequence,
            stop: {
              id: rs.stop?.id || "",
              name: rs.stop?.name || "",
              city: rs.stop?.city || "",
              state: rs.stop?.state || "",
              country: rs.stop?.country || "India",
            },
          })),
        }
      : null;

    return {
      id: raw.id,
      serviceCode: raw.serviceCode,
      name: raw.name,
      busId: raw.busId,
      routeId: raw.routeId,
      status: raw.status,
      createdAt: createdAtStr,
      updatedAt: updatedAtStr,
      bus: busFormatted as any,
      route: routeFormatted as any,
      operatingDays: (raw.operatingDays || []).map((od: any) => od.day),
      stops,
    };
  }

  async listServices(params: ListServicesQueryDTO) {
    const validatedParams = {
      page: params.page || SERVICE_CONSTANTS.PAGINATION.DEFAULT_PAGE,
      limit: params.limit || SERVICE_CONSTANTS.PAGINATION.DEFAULT_LIMIT,
      search: params.search,
      status: params.status,
      busId: params.busId,
      routeId: params.routeId,
      sortBy: params.sortBy || SERVICE_CONSTANTS.SORT.DEFAULT_SORT_BY,
      sortOrder: params.sortOrder || SERVICE_CONSTANTS.SORT.DEFAULT_SORT_ORDER,
    };

    const result = await serviceRepository.findMany(validatedParams);

    return {
      items: result.items.map((svc) => this.formatService(svc)),
      pagination: result.pagination,
    };
  }

  async getServiceById(id: string): Promise<BusServiceItem> {
    const service = await serviceRepository.findById(id);
    if (!service) {
      throw ApiError.notFound(`Bus service with ID '${id}' not found.`);
    }
    return this.formatService(service);
  }

  async createService(dto: CreateServiceDTO): Promise<BusServiceItem> {
    // 1. Verify Bus exists and is ACTIVE
    const bus = await busRepository.findById(dto.busId);
    if (!bus) {
      throw ApiError.notFound(`Bus with ID '${dto.busId}' not found.`);
    }
    if (bus.status !== BusStatus.ACTIVE) {
      throw ApiError.badRequest(`Cannot assign service to a bus with status '${bus.status}'. Only ACTIVE buses are allowed.`);
    }

    // 2. Verify Route exists and is ACTIVE
    const route = await routeService.getRoute(dto.routeId);
    if (!route) {
      throw ApiError.notFound(`Route with ID '${dto.routeId}' not found.`);
    }
    if (route.status !== RouteStatus.ACTIVE) {
      throw ApiError.badRequest(`Cannot assign service to a route with status '${route.status}'. Only ACTIVE routes are allowed.`);
    }

    // 3. Check duplicate service code
    const existingCode = await serviceRepository.findByServiceCode(dto.serviceCode);
    if (existingCode) {
      throw ApiError.conflict(`A bus service with code '${dto.serviceCode.toUpperCase()}' already exists.`);
    }

    // 4. Validate timetable boarding & dropping rules
    const boardingCount = dto.stops.filter((s) => s.boardingAllowed).length;
    if (boardingCount === 0) {
      throw ApiError.badRequest("At least one boarding point must be enabled for the service.");
    }

    const droppingCount = dto.stops.filter((s) => s.droppingAllowed).length;
    if (droppingCount === 0) {
      throw ApiError.badRequest("At least one dropping point must be enabled for the service.");
    }

    // Map routeStopId to actual RouteStop.id if client provided Stop.id
    const routeStopMap = new Map<string, string>();
    route.stops.forEach((rs) => {
      routeStopMap.set(rs.id, rs.id);
      routeStopMap.set(rs.stop.id, rs.id);
    });

    const resolvedStops = dto.stops.map((s) => ({
      ...s,
      routeStopId: routeStopMap.get(s.routeStopId) || s.routeStopId,
    }));

    const created = await serviceRepository.create({
      ...dto,
      stops: resolvedStops,
    });
    return this.formatService(created);
  }

  async updateService(id: string, dto: UpdateServiceDTO): Promise<BusServiceItem> {
    const existing = await serviceRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound(`Bus service with ID '${id}' not found.`);
    }

    if (dto.stops) {
      const boardingCount = dto.stops.filter((s) => s.boardingAllowed).length;
      if (boardingCount === 0) {
        throw ApiError.badRequest("At least one boarding point must be enabled for the service.");
      }

      const droppingCount = dto.stops.filter((s) => s.droppingAllowed).length;
      if (droppingCount === 0) {
        throw ApiError.badRequest("At least one dropping point must be enabled for the service.");
      }

      const route = await routeService.getRoute(existing.routeId);
      const routeStopMap = new Map<string, string>();
      route.stops.forEach((rs) => {
        routeStopMap.set(rs.id, rs.id);
        routeStopMap.set(rs.stop.id, rs.id);
      });

      dto.stops = dto.stops.map((s) => ({
        ...s,
        routeStopId: routeStopMap.get(s.routeStopId) || s.routeStopId,
      }));
    }

    const updated = await serviceRepository.update(id, dto);
    return this.formatService(updated);
  }
}

export const serviceService = new ServiceService();
