import React from "react";
import { MapPin, Navigation } from "lucide-react";
import { RouteStopDetail, StopSummary } from "../types/route.types";

interface RouteTimelineProps {
  startDestination: StopSummary;
  endDestination: StopSummary;
  stops: RouteStopDetail[];
}

export function RouteTimeline({ startDestination, endDestination, stops }: RouteTimelineProps) {
  return (
    <div className="relative pl-6 py-2 space-y-6">
      {/* Connecting Vertical Line */}
      <div className="absolute left-[13px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-blue-900 via-indigo-600 to-emerald-600 opacity-60" />

      {/* Start Node */}
      <div className="relative flex items-start gap-4">
        <div className="absolute -left-[23px] top-0.5 h-6 w-6 rounded-full bg-[#002B66] flex items-center justify-center text-white ring-4 ring-white shadow-md shrink-0 z-10">
          <Navigation className="h-3 w-3" />
        </div>
        <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200/80 w-full">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#002B66]">
              START DESTINATION
            </span>
            <span className="text-[11px] font-mono text-slate-500">Sequence 1</span>
          </div>
          <h4 className="text-sm font-bold text-slate-900 mt-0.5">{startDestination.name}</h4>
          <p className="text-xs text-slate-500">
            {startDestination.city}, {startDestination.state}
          </p>
        </div>
      </div>

      {/* Intermediate Stops */}
      {stops.slice(1, -1).map((rs) => (
        <div key={rs.stop.id || rs.sequence} className="relative flex items-start gap-4">
          <div className="absolute -left-[19px] top-1.5 h-4 w-4 rounded-full bg-white border-2 border-indigo-600 ring-4 ring-white shrink-0 z-10" />
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 w-full flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">{rs.stop.name}</span>
                <span className="text-[10px] font-semibold text-slate-500">({rs.stop.city})</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-slate-400 font-bold">Stop #{rs.sequence}</span>
          </div>
        </div>
      ))}

      {/* End Node */}
      <div className="relative flex items-start gap-4">
        <div className="absolute -left-[23px] top-0.5 h-6 w-6 rounded-full bg-emerald-600 flex items-center justify-center text-white ring-4 ring-white shadow-md shrink-0 z-10">
          <MapPin className="h-3 w-3" />
        </div>
        <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 w-full">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700">
              END DESTINATION
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              Sequence {stops.length}
            </span>
          </div>
          <h4 className="text-sm font-bold text-slate-900 mt-0.5">{endDestination.name}</h4>
          <p className="text-xs text-slate-500">
            {endDestination.city}, {endDestination.state}
          </p>
        </div>
      </div>
    </div>
  );
}
