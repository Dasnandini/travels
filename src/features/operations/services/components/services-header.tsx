"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ServicesHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#002B66] font-bold shadow-sm">
            <Calendar className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Bus Services & Schedules</h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Manage recurring service timetables, assigned buses, routes, operating days, and departure schedules.
        </p>
      </div>

      <Link href="/admin/dashboard/operations/services/new">
        <Button className="bg-[#002B66] hover:bg-[#001f4d] text-white font-semibold gap-2 rounded-xl shadow-md shadow-blue-950/20">
          <Plus className="h-4 w-4" />
          <span>Create Service</span>
        </Button>
      </Link>
    </div>
  );
}
