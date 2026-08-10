"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2, X, Check, Map as MapIcon, Edit3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { stopsApi } from "../services/stops-api";
import { PlaceSearchItem } from "../types/stop.types";
import { StopMapPicker } from "./stop-map-picker";

interface StopLocationSearchProps {
  onSelectPlace: (place: PlaceSearchItem) => void;
  selectedPlaceName?: string;
  onClear?: () => void;
  initialLat?: number | null;
  initialLng?: number | null;
}

export function StopLocationSearch({
  onSelectPlace,
  selectedPlaceName,
  onClear,
  initialLat,
  initialLng,
}: StopLocationSearchProps) {
  const [mode, setMode] = useState<"search" | "map">("search");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlaceSearchItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);

  // Instant Debounced Google Places Search (starts at 2 chars)
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const data = await stopsApi.searchPlaces(query);
        setResults(data);
        setIsOpen(true);
        setActiveIndex(-1);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close results dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < results.length) {
        handleSelect(results[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleSelect = (place: PlaceSearchItem) => {
    onSelectPlace(place);
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  const handleMapPinSelect = (data: {
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
    state?: string;
  }) => {
    onSelectPlace({
      placeId: "",
      name: data.city ? `${data.city} Bus Stop` : "Map Pinned Location",
      address: data.address || "",
      latitude: data.latitude,
      longitude: data.longitude,
    });
  };

  return (
    <div className="space-y-3" ref={containerRef}>
      {/* Mode Selector Tabs */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700">
          Pick Bus Stop Location
        </label>

        <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-100 border border-slate-200">
          <button
            type="button"
            onClick={() => setMode("search")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              mode === "search"
                ? "bg-[#002B66] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Search className="h-3.5 w-3.5" />
            <span>Google Search</span>
          </button>

          <button
            type="button"
            onClick={() => setMode("map")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              mode === "map"
                ? "bg-[#002B66] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <MapIcon className="h-3.5 w-3.5" />
            <span>Pick on Map</span>
          </button>
        </div>
      </div>

      {selectedPlaceName ? (
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-950">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-7 w-7 rounded-lg bg-blue-100 flex items-center justify-center text-[#002B66] shrink-0 font-bold">
              <Check className="h-4 w-4" />
            </div>
            <div className="truncate">
              <span className="font-bold text-slate-900 block truncate">{selectedPlaceName}</span>
              <span className="text-[11px] text-blue-700">Location & coordinates populated</span>
            </div>
          </div>
          {onClear && (
            <button
              type="button"
              onClick={onClear}
              className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-700 hover:text-blue-950 transition-colors"
              title="Clear selection"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : mode === "search" ? (
        <div className="relative">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query.trim().length >= 2 && results.length > 0 && setIsOpen(true)}
            placeholder="Search Google Places (e.g. Baramunda Bus Stand, Bhubaneswar)..."
            className="pr-10 bg-slate-50 border-slate-200 text-xs"
            aria-autocomplete="list"
            aria-expanded={isOpen}
          />
          <div className="absolute right-3 top-2.5 text-slate-400">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-[#002B66]" /> : <Search className="h-4 w-4" />}
          </div>

          {/* Places Results Dropdown */}
          {isOpen && (
            <div className="absolute z-50 mt-1.5 w-full rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xl max-h-60 overflow-y-auto space-y-0.5 animate-in fade-in-0 zoom-in-95 duration-150">
              {results.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-400 font-medium">
                  No location suggestions found for "{query}".
                </div>
              ) : (
                results.map((place, index) => (
                  <div
                    key={place.placeId || index}
                    onClick={() => handleSelect(place)}
                    className={`flex items-start gap-2.5 px-3 py-2 rounded-xl cursor-pointer transition-colors text-xs ${
                      index === activeIndex
                        ? "bg-[#002B66] text-white font-bold"
                        : "text-slate-800 hover:bg-slate-100 hover:text-slate-900 font-medium"
                    }`}
                  >
                    <MapPin className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                    <div className="overflow-hidden">
                      <p className="font-bold truncate">{place.name}</p>
                      <p className="text-[11px] opacity-80 truncate">{place.address}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      ) : (
        /* Interactive Map Mode */
        <StopMapPicker
          initialLat={initialLat}
          initialLng={initialLng}
          onSelectCoordinates={handleMapPinSelect}
        />
      )}
    </div>
  );
}
