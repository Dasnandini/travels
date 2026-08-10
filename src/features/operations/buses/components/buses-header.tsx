"use client";

import React from "react";
import Link from "next/link";
import { Bus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BusesHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#002B66] font-bold shadow-sm">
            <Bus className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Buses & Fleet Management</h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Manage the company's fleet, physical vehicles, and seat layout arrangements.
        </p>
      </div>

      <Link href="/admin/dashboard/operations/buses/new">
        <Button className="bg-[#002B66] hover:bg-[#001f4d] text-white font-semibold gap-2 rounded-xl shadow-md shadow-blue-950/20">
          <Plus className="h-4 w-4" />
          <span>Add Bus</span>
        </Button>
      </Link>
    </div>
  );
}
