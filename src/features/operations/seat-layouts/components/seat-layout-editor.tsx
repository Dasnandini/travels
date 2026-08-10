"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeckSwitcher } from "./deck-switcher";
import { SeatGrid } from "./seat-grid";
import { LayoutGenerator } from "./layout-generator";
import { SeatConfigPanel } from "./seat-config-panel";
import { useBusSeats } from "../hooks/use-bus-seats";
import { useSaveSeatLayout } from "../hooks/use-save-seat-layout";
import { BusSeatItem } from "../seat-layout.types";
import { BusItem } from "@/features/operations/buses/bus.types";
import { Deck } from "@/generated/prisma/enums";
import { Skeleton } from "@/components/ui/skeleton";

interface SeatLayoutEditorProps {
  bus: BusItem;
}

export function SeatLayoutEditor({ bus }: SeatLayoutEditorProps) {
  const { data: initialSeats, isLoading } = useBusSeats(bus.id);
  const saveLayoutMutation = useSaveSeatLayout();

  const [activeDeck, setActiveDeck] = useState<Deck>(Deck.LOWER);
  const [seats, setSeats] = useState<BusSeatItem[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<BusSeatItem | null>(null);

  useEffect(() => {
    if (initialSeats) {
      setSeats(initialSeats);
    }
  }, [initialSeats]);

  const handleSaveLayout = () => {
    saveLayoutMutation.mutate({
      busId: bus.id,
      dto: {
        seats: seats.map((s) => ({
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
      },
    });
  };

  const handleUpdateSingleSeat = (updated: BusSeatItem) => {
    setSeats((prev) =>
      prev.map((s) => (s.id === updated.id || s.seatNumber === updated.seatNumber ? updated : s))
    );
    setSelectedSeat(updated);
  };

  // Stats calculation
  const totalSeats = seats.length;
  const activeSeatsCount = seats.filter((s) => s.isActive).length;
  const femaleReservedCount = seats.filter((s) => s.isFemaleReserved).length;
  const windowSeatsCount = seats.filter((s) => s.isWindow).length;

  const hasUpperDeck = seats.some((s) => s.deck === Deck.UPPER) || bus.type === "SLEEPER";

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <Link
            href={`/admin/dashboard/operations/buses/${bus.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-3"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Bus Overview</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Seat Layout Designer — {bus.busNumber}
            </h1>
            <span className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-[#002B66] font-mono text-xs font-bold">
              {bus.registrationNumber}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure the physical seating arrangement, deck layout, and female reserved seat tags.
          </p>
        </div>

        <Button
          onClick={handleSaveLayout}
          isLoading={saveLayoutMutation.isPending}
          className="bg-[#002B66] hover:bg-[#001f4d] text-white font-semibold gap-2 rounded-xl shadow-md shadow-blue-950/20"
        >
          <Save className="h-4 w-4" />
          <span>Save Seat Layout</span>
        </Button>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Total Seats
          </span>
          <span className="text-xl font-bold font-mono text-[#002B66]">{totalSeats}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Active Seats
          </span>
          <span className="text-xl font-bold font-mono text-emerald-600">
            {activeSeatsCount}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-pink-600 uppercase tracking-wider block">
            Female Reserved
          </span>
          <span className="text-xl font-bold font-mono text-pink-700">
            {femaleReservedCount}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Window Seats
          </span>
          <span className="text-xl font-bold font-mono text-slate-900">
            {windowSeatsCount}
          </span>
        </div>
      </div>

      {/* Main Grid & Editor Controls */}
      {isLoading ? (
        <div className="p-12 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Visual 2D Seat Grid (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <DeckSwitcher
                activeDeck={activeDeck}
                onChangeDeck={setActiveDeck}
                hasUpperDeck={hasUpperDeck}
              />
              <span className="text-xs text-slate-500 font-semibold">
                Click any seat to edit properties
              </span>
            </div>

            <SeatGrid
              seats={seats}
              activeDeck={activeDeck}
              selectedSeatId={selectedSeat?.id || selectedSeat?.seatNumber}
              onSelectSeat={setSelectedSeat}
            />
          </div>

          {/* Configuration & Inspector Panels (Span 1) */}
          <div className="space-y-6">
            {/* Inspector Panel */}
            <SeatConfigPanel seat={selectedSeat} onUpdateSeat={handleUpdateSingleSeat} />

            {/* Auto Generator Panel */}
            <LayoutGenerator busType={bus.type} onGenerate={setSeats} />
          </div>
        </div>
      )}
    </div>
  );
}
