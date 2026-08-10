import { prisma } from "@/lib/db/prisma";
import { Stop, Prisma, StopStatus } from "@/generated/prisma/client";
import { CreateStopInput, UpdateStopInput, ListStopsQuery } from "./stop.types";

export class StopRepository {
  async create(data: CreateStopInput): Promise<Stop> {
    return prisma.stop.create({
      data: {
        name: data.name,
        city: data.city,
        state: data.state,
        country: data.country ?? "India",
        address: data.address ?? null,
        landmark: data.landmark ?? null,
        googlePlaceId: data.googlePlaceId ?? null,
        latitude: data.latitude !== undefined && data.latitude !== null ? new Prisma.Decimal(data.latitude) : null,
        longitude: data.longitude !== undefined && data.longitude !== null ? new Prisma.Decimal(data.longitude) : null,
        status: StopStatus.ACTIVE,
      },
    });
  }

  async findById(id: string): Promise<Stop | null> {
    return prisma.stop.findUnique({
      where: { id },
    });
  }

  async findByIdentity(name: string, city: string, state: string): Promise<Stop | null> {
    return prisma.stop.findFirst({
      where: {
        name: { equals: name, mode: "insensitive" },
        city: { equals: city, mode: "insensitive" },
        state: { equals: state, mode: "insensitive" },
      },
    });
  }

  async findByGooglePlaceId(googlePlaceId: string): Promise<Stop | null> {
    return prisma.stop.findUnique({
      where: { googlePlaceId },
    });
  }

  async findMany(query: ListStopsQuery): Promise<Stop[]> {
    const where = this.buildWhereClause(query);
    const { page = 1, limit = 20, sortBy = "name", sortOrder = "asc" } = query;

    const skip = (page - 1) * limit;

    return prisma.stop.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });
  }

  async count(query: ListStopsQuery): Promise<number> {
    const where = this.buildWhereClause(query);
    return prisma.stop.count({ where });
  }

  async update(id: string, data: UpdateStopInput): Promise<Stop> {
    const updateData: Prisma.StopUpdateInput = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.city !== undefined) updateData.city = data.city;
    if (data.state !== undefined) updateData.state = data.state;
    if (data.country !== undefined) updateData.country = data.country;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.landmark !== undefined) updateData.landmark = data.landmark;
    if (data.googlePlaceId !== undefined) updateData.googlePlaceId = data.googlePlaceId;
    if (data.status !== undefined) updateData.status = data.status;

    if (data.latitude !== undefined) {
      updateData.latitude = data.latitude !== null ? new Prisma.Decimal(data.latitude) : null;
    }

    if (data.longitude !== undefined) {
      updateData.longitude = data.longitude !== null ? new Prisma.Decimal(data.longitude) : null;
    }

    return prisma.stop.update({
      where: { id },
      data: updateData,
    });
  }

  async countActiveRoutesForStop(stopId: string): Promise<number> {
    return prisma.route.count({
      where: {
        status: "ACTIVE",
        stops: {
          some: {
            stopId,
          },
        },
      },
    });
  }

  private buildWhereClause(query: ListStopsQuery): Prisma.StopWhereInput {
    const where: Prisma.StopWhereInput = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.city) {
      where.city = { equals: query.city, mode: "insensitive" };
    }

    if (query.state) {
      where.state = { equals: query.state, mode: "insensitive" };
    }

    if (query.search) {
      const searchTerm = query.search.trim();
      where.OR = [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { city: { contains: searchTerm, mode: "insensitive" } },
        { state: { contains: searchTerm, mode: "insensitive" } },
        { address: { contains: searchTerm, mode: "insensitive" } },
        { landmark: { contains: searchTerm, mode: "insensitive" } },
      ];
    }

    return where;
  }
}

export const stopRepository = new StopRepository();
