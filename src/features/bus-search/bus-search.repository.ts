import { prisma } from "@/lib/db/prisma";
import { BusStatus, RouteStatus, ServiceStatus, Weekday } from "@/generated/prisma/enums";
import { Prisma } from "@/generated/prisma/client";

export const busServiceSearchInclude = {
  bus: {
    select: {
      id: true,
      busNumber: true,
      type: true,
    },
  },
  route: {
    select: {
      id: true,
      name: true,
    },
  },
  stops: {
    select: {
      arrivalTime: true,
      departureTime: true,
      boardingAllowed: true,
      droppingAllowed: true,
      routeStop: {
        select: {
          sequence: true,
          stopId: true,
          stop: {
            select: {
              id: true,
              name: true,
              city: true,
            },
          },
        },
      },
    },
  },
} as const;

export type RawBusServiceSearchResult = Prisma.BusServiceGetPayload<{
  include: typeof busServiceSearchInclude;
}>;

export class BusSearchRepository {
  /**
   * Fetches stop details for given stop IDs.
   */
  async findStopsByIds(fromStopId: string, toStopId: string) {
    const ids = Array.from(new Set([fromStopId, toStopId]));
    return prisma.stop.findMany({
      where: {
        id: { in: ids },
      },
      select: {
        id: true,
        name: true,
        city: true,
        status: true,
      },
    });
  }

  /**
   * Finds active bus services operating on the given weekday that pass through
   * origin and destination stops with appropriate boarding and dropping flags.
   */
  async findMatchingServices(
    fromStopId: string,
    toStopId: string,
    weekday: Weekday
  ): Promise<RawBusServiceSearchResult[]> {
    return prisma.busService.findMany({
      where: {
        status: ServiceStatus.ACTIVE,
        bus: {
          status: BusStatus.ACTIVE,
        },
        route: {
          status: RouteStatus.ACTIVE,
        },
        operatingDays: {
          some: {
            day: weekday,
          },
        },
        stops: {
          some: {
            boardingAllowed: true,
            routeStop: {
              stopId: fromStopId,
            },
          },
        },
        AND: [
          {
            stops: {
              some: {
                droppingAllowed: true,
                routeStop: {
                  stopId: toStopId,
                },
              },
            },
          },
        ],
      },
      include: busServiceSearchInclude,
    });
  }
}

export const busSearchRepository = new BusSearchRepository();
