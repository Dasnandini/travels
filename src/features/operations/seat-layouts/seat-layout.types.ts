import { SeatType, SeatPosition, Deck } from "@/generated/prisma/enums";

export interface BusSeatItem {
  id: string;
  busId: string;
  seatNumber: string;
  seatType: SeatType;
  row: number;
  column: number;
  position: SeatPosition;
  deck: Deck;
  isWindow: boolean;
  isFemaleReserved: boolean;
  isActive: boolean;
}

export interface CreateSeatInputDTO {
  seatNumber: string;
  seatType: SeatType;
  row: number;
  column: number;
  position: SeatPosition;
  deck: Deck;
  isWindow?: boolean;
  isFemaleReserved?: boolean;
  isActive?: boolean;
}

export interface SaveSeatLayoutDTO {
  seats: CreateSeatInputDTO[];
}

export interface UpdateSeatDTO {
  seatNumber?: string;
  seatType?: SeatType;
  position?: SeatPosition;
  isFemaleReserved?: boolean;
  isActive?: boolean;
}
