"use client";

import React from "react";
import { BusSeatItem } from "../seat-layout.types";
import { SeatItem } from "./seat-item";
import { Deck } from "@/generated/prisma/enums";
import { CircleDot } from "lucide-react";

interface SeatGridProps {
  seats: BusSeatItem[];
  activeDeck: Deck;
  selectedSeatId?: string | null;
  onSelectSeat: (seat: BusSeatItem) => void;
}

export function SeatGrid({ seats, activeDeck, selectedSeatId, onSelectSeat }: SeatGridProps) {
  const deckSeats = seats.filter((s) => s.deck === activeDeck);

  if (deckSeats.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 bg-white">
        <p className="text-xs font-semibold text-slate-500">
          No seats generated on {activeDeck === Deck.LOWER ? "Lower Deck" : "Upper Deck"}.
        </p>
        <p className="text-[11px] text-slate-400 mt-1">
          Use the Layout Generator configuration panel on the right to build the bus layout.
        </p>
      </div>
    );
  }

  // Find total rows and max column in grid
  const maxRow = Math.max(...deckSeats.map((s) => s.row), 1);
  const maxCol = Math.max(...deckSeats.map((s) => s.column), 4);

  // Group seats by row
  const rowsArray = Array.from({ length: maxRow }, (_, rIndex) => rIndex + 1);

  return (
    <div className="p-6 rounded-2xl border border-slate-200/80 bg-white shadow-sm space-y-6 max-w-xl mx-auto">
      {/* Driver Cabin Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
            <CircleDot className="h-4 w-4 text-[#002B66]" />
          </div>
          <span>DRIVER CABIN</span>
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-slate-100 text-slate-500 uppercase">
          {activeDeck} DECK
        </span>
      </div>

      {/* Grid Rows */}
      <div className="space-y-3">
        {rowsArray.map((rowNum) => {
          const rowSeats = deckSeats.filter((s) => s.row === rowNum);

          return (
            <div key={rowNum} className="flex items-center justify-center gap-3">
              {/* Row number label */}
              <span className="text-[10px] font-mono text-slate-400 font-bold w-4 text-center">
                {rowNum}
              </span>

              {/* Seats in row */}
              <div className="flex items-center gap-2">
                {Array.from({ length: maxCol }, (_, cIndex) => cIndex + 1).map((colNum) => {
                  const seat = rowSeats.find((s) => s.column === colNum);

                  if (!seat) {
                    // Render aisle gap or empty spot
                    return <div key={colNum} className="h-12 w-12 border border-transparent" />;
                  }

                  return (
                    <SeatItem
                      key={seat.seatNumber}
                      seat={seat}
                      isSelected={selectedSeatId === seat.id || selectedSeatId === seat.seatNumber}
                      onSelect={() => onSelectSeat(seat)}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Emergency Exit Footer */}
      <div className="pt-4 border-t border-slate-200/80 text-center">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          REAR / EMERGENCY EXIT
        </span>
      </div>
    </div>
  );
}
