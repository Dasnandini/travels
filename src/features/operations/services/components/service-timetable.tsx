"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { ServiceStopDetail } from "../service.types";
import { MapPin, Navigation, Clock, Check, X } from "lucide-react";

export interface ServiceTimetableStopState {
  routeStopId: string;
  sequence: number;
  stopName: string;
  city: string;
  state: string;
  arrivalTime: string;
  departureTime: string;
  boardingAllowed: boolean;
  droppingAllowed: boolean;
}

interface ServiceTimetableProps {
  stops: ServiceTimetableStopState[];
  onChangeStop: (index: number, updatedStop: ServiceTimetableStopState) => void;
  isReadOnly?: boolean;
}

export function ServiceTimetable({ stops, onChangeStop, isReadOnly = false }: ServiceTimetableProps) {
  if (stops.length === 0) {
    return (
      <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 bg-white">
        <p className="text-xs text-slate-500 font-semibold">
          Select a route to populate the stop timetable sequence.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Seq</TableHead>
            <TableHead>Stop / Station Name</TableHead>
            <TableHead>Arrival Time</TableHead>
            <TableHead>Departure Time</TableHead>
            <TableHead className="text-center">Boarding</TableHead>
            <TableHead className="text-center">Dropping</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stops.map((stop, index) => {
            const isFirst = index === 0;
            const isLast = index === stops.length - 1;

            return (
              <TableRow key={stop.routeStopId}>
                <TableCell className="font-mono text-xs font-bold text-[#002B66]">
                  {stop.sequence}
                </TableCell>
                <TableCell className="font-bold text-slate-900">
                  <div className="flex items-center gap-2">
                    {isFirst ? (
                      <Navigation className="h-4 w-4 text-[#002B66] shrink-0" />
                    ) : isLast ? (
                      <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-slate-400 shrink-0" />
                    )}
                    <div>
                      <span>{stop.stopName}</span>
                      <span className="text-xs font-normal text-slate-500 block">
                        {stop.city}, {stop.state}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Arrival Time */}
                <TableCell>
                  {isFirst ? (
                    <span className="text-xs text-slate-400 font-mono italic">— Start —</span>
                  ) : isReadOnly ? (
                    <span className="font-mono text-xs font-bold text-slate-900">
                      {stop.arrivalTime || "N/A"}
                    </span>
                  ) : (
                    <Input
                      type="time"
                      value={stop.arrivalTime}
                      onChange={(e) =>
                        onChangeStop(index, {
                          ...stop,
                          arrivalTime: e.target.value,
                        })
                      }
                      className="bg-slate-50 border-slate-200 font-mono text-xs h-9 w-32"
                    />
                  )}
                </TableCell>

                {/* Departure Time */}
                <TableCell>
                  {isLast ? (
                    <span className="text-xs text-slate-400 font-mono italic">— Destination —</span>
                  ) : isReadOnly ? (
                    <span className="font-mono text-xs font-bold text-slate-900">
                      {stop.departureTime || "N/A"}
                    </span>
                  ) : (
                    <Input
                      type="time"
                      value={stop.departureTime}
                      onChange={(e) =>
                        onChangeStop(index, {
                          ...stop,
                          departureTime: e.target.value,
                        })
                      }
                      className="bg-slate-50 border-slate-200 font-mono text-xs h-9 w-32"
                    />
                  )}
                </TableCell>

                {/* Boarding Allowed Checkbox */}
                <TableCell className="text-center">
                  {isReadOnly ? (
                    stop.boardingAllowed ? (
                      <Check className="h-4 w-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-slate-300 mx-auto" />
                    )
                  ) : (
                    <input
                      type="checkbox"
                      checked={stop.boardingAllowed}
                      onChange={(e) =>
                        onChangeStop(index, {
                          ...stop,
                          boardingAllowed: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-[#002B66] rounded border-slate-300 focus:ring-blue-900 cursor-pointer"
                    />
                  )}
                </TableCell>

                {/* Dropping Allowed Checkbox */}
                <TableCell className="text-center">
                  {isReadOnly ? (
                    stop.droppingAllowed ? (
                      <Check className="h-4 w-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-slate-300 mx-auto" />
                    )
                  ) : (
                    <input
                      type="checkbox"
                      checked={stop.droppingAllowed}
                      onChange={(e) =>
                        onChangeStop(index, {
                          ...stop,
                          droppingAllowed: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-[#002B66] rounded border-slate-300 focus:ring-blue-900 cursor-pointer"
                    />
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
