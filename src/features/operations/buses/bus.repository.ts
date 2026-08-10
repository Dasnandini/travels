import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { CreateBusDTO, UpdateBusDTO, ListBusesQueryDTO } from "./bus.types";
import { BUS_CONSTANTS } from "./bus.constants";

export class BusRepository {
  async findById(id: string) {
    return prisma.bus.findUnique({
      where: { id },
      include: {
        _count: {
          select: { seats: true, services: true },
        },
      },
    });
  }

  async findByBusNumber(busNumber: string) {
    return prisma.bus.findUnique({
      where: { busNumber: busNumber.toUpperCase() },
    });
  }

  async findByRegistrationNumber(registrationNumber: string) {
    return prisma.bus.findUnique({
      where: { registrationNumber: registrationNumber.toUpperCase() },
    });
  }

  async create(data: CreateBusDTO) {
    return prisma.bus.create({
      data: {
        busNumber: data.busNumber.toUpperCase(),
        registrationNumber: data.registrationNumber.toUpperCase(),
        name: data.name,
        type: data.type,
        description: data.description,
        status: data.status,
      },
      include: {
        _count: {
          select: { seats: true },
        },
      },
    });
  }

  async update(id: string, data: UpdateBusDTO) {
    return prisma.bus.update({
      where: { id },
      data,
      include: {
        _count: {
          select: { seats: true },
        },
      },
    });
  }

  async findMany(params: ListBusesQueryDTO) {
    const page = params.page || BUS_CONSTANTS.PAGINATION.DEFAULT_PAGE;
    const limit = params.limit || BUS_CONSTANTS.PAGINATION.DEFAULT_LIMIT;
    const sortBy = params.sortBy || BUS_CONSTANTS.SORT.DEFAULT_SORT_BY;
    const sortOrder = params.sortOrder || BUS_CONSTANTS.SORT.DEFAULT_SORT_ORDER;
    const { search, type, status } = params;

    const skip = (page - 1) * limit;

    const where: Prisma.BusWhereInput = {
      ...(status ? { status } : {}),
      ...(type ? { type } : {}),
      ...(search
        ? {
            OR: [
              { busNumber: { contains: search, mode: "insensitive" } },
              { registrationNumber: { contains: search, mode: "insensitive" } },
              { name: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.bus.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          _count: {
            select: { seats: true },
          },
        },
      }),
      prisma.bus.count({ where }),
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

export const busRepository = new BusRepository();
