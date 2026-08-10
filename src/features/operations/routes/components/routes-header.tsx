import React from "react";
import Link from "next/link";
import { Route as RouteIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RoutesHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#002B66] font-bold shadow-sm">
            <RouteIcon className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Routes & Journeys</h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Manage the destinations and stop sequences used by your bus service itineraries.
        </p>
      </div>

      <Link href="/admin/dashboard/operations/routes/create">
        <Button className="bg-[#002B66] hover:bg-[#001f4d] text-white font-semibold gap-2 rounded-xl shadow-md shadow-blue-950/20">
          <Plus className="h-4 w-4" />
          <span>Create Route</span>
        </Button>
      </Link>
    </div>
  );
}
