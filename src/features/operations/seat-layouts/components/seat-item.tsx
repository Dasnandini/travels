"use client";

import React from "react";
import { BusSeatItem } from "../seat-layout.types";
import { Power } from "lucide-react";

interface SeatItemProps {
  seat: BusSeatItem;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function SeatItem({ seat, isSelected, onSelect }: SeatItemProps) {
  const isSleeper = seat.seatType === "SLEEPER";

  const ariaLabel = `${isSleeper ? "Sleeper berth" : "Seat"} ${seat.seatNumber}, ${
    seat.isWindow ? "window position" : "aisle position"
  }, ${seat.deck === "LOWER" ? "lower deck" : "upper deck"}${
    seat.isFemaleReserved ? ", female reserved" : ""
  }${!seat.isActive ? ", inactive" : ""}`;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={ariaLabel}
      className={`relative group rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer select-none ${
        isSleeper ? "h-20 w-12 p-1.5" : "h-12 w-12 p-1"
      } ${
        !seat.isActive
          ? "bg-slate-100 border-2 border-dashed border-slate-300 text-slate-400 opacity-60"
          : isSelected
          ? "bg-[#002B66] border-2 border-blue-950 text-white shadow-lg ring-4 ring-blue-100 font-bold scale-105"
          : seat.isFemaleReserved
          ? "bg-pink-50 border-2 border-pink-300 text-pink-700 hover:bg-pink-100"
          : "bg-white border-2 border-slate-200 text-slate-800 hover:border-blue-700 hover:shadow-md"
      }`}
    >
      {/* Sleeper Headrest visual indicator */}
      {isSleeper && (
        <div
          className={`w-full h-3 rounded-t-md mb-1 border-b ${
            isSelected
              ? "bg-blue-900 border-blue-800"
              : seat.isFemaleReserved
              ? "bg-pink-200 border-pink-300"
              : "bg-slate-100 border-slate-200"
          }`}
        />
      )}

      {/* Seat Number */}
      <span className="font-mono font-bold text-xs leading-none">{seat.seatNumber}</span>

      {/* Badges / Position Icons */}
      <div className="flex items-center gap-0.5 mt-1">
        {seat.isFemaleReserved && (
          <span
            title="Female Reserved"
            className={`text-[9px] font-bold px-1 rounded ${
              isSelected ? "bg-pink-500 text-white" : "bg-pink-200 text-pink-900"
            }`}
          >
            F
          </span>
        )}
        {seat.isWindow && (
          <span
            title="Window Position"
            className={`text-[9px] font-bold ${isSelected ? "text-blue-200" : "text-slate-400"}`}
          >
            W
          </span>
        )}
        {!seat.isActive && (
          <span title="Inactive seat">
            <Power className="h-3 w-3 text-red-500" />
          </span>
        )}
      </div>
    </button>
  );
}
