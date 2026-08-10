import { prisma } from "@/lib/prisma";
import { SaveSeatLayoutDTO, UpdateSeatDTO } from "./seat-layout.types";

export class SeatLayoutRepository {
  async findByBusId(busId: string) {
    return prisma.busSeat.findMany({
      where: { busId },
      orderBy: [{ deck: "asc" }, { row: "asc" }, { column: "asc" }],
    });
  }

  async findById(seatId: string) {
    return prisma.busSeat.findUnique({
      where: { id: seatId },
    });
  }

  async saveLayout(busId: string, dto: SaveSeatLayoutDTO) {
    return prisma.$transaction(async (tx) => {
      // Clear existing seat configuration for this bus
      await tx.busSeat.deleteMany({
        where: { busId },
      });

      // Insert new seat items
      await tx.busSeat.createMany({
        data: dto.seats.map((s) => ({
          busId,
          seatNumber: s.seatNumber,
          seatType: s.seatType,
          row: s.row,
          column: s.column,
          position: s.position,
          deck: s.deck,
          isWindow: s.isWindow,
          isFemaleReserved: s.isFemaleReserved,
          isActive: s.isActive,
        })),
      });

      return tx.busSeat.findMany({
        where: { busId },
        orderBy: [{ deck: "asc" }, { row: "asc" }, { column: "asc" }],
      });
    });
  }

  async updateSeat(seatId: string, dto: UpdateSeatDTO) {
    return prisma.busSeat.update({
      where: { id: seatId },
      data: dto,
    });
  }
}

export const seatLayoutRepository = new SeatLayoutRepository();
