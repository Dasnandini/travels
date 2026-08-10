import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { CreateServiceDTO, UpdateServiceDTO, ListServicesQueryDTO } from "./service.types";
import { SERVICE_CONSTANTS } from "./service.constants";

export class ServiceRepository {
  private serviceInclude = {
    bus: {
      include: {
        _count: { select: { seats: true } },
      },
    },
    route: {
      include: {
        stops: {
          orderBy: { sequence: "asc" as const },
          include: { stop: true },
        },
      },
    },
    operatingDays: true,
    stops: {
      include: {
        routeStop: {
          include: { stop: true },
        },
      },
    },
  };

  async findById(id: string) {
    return prisma.busService.findUnique({
      where: { id },
      include: this.serviceInclude,
    });
  }

  async findByServiceCode(serviceCode: string) {
    return prisma.busService.findUnique({
      where: { serviceCode: serviceCode.toUpperCase() },
    });
  }

  async findActiveServicesByBusId(busId: string) {
    return prisma.busService.findMany({
      where: {
        busId,
        status: "ACTIVE",
      },
      include: {
        operatingDays: true,
        stops: true,
      },
    });
  }

  async create(data: CreateServiceDTO) {
    return prisma.$transaction(async (tx) => {
      const service = await tx.busService.create({
        data: {
          serviceCode: data.serviceCode.toUpperCase(),
          name: data.name,
          busId: data.busId,
          routeId: data.routeId,
          status: data.status,
          operatingDays: {
            createMany: {
              data: data.operatingDays.map((day) => ({ day })),
            },
          },
          stops: {
            createMany: {
              data: data.stops.map((s) => ({
                routeStopId: s.routeStopId,
                arrivalTime: s.arrivalTime,
                departureTime: s.departureTime,
                boardingAllowed: s.boardingAllowed,
                droppingAllowed: s.droppingAllowed,
              })),
            },
          },
        },
        include: this.serviceInclude,
      });

      return service;
    });
  }

  async update(id: string, data: UpdateServiceDTO) {
    return prisma.$transaction(async (tx) => {
      if (data.operatingDays) {
        await tx.serviceOperatingDay.deleteMany({
          where: { serviceId: id },
        });
        await tx.serviceOperatingDay.createMany({
          data: data.operatingDays.map((day) => ({ serviceId: id, day })),
        });
      }

      if (data.stops) {
        await tx.serviceStop.deleteMany({
          where: { serviceId: id },
        });
        await tx.serviceStop.createMany({
          data: data.stops.map((s) => ({
            serviceId: id,
            routeStopId: s.routeStopId,
            arrivalTime: s.arrivalTime,
            departureTime: s.departureTime,
            boardingAllowed: s.boardingAllowed,
            droppingAllowed: s.droppingAllowed,
          })),
        });
      }

      const updated = await tx.busService.update({
        where: { id },
        data: {
          ...(data.name ? { name: data.name } : {}),
          ...(data.status ? { status: data.status } : {}),
        },
        include: this.serviceInclude,
      });

      return updated;
    });
  }

  async findMany(params: ListServicesQueryDTO) {
    const page = params.page || SERVICE_CONSTANTS.PAGINATION.DEFAULT_PAGE;
    const limit = params.limit || SERVICE_CONSTANTS.PAGINATION.DEFAULT_LIMIT;
    const sortBy = params.sortBy || SERVICE_CONSTANTS.SORT.DEFAULT_SORT_BY;
    const sortOrder = params.sortOrder || SERVICE_CONSTANTS.SORT.DEFAULT_SORT_ORDER;
    const { search, status, busId, routeId } = params;

    const skip = (page - 1) * limit;

    const where: Prisma.BusServiceWhereInput = {
      ...(status ? { status } : {}),
      ...(busId ? { busId } : {}),
      ...(routeId ? { routeId } : {}),
      ...(search
        ? {
            OR: [
              { serviceCode: { contains: search, mode: "insensitive" } },
              { name: { contains: search, mode: "insensitive" } },
              { bus: { busNumber: { contains: search, mode: "insensitive" } } },
              { route: { name: { contains: search, mode: "insensitive" } } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.busService.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: this.serviceInclude,
      }),
      prisma.busService.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }
}

export const serviceRepository = new ServiceRepository();
