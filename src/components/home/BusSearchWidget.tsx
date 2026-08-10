"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeftRight,
  Calendar,
  User,
  Search,
  MapPin,
  Clock,
  Bus as BusIcon,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { BusSearchResultItem, BusSearchResponseData } from "@/features/bus-search/bus-search.types";

interface StopOption {
  id: string;
  name: string;
  city: string;
  state: string;
}

export function BusSearchWidget() {
  const [stops, setStops] = useState<StopOption[]>([]);
  const [loadingStops, setLoadingStops] = useState(true);

  // Form State
  const [fromStopId, setFromStopId] = useState<string>("");
  const [toStopId, setToStopId] = useState<string>("");
  const [date, setDate] = useState<string>("2026-08-15");
  const [returnDate, setReturnDate] = useState<string>("");
  const [passengers, setPassengers] = useState<number>(1);

  // Search Results & Loading State
  const [isSearching, setIsSearching] = useState(false);
  const [searchData, setSearchData] = useState<BusSearchResponseData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch active stops on mount
  useEffect(() => {
    async function fetchStops() {
      try {
        const res = await fetch("/api/stops");
        const json = await res.json();
        if (json.success && json.data?.items) {
          setStops(json.data.items);
          // Set default selections if available
          if (json.data.items.length >= 2) {
            setFromStopId(json.data.items[0].id);
            setToStopId(json.data.items[json.data.items.length - 1].id);
          }
        }
      } catch (err) {
        console.error("Failed to load stops:", err);
      } finally {
        setLoadingStops(false);
      }
    }
    fetchStops();
  }, []);

  // Swap From & To
  const handleSwapStops = () => {
    setFromStopId(toStopId);
    setToStopId(fromStopId);
  };

  // Perform search call
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    if (!fromStopId || !toStopId) {
      setErrorMessage("Please select both origin and destination stops.");
      return;
    }

    if (fromStopId === toStopId) {
      setErrorMessage("Origin and destination must be different.");
      return;
    }

    if (!date) {
      setErrorMessage("Please select a date of journey.");
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
      const query = new URLSearchParams({
        from: fromStopId,
        to: toStopId,
        date: date,
        passengers: passengers.toString(),
      });

      const res = await fetch(`/api/buses/search?${query.toString()}`);
      const json = await res.json();

      if (json.success) {
        setSearchData(json.data);
      } else {
        setErrorMessage(json.error?.message || "Search failed. Please try again.");
        setSearchData(null);
      }
    } catch (err) {
      console.error("Search error:", err);
      setErrorMessage("An unexpected error occurred while searching buses.");
      setSearchData(null);
    } finally {
      setIsSearching(false);
    }
  };

  const fromStopObj = stops.find((s) => s.id === fromStopId);
  const toStopObj = stops.find((s) => s.id === toStopId);

  const getFormattedDateSubtext = (dateStr: string) => {
    if (!dateStr) return "Departure date";
    const d = new Date(dateStr + "T00:00:00");
    if (isNaN(d.getTime())) return "Departure date";
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  return (
    <div className="w-full">
      {/* Floating White Card Form */}
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-slate-100/90 relative z-20">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-stretch">
          
          {/* FROM STOP */}
          <div className="lg:col-span-3 bg-slate-50 hover:bg-slate-100/80 transition-colors p-3 rounded-xl border border-slate-200/80 relative flex flex-col justify-between h-full">
            {/* SWAP BUTTON */}
            <button
              type="button"
              onClick={handleSwapStops}
              className="absolute -bottom-[18px] left-1/2 -translate-x-1/2 lg:bottom-auto lg:left-auto lg:top-1/2 lg:-right-[18px] lg:-translate-y-1/2 lg:translate-x-0 bg-white hover:bg-red-50 text-slate-600 hover:text-[#D32F2F] border border-slate-200 w-9 h-9 rounded-full shadow-md hover:scale-110 transition-all cursor-pointer z-10 flex items-center justify-center"
              title="Swap From and To"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>

            <div>
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                From
              </label>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#D32F2F] shrink-0" />
                <select
                  value={fromStopId}
                  onChange={(e) => setFromStopId(e.target.value)}
                  disabled={loadingStops}
                  className="w-full bg-transparent text-slate-900 font-bold text-sm focus:outline-none cursor-pointer truncate"
                >
                  {loadingStops ? (
                    <option>Loading stops...</option>
                  ) : (
                    stops.map((stop) => (
                      <option key={stop.id} value={stop.id}>
                        {stop.name} ({stop.city})
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
            <div className="text-xs text-slate-500 font-medium truncate mt-1 pl-7">
              {fromStopObj ? `${fromStopObj.city}, ${fromStopObj.state}` : "Leaving from"}
            </div>
          </div>

          {/* TO STOP */}
          <div className="lg:col-span-3 bg-slate-50 hover:bg-slate-100/80 transition-colors p-3 rounded-xl border border-slate-200/80 relative flex flex-col justify-between h-full">
            <div>
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                To
              </label>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#D32F2F] shrink-0" />
                <select
                  value={toStopId}
                  onChange={(e) => setToStopId(e.target.value)}
                  disabled={loadingStops}
                  className="w-full bg-transparent text-slate-900 font-bold text-sm focus:outline-none cursor-pointer truncate"
                >
                  {loadingStops ? (
                    <option>Loading stops...</option>
                  ) : (
                    stops.map((stop) => (
                      <option key={stop.id} value={stop.id}>
                        {stop.name} ({stop.city})
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
            <div className="text-xs text-slate-500 font-medium truncate mt-1 pl-7">
              {toStopObj ? `${toStopObj.city}, ${toStopObj.state}` : "Going to"}
            </div>
          </div>

          {/* DATE OF JOURNEY */}
          <div className="lg:col-span-2 bg-slate-50 hover:bg-slate-100/80 transition-colors p-3 rounded-xl border border-slate-200/80 flex flex-col justify-between h-full">
            <div>
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Date of Journey
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#D32F2F] shrink-0" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min="2026-08-10"
                  className="w-full bg-transparent text-slate-900 font-bold text-sm focus:outline-none cursor-pointer"
                />
              </div>
            </div>
            <div className="text-xs text-slate-500 font-medium truncate mt-1 pl-7">
              {getFormattedDateSubtext(date)}
            </div>
          </div>

          {/* PASSENGERS */}
          <div className="lg:col-span-2 bg-slate-50 hover:bg-slate-100/80 transition-colors p-3 rounded-xl border border-slate-200/80 flex flex-col justify-between h-full">
            <div>
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Passengers
              </label>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-[#D32F2F] shrink-0" />
                <select
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                  className="w-full bg-transparent text-slate-900 font-bold text-sm focus:outline-none cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "Passenger" : "Passengers"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="text-xs text-slate-500 font-medium truncate mt-1 pl-7">
              {passengers} {passengers === 1 ? "seat selected" : "seats selected"}
            </div>
          </div>

          {/* SEARCH BUTTON */}
          <div className="sm:col-span-2 lg:col-span-2 flex items-center justify-center h-full">
            <button
              type="submit"
              disabled={isSearching}
              className="w-full h-[50px] bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-75 cursor-pointer"
            >
              {isSearching ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span className="font-bold text-base">Search</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>

      {/* ERROR ALERT */}
      {errorMessage && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 text-sm font-medium animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* LIVE SEARCH RESULTS DISPLAY */}
      {hasSearched && searchData && (
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BusIcon className="w-5 h-5 text-[#D32F2F]" />
              <span>Available Buses ({searchData.pagination.total})</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Showing departures for {date}
            </span>
          </div>

          {searchData.items.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center space-y-2">
              <BusIcon className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="text-base font-bold text-slate-700">No buses found</h4>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                No active bus services operating between the selected stops on this date. Please try another date or destination.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {searchData.items.map((item: BusSearchResultItem) => (
                <div
                  key={item.serviceId}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  {/* Left Bus Info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-lg">{item.serviceName}</span>
                      <span className="bg-red-50 text-[#D32F2F] text-xs font-mono font-bold px-2.5 py-0.5 rounded-md border border-red-100">
                        {item.serviceCode}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                      <span>Bus: <strong className="text-slate-700">{item.bus.busNumber}</strong></span>
                      <span>•</span>
                      <span className="uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">
                        {item.bus.type}
                      </span>
                    </div>
                  </div>

                  {/* Center Timings & Journey Details */}
                  <div className="flex items-center gap-6 text-center bg-slate-50 px-6 py-3 rounded-xl border border-slate-100">
                    <div>
                      <div className="text-lg font-extrabold text-slate-900">{item.from.departureTime}</div>
                      <div className="text-xs font-semibold text-slate-600 truncate max-w-[120px]">
                        {item.from.name}
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <span className="text-[11px] font-bold text-slate-500 mb-1">
                        {Math.floor(item.durationMinutes / 60)}h {item.durationMinutes % 60}m
                      </span>
                      <div className="w-20 h-0.5 bg-slate-300 relative flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#D32F2F] absolute" />
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1">Direct</span>
                    </div>

                    <div>
                      <div className="text-lg font-extrabold text-slate-900">{item.to.arrivalTime}</div>
                      <div className="text-xs font-semibold text-slate-600 truncate max-w-[120px]">
                        {item.to.name}
                      </div>
                    </div>
                  </div>

                  {/* Right Status & Action */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/80">
                      Booking opens soon
                    </div>
                    <button
                      disabled
                      className="bg-slate-100 text-slate-400 font-bold text-sm px-5 py-2.5 rounded-xl cursor-not-allowed border border-slate-200"
                    >
                      Select Seats
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
