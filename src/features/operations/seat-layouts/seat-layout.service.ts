import { seatLayoutRepository } from "./seat-layout.repository";
import { busRepository } from "@/features/operations/buses/bus.repository";
import { SaveSeatLayoutDTO, UpdateSeatDTO, BusSeatItem } from "./seat-layout.types";
import { ApiError } from "@/utils/api-error";

export class SeatLayoutService {
  private formatSeat(seat: any): BusSeatItem {
    return {
      id: seat.id,
      busId: seat.busId,
      seatNumber: seat.seatNumber,
      seatType: seat.seatType,
      row: seat.row,
      column: seat.column,
      position: seat.position,
      deck: seat.deck,
      isWindow: seat.isWindow,
      isFemaleReserved: seat.isFemaleReserved,
      isActive: seat.isActive,
    };
  }

  async getSeatsByBusId(busId: string): Promise<BusSeatItem[]> {
    const bus = await busRepository.findById(busId);
    if (!bus) {
      throw ApiError.notFound(`Bus with ID '${busId}' not found.`);
    }

    const seats = await seatLayoutRepository.findByBusId(busId);
    return seats.map((s) => this.formatSeat(s));
  }

  async saveBusLayout(busId: string, dto: SaveSeatLayoutDTO): Promise<BusSeatItem[]> {
    const bus = await busRepository.findById(busId);
    if (!bus) {
      throw ApiError.notFound(`Bus with ID '${busId}' not found.`);
    }

    const seats = await seatLayoutRepository.saveLayout(busId, dto);
    return seats.map((s) => this.formatSeat(s));
  }

  async updateSingleSeat(seatId: string, dto: UpdateSeatDTO): Promise<BusSeatItem> {
    const seat = await seatLayoutRepository.findById(seatId);
    if (!seat) {
      throw ApiError.notFound(`Bus seat with ID '${seatId}' not found.`);
    }

    const updated = await seatLayoutRepository.updateSeat(seatId, dto);
    return this.formatSeat(updated);
  }
}

export const seatLayoutService = new SeatLayoutService();
