"use client";

import React, { useState } from "react";
import { MapPin, Plus, Loader2 } from "lucide-react";
import { useStops } from "@/features/operations/stops/hooks/use-stops";
import { StopItem } from "@/features/operations/stops/types/stop.types";
import { Popover } from "@/components/ui/popover";
import { CommandInput, CommandList, CommandEmpty, CommandItem } from "@/components/ui/command";
import { Button } from "@/components/ui/button";

interface RouteStopSelectorProps {
  onSelectStop: (stop: StopItem) => void;
  excludeStopIds?: string[];
  placeholder?: string;
  buttonLabel?: string;
}

export function RouteStopSelector({
  onSelectStop,
  excludeStopIds = [],
  placeholder = "Search active stops...",
  buttonLabel = "Add Stop",
}: RouteStopSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useStops({
    search: search || undefined,
    status: "ACTIVE",
    limit: 50,
  });

  const availableStops = (data?.items || []).filter(
    (stop) => !excludeStopIds.includes(stop.id)
  );

  const handleSelect = (stop: StopItem) => {
    onSelectStop(stop);
    setOpen(false);
    setSearch("");
  };

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-slate-200 hover:bg-slate-50 text-slate-800 gap-2 text-xs font-semibold rounded-xl"
        >
          <Plus className="h-4 w-4 text-[#002B66]" />
          <span>{buttonLabel}</span>
        </Button>
      }
    >
      <div className="w-72 space-y-1">
        <CommandInput
          value={search}
          onValueChange={setSearch}
          placeholder={placeholder}
          className="text-xs"
        />
        {isLoading ? (
          <div className="py-6 flex items-center justify-center text-xs text-slate-400 gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-[#002B66]" />
            <span>Searching stops...</span>
          </div>
        ) : availableStops.length === 0 ? (
          <CommandEmpty>No active stops available.</CommandEmpty>
        ) : (
          <CommandList>
            {availableStops.map((stop) => (
              <CommandItem
                key={stop.id}
                onSelect={() => handleSelect(stop)}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <MapPin className="h-3.5 w-3.5 text-[#002B66] shrink-0" />
                  <div className="truncate">
                    <span className="font-bold text-slate-900 block truncate">{stop.name}</span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      {stop.city}, {stop.state}
                    </span>
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandList>
        )}
      </div>
    </Popover>
  );
}
