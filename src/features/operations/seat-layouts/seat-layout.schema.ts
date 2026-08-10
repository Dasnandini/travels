import { z } from "zod";
import { SeatType, SeatPosition, Deck } from "@/generated/prisma/enums";

export const seatInputSchema = z.object({
  seatNumber: z.string().min(1, "Seat number is required."),
  seatType: z.nativeEnum(SeatType),
  row: z.number().int().min(1),
  column: z.number().int().min(1),
  position: z.nativeEnum(SeatPosition),
  deck: z.nativeEnum(Deck).default(Deck.LOWER),
  isWindow: z.boolean().default(false),
  isFemaleReserved: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export const saveSeatLayoutSchema = z.object({
  seats: z.array(seatInputSchema).min(1, "Layout must contain at least one seat."),
});

export const updateSeatSchema = z.object({
  seatNumber: z.string().min(1).optional(),
  seatType: z.nativeEnum(SeatType).optional(),
  position: z.nativeEnum(SeatPosition).optional(),
  isFemaleReserved: z.boolean().optional(),
  isActive: z.boolean().optional(),
});
