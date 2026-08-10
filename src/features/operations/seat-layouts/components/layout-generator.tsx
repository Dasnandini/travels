"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { BusSeatItem } from "../seat-layout.types";
import { SeatType, SeatPosition, Deck } from "@/generated/prisma/enums";
import { Wand2, RefreshCw } from "lucide-react";

interface LayoutGeneratorProps {
  busType: string;
  onGenerate: (newSeats: BusSeatItem[]) => void;
}

export function LayoutGenerator({ busType, onGenerate }: LayoutGeneratorProps) {
  const [layoutPattern, setLayoutPattern] = useState<"2x2" | "2x1">("2x2");
  const [rows, setRows] = useState<number>(9);
  const [hasUpperDeck, setHasUpperDeck] = useState<boolean>(busType === "SLEEPER");
  const [seatType, setSeatType] = useState<SeatType>(
    busType === "SLEEPER" ? SeatType.SLEEPER : SeatType.SEAT
  );

  const handleGenerateClick = () => {
    const generated: BusSeatItem[] = [];

    const generateDeckSeats = (deck: Deck, prefix: string) => {
      let seatCounter = 1;

      for (let r = 1; r <= rows; r++) {
        if (layoutPattern === "2x2") {
          const cols: Array<{ col: number; pos: SeatPosition; isWin: boolean }> = [
            { col: 1, pos: SeatPosition.WINDOW, isWin: true },
            { col: 2, pos: SeatPosition.AISLE, isWin: false },
            { col: 4, pos: SeatPosition.AISLE, isWin: false },
            { col: 5, pos: SeatPosition.WINDOW, isWin: true },
          ];

          cols.forEach((c) => {
            const seatNum = `${prefix}${seatCounter}`;
            generated.push({
              id: seatNum,
              busId: "",
              seatNumber: seatNum,
              seatType,
              row: r,
              column: c.col,
              position: c.pos,
              deck,
              isWindow: c.isWin,
              isFemaleReserved: false,
              isActive: true,
            });
            seatCounter++;
          });
        } else {
          const cols: Array<{ col: number; pos: SeatPosition; isWin: boolean }> = [
            { col: 1, pos: SeatPosition.WINDOW, isWin: true },
            { col: 2, pos: SeatPosition.AISLE, isWin: false },
            { col: 4, pos: SeatPosition.WINDOW, isWin: true },
          ];

          cols.forEach((c) => {
            const seatNum = `${prefix}${seatCounter}`;
            generated.push({
              id: seatNum,
              busId: "",
              seatNumber: seatNum,
              seatType,
              row: r,
              column: c.col,
              position: c.pos,
              deck,
              isWindow: c.isWin,
              isFemaleReserved: false,
              isActive: true,
            });
            seatCounter++;
          });
        }
      }
    };

    if (hasUpperDeck) {
      generateDeckSeats(Deck.LOWER, "L");
      generateDeckSeats(Deck.UPPER, "U");
    } else {
      generateDeckSeats(Deck.LOWER, "A");
    }

    onGenerate(generated);
  };

  return (
    <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-4">
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
          <Wand2 className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-slate-900">Auto Layout Generator</h3>
          <p className="text-[11px] text-slate-500">Preset grid calculation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="space-y-1">
          <label className="font-bold text-slate-700">Seating Pattern</label>
          <Select
            value={layoutPattern}
            onChange={(e) => setLayoutPattern(e.target.value as "2x2" | "2x1")}
            options={[
              { value: "2x2", label: "2 x 2 (4 seats per row)" },
              { value: "2x1", label: "2 x 1 (3 seats per row)" },
            ]}
            className="bg-white border-slate-200"
          />
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-700">Rows Count</label>
          <Input
            type="number"
            min={1}
            max={15}
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            className="bg-white border-slate-200 font-mono text-xs"
          />
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-700">Seat Category</label>
          <Select
            value={seatType}
            onChange={(e) => setSeatType(e.target.value as SeatType)}
            options={[
              { value: "SEAT", label: "Normal Chair / Seat" },
              { value: "SLEEPER", label: "Sleeper Berth" },
            ]}
            className="bg-white border-slate-200"
          />
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-700">Upper Deck</label>
          <Select
            value={hasUpperDeck ? "YES" : "NO"}
            onChange={(e) => setHasUpperDeck(e.target.value === "YES")}
            options={[
              { value: "NO", label: "Single Deck (Lower Only)" },
              { value: "YES", label: "Two Decks (Lower + Upper)" },
            ]}
            className="bg-white border-slate-200"
          />
        </div>
      </div>

      <Button
        type="button"
        onClick={handleGenerateClick}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-2 rounded-xl text-xs"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        <span>Generate Grid Pattern</span>
      </Button>
    </div>
  );
}
