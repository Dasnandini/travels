"use client";

import React from "react";
import { Deck } from "@/generated/prisma/enums";
import { Layers } from "lucide-react";

interface DeckSwitcherProps {
  activeDeck: Deck;
  onChangeDeck: (deck: Deck) => void;
  hasUpperDeck?: boolean;
}

export function DeckSwitcher({ activeDeck, onChangeDeck, hasUpperDeck = true }: DeckSwitcherProps) {
  return (
    <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200">
      <button
        type="button"
        onClick={() => onChangeDeck(Deck.LOWER)}
        className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
          activeDeck === Deck.LOWER
            ? "bg-[#002B66] text-white shadow-sm"
            : "text-slate-600 hover:text-slate-900"
        }`}
      >
        <Layers className="h-3.5 w-3.5" />
        <span>Lower Deck</span>
      </button>

      {hasUpperDeck && (
        <button
          type="button"
          onClick={() => onChangeDeck(Deck.UPPER)}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeDeck === Deck.UPPER
              ? "bg-[#002B66] text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Upper Deck</span>
        </button>
      )}
    </div>
  );
}
