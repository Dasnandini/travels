import React from "react";
import { Badge } from "@/components/ui/badge";
import { RouteStatus } from "../types/route.types";

export function RouteStatusBadge({ status }: { status: RouteStatus }) {
  if (status === "ACTIVE") {
    return (
      <Badge variant="success" className="gap-1.5 px-2.5 py-0.5 font-bold text-[11px] bg-emerald-50 text-emerald-700 border-emerald-200">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Active</span>
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="gap-1.5 px-2.5 py-0.5 text-slate-500 border-slate-200 bg-slate-100 font-semibold text-[11px]">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
      <span>Inactive</span>
    </Badge>
  );
}
