"use client";

import React from "react";
import { BusSeatItem } from "../seat-layout.types";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SeatType, SeatPosition } from "@/generated/prisma/enums";
import { Sliders, UserCheck, Power } from "lucide-react";

interface SeatConfigPanelProps {
  seat: BusSeatItem | null;
  onUpdateSeat: (updatedSeat: BusSeatItem) => void;
}

export function SeatConfigPanel({ seat, onUpdateSeat }: SeatConfigPanelProps) {
  if (!seat) {
    return (
      <div className="p-5 rounded-2xl border border-slate-200/80 bg-white space-y-2 text-center shadow-sm">
        <Sliders className="h-6 w-6 text-slate-300 mx-auto" />
        <h4 className="text-xs font-bold text-slate-700">No seat selected</h4>
        <p className="text-[11px] text-slate-400">
          Click any seat in the visual grid layout to inspect or modify individual seat properties.
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-2xl border border-slate-200/80 bg-white space-y-4 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-[#002B66] text-white font-mono text-xs font-bold">
            {seat.seatNumber}
          </span>
          <span className="text-xs font-bold text-slate-900">Seat Properties</span>
        </div>
        <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
          {seat.deck} DECK
        </span>
      </div>

      <div className="space-y-3 text-xs">
        {/* Seat Number */}
        <div className="space-y-1">
          <label className="font-bold text-slate-700">Seat Number</label>
          <Input
            value={seat.seatNumber}
            onChange={(e) =>
              onUpdateSeat({
                ...seat,
                seatNumber: e.target.value.toUpperCase().trim(),
              })
            }
            className="bg-slate-50 border-slate-200 font-mono text-xs"
          />
        </div>

        {/* Seat Type */}
        <div className="space-y-1">
          <label className="font-bold text-slate-700">Seat Type</label>
          <Select
            value={seat.seatType}
            onChange={(e) =>
              onUpdateSeat({
                ...seat,
                seatType: e.target.value as SeatType,
              })
            }
            options={[
              { value: "SEAT", label: "Normal Chair / Seat" },
              { value: "SLEEPER", label: "Sleeper Berth" },
            ]}
            className="bg-slate-50 border-slate-200"
          />
        </div>

        {/* Position */}
        <div className="space-y-1">
          <label className="font-bold text-slate-700">Position</label>
          <Select
            value={seat.position}
            onChange={(e) => {
              const pos = e.target.value as SeatPosition;
              onUpdateSeat({
                ...seat,
                position: pos,
                isWindow: pos === "WINDOW",
              });
            }}
            options={[
              { value: "WINDOW", label: "Window Position" },
              { value: "AISLE", label: "Aisle Position" },
              { value: "LEFT", label: "Left Side" },
              { value: "RIGHT", label: "Right Side" },
              { value: "CENTER", label: "Center Back" },
            ]}
            className="bg-slate-50 border-slate-200"
          />
        </div>

        {/* Female Reserved Toggle */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-pink-50/70 border border-pink-200">
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-pink-600" />
            <div>
              <span className="font-bold text-pink-950 block">Female Reserved</span>
              <span className="text-[10px] text-pink-700">Reserved for female passengers</span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={seat.isFemaleReserved}
            onChange={(e) =>
              onUpdateSeat({
                ...seat,
                isFemaleReserved: e.target.checked,
              })
            }
            className="h-4 w-4 text-pink-600 rounded border-slate-300 focus:ring-pink-500 cursor-pointer"
          />
        </div>

        {/* Active Toggle */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2">
            <Power className="h-4 w-4 text-slate-600" />
            <div>
              <span className="font-bold text-slate-900 block">Active Status</span>
              <span className="text-[10px] text-slate-500">Enable or disable this seat</span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={seat.isActive}
            onChange={(e) =>
              onUpdateSeat({
                ...seat,
                isActive: e.target.checked,
              })
            }
            className="h-4 w-4 text-[#002B66] rounded border-slate-300 focus:ring-blue-900 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
