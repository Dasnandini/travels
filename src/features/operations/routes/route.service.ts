import { StopStatus } from "@/generated/prisma/enums";
import { routeRepository, RouteRepository, RouteWithStops } from "./route.repository";
import { stopRepository, StopRepository } from "../stops/stop.repository";
import { CreateRouteInput, UpdateRouteInput, ListRoutesQuery, RouteResponseDTO, StopSummaryDTO } from "./route.types";
import { ApiError } from "@/utils/api-error";
import { ROUTE_DEFAULTS } from "./route.constants";

export class RouteService {
  constructor(
    private routeRepo: RouteRepository = routeRepository,
    private stopRepo: StopRepository = stopRepository
  ) {}

  async createRoute(data: CreateRouteInput): Promise<RouteResponseDTO> {
    const name = data.name.trim();
    const code = data.code.trim().toUpperCase();

    const existingRoute = await this.routeRepo.findByCode(code);
    if (existingRoute) {
      throw ApiError.conflict(
        `Route with code '${code}' already exists.`,
        "ROUTE_CODE_EXISTS"
      );
    }

    const stopIds = data.stops.map((s) => s.stopId);
    await this.validateStops(stopIds);

    const created = await this.routeRepo.create(
      {
        ...data,
        name,
        code,
      },
      stopIds
    );

    return this.mapToDTO(created);
  }

  async listRoutes(query: ListRoutesQuery): Promise<{ items: RouteResponseDTO[]; total: number }> {
    const [items, total] = await Promise.all([
      this.routeRepo.findMany(query),
      this.routeRepo.count(query),
    ]);

    return {
      items: items.map((item) => this.mapToDTO(item)),
      total,
    };
  }

  async getRoute(id: string): Promise<RouteResponseDTO> {
    const route = await this.routeRepo.findById(id);
    if (!route) {
      throw ApiError.notFound(`Route with ID '${id}' was not found.`, "ROUTE_NOT_FOUND");
    }

    return this.mapToDTO(route);
  }

  async updateRoute(id: string, data: UpdateRouteInput): Promise<RouteResponseDTO> {
    const existingRoute = await this.routeRepo.findById(id);
    if (!existingRoute) {
      throw ApiError.notFound(`Route with ID '${id}' was not found.`, "ROUTE_NOT_FOUND");
    }

    if (data.code) {
      const codeUpper = data.code.trim().toUpperCase();
      const codeCheck = await this.routeRepo.findByCode(codeUpper);
      if (codeCheck && codeCheck.id !== id) {
        throw ApiError.conflict(
          `Another route with code '${codeUpper}' already exists.`,
          "ROUTE_CODE_EXISTS"
        );
      }
    }

    let newStopIds: string[] | undefined;
    if (data.stops && data.stops.length > 0) {
      newStopIds = data.stops.map((s) => s.stopId);
      await this.validateStops(newStopIds);
    }

    const updated = await this.routeRepo.updateWithTransaction(id, data, newStopIds);

    return this.mapToDTO(updated);
  }

  private async validateStops(stopIds: string[]): Promise<void> {
    if (stopIds.length < ROUTE_DEFAULTS.MIN_STOPS) {
      throw ApiError.badRequest(
        `A route must have at least ${ROUTE_DEFAULTS.MIN_STOPS} stops (start and end destination).`,
        "INVALID_ROUTE_STOPS"
      );
    }

    const uniqueIds = new Set(stopIds);
    if (uniqueIds.size !== stopIds.length) {
      throw ApiError.badRequest(
        "A stop cannot appear multiple times in the same route.",
        "DUPLICATE_STOP_IN_ROUTE"
      );
    }

    const fetchedStops = await Promise.all(
      stopIds.map((id) => this.stopRepo.findById(id))
    );

    for (let i = 0; i < stopIds.length; i++) {
      const stop = fetchedStops[i];
      const targetId = stopIds[i];

      if (!stop) {
        throw ApiError.badRequest(
          `Stop with ID '${targetId}' does not exist.`,
          "UNKNOWN_STOP_IN_ROUTE"
        );
      }

      if (stop.status !== StopStatus.ACTIVE) {
        throw ApiError.badRequest(
          `Stop '${stop.name}' (${stop.city}) is INACTIVE and cannot be added to a route.`,
          "INACTIVE_STOP_IN_ROUTE"
        );
      }
    }
  }

  private mapToDTO(route: RouteWithStops): RouteResponseDTO {
    const sortedStops = [...route.stops].sort((a, b) => a.sequence - b.sequence);

    const firstRouteStop = sortedStops[0];
    const lastRouteStop = sortedStops[sortedStops.length - 1];

    const startDestination: StopSummaryDTO = {
      id: firstRouteStop.stop.id,
      name: firstRouteStop.stop.name,
      city: firstRouteStop.stop.city,
      state: firstRouteStop.stop.state,
      country: firstRouteStop.stop.country,
      address: firstRouteStop.stop.address,
      status: firstRouteStop.stop.status,
    };

    const endDestination: StopSummaryDTO = {
      id: lastRouteStop.stop.id,
      name: lastRouteStop.stop.name,
      city: lastRouteStop.stop.city,
      state: lastRouteStop.stop.state,
      country: lastRouteStop.stop.country,
      address: lastRouteStop.stop.address,
      status: lastRouteStop.stop.status,
    };

    return {
      id: route.id,
      name: route.name,
      code: route.code,
      description: route.description,
      status: route.status,
      startDestination,
      endDestination,
      stops: sortedStops.map((rs) => ({
        id: rs.id,
        sequence: rs.sequence,
        stop: {
          id: rs.stop.id,
          name: rs.stop.name,
          city: rs.stop.city,
          state: rs.stop.state,
          country: rs.stop.country,
          address: rs.stop.address,
          status: rs.stop.status,
        },
      })),
      createdAt: route.createdAt.toISOString(),
      updatedAt: route.updatedAt.toISOString(),
    };
  }
}

export const routeService = new RouteService();
