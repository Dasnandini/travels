"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Route as RouteIcon, Bus, Calendar, ShieldAlert } from "lucide-react";

export default function AdminOperationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isStopsActive = pathname.startsWith("/admin/dashboard/operations/stops");
  const isRoutesActive = pathname.startsWith("/admin/dashboard/operations/routes");
  const isBusesActive = pathname.startsWith("/admin/dashboard/operations/buses");
  const isServicesActive = pathname.startsWith("/admin/dashboard/operations/services");

  return (
    <div className="space-y-6">
      {/* Sub-Header Operations Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-bold shadow-sm">
              <ShieldAlert className="h-5 w-5 text-[#002B66]" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Operations Control</h1>
              <p className="text-xs text-slate-500">
                Manage bus stops, routes, fleet vehicles, physical seat layouts, and service timetables
              </p>
            </div>
          </div>
        </div>

        {/* Tab Links */}
        <nav className="flex items-center gap-2 pt-3 overflow-x-auto">
          <Link
            href="/admin/dashboard/operations/stops"
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
              isStopsActive
                ? "bg-[#002B66] text-white shadow-sm shadow-blue-950/20"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <MapPin className="h-4 w-4" />
            <span>Stops & Boarding</span>
          </Link>

          <Link
            href="/admin/dashboard/operations/routes"
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
              isRoutesActive
                ? "bg-[#002B66] text-white shadow-sm shadow-blue-950/20"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <RouteIcon className="h-4 w-4" />
            <span>Routes & Journeys</span>
          </Link>

          <Link
            href="/admin/dashboard/operations/buses"
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
              isBusesActive
                ? "bg-[#002B66] text-white shadow-sm shadow-blue-950/20"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Bus className="h-4 w-4" />
            <span>Buses & Fleet</span>
          </Link>

          <Link
            href="/admin/dashboard/operations/services"
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
              isServicesActive
                ? "bg-[#002B66] text-white shadow-sm shadow-blue-950/20"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Services & Schedules</span>
          </Link>
        </nav>
      </div>

      {/* Main Operations Page Content */}
      <div>{children}</div>
    </div>
  );
}
