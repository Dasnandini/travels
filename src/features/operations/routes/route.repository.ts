import { prisma } from "@/lib/db/prisma";
import { Route, Prisma, RouteStatus } from "@/generated/prisma/client";
import { CreateRouteInput, UpdateRouteInput, ListRoutesQuery } from "./route.types";
import { ApiError } from "@/utils/api-error";

export type RouteWithStops = Prisma.RouteGetPayload<{
  include: {
    stops: {
      include: {
        stop: true;
      };
    };
  };
}>;

export class RouteRepository {
  async create(data: CreateRouteInput, orderedStopIds: string[]): Promise<RouteWithStops> {
    return prisma.$transaction(async (tx) => {
      const createdRoute = await tx.route.create({
        data: {
          name: data.name,
          code: data.code,
          description: data.description ?? null,
          status: RouteStatus.ACTIVE,
          stops: {
            create: orderedStopIds.map((stopId, index) => ({
              stopId,
              sequence: index + 1,
            })),
          },
        },
        include: {
          stops: {
            orderBy: { sequence: "asc" },
            include: { stop: true },
          },
        },
      });

      return createdRoute;
    });
  }

  async findByCode(code: string): Promise<Route | null> {
    return prisma.route.findUnique({
      where: { code: code.toUpperCase() },
    });
  }

  async findById(id: string): Promise<RouteWithStops | null> {
    return prisma.route.findUnique({
      where: { id },
      include: {
        stops: {
          orderBy: { sequence: "asc" },
          include: { stop: true },
        },
      },
    });
  }

  async findMany(query: ListRoutesQuery): Promise<RouteWithStops[]> {
    const where = this.buildWhereClause(query);
    const { page = 1, limit = 20, sortBy = "name", sortOrder = "asc" } = query;
    const skip = (page - 1) * limit;

    return prisma.route.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        stops: {
          orderBy: { sequence: "asc" },
          include: { stop: true },
        },
      },
    });
  }

  async count(query: ListRoutesQuery): Promise<number> {
    const where = this.buildWhereClause(query);
    return prisma.route.count({ where });
  }

  async updateWithTransaction(
    id: string,
    data: UpdateRouteInput,
    newOrderedStopIds?: string[]
  ): Promise<RouteWithStops> {
    return prisma.$transaction(async (tx) => {
      const updateData: Prisma.RouteUpdateInput = {};

      if (data.name !== undefined) updateData.name = data.name.trim();
      if (data.code !== undefined) updateData.code = data.code.trim().toUpperCase();
      if (data.description !== undefined) updateData.description = data.description;
      if (data.status !== undefined) updateData.status = data.status;

      if (newOrderedStopIds && newOrderedStopIds.length > 0) {
        const existingRouteStops = await tx.routeStop.findMany({
          where: { routeId: id },
          orderBy: { sequence: "asc" },
        });

        const currentStopIds = existingRouteStops.map((rs) => rs.stopId);
        const stopsChanged =
          newOrderedStopIds.length !== currentStopIds.length ||
          newOrderedStopIds.some((stopId, index) => stopId !== currentStopIds[index]);

        if (stopsChanged) {
          const activeServiceStopsCount = await tx.serviceStop.count({
            where: { routeStopId: { in: existingRouteStops.map((rs) => rs.id) } },
          });

          if (activeServiceStopsCount > 0) {
            throw ApiError.badRequest(
              "Cannot modify stops on this route because it is assigned to active bus services. Please update or remove the bus services first.",
              "ROUTE_IN_USE"
            );
          }

          // Delete existing route stops for this route
          await tx.routeStop.deleteMany({
            where: { routeId: id },
          });

          // Re-create new route stops with sequence 1..N
          updateData.stops = {
            create: newOrderedStopIds.map((stopId, index) => ({
              stopId,
              sequence: index + 1,
            })),
          };
        }
      }

      const updatedRoute = await tx.route.update({
        where: { id },
        data: updateData,
        include: {
          stops: {
            orderBy: { sequence: "asc" },
            include: { stop: true },
          },
        },
      });

      return updatedRoute;
    });
  }

  private buildWhereClause(query: ListRoutesQuery): Prisma.RouteWhereInput {
    const where: Prisma.RouteWhereInput = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      const searchTerm = query.search.trim();
      where.OR = [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { code: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
        {
          stops: {
            some: {
              stop: {
                OR: [
                  { name: { contains: searchTerm, mode: "insensitive" } },
                  { city: { contains: searchTerm, mode: "insensitive" } },
                ],
              },
            },
          },
        },
      ];
    }

    return where;
  }
}

export const routeRepository = new RouteRepository();
