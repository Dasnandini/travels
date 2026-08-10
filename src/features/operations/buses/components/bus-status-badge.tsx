import React from "react";
import { Badge } from "@/components/ui/badge";
import { BusStatus } from "@/generated/prisma/enums";
import { CheckCircle2, AlertTriangle, XCircle, Wrench } from "lucide-react";

export function BusStatusBadge({ status }: { status: BusStatus }) {
  switch (status) {
    case "ACTIVE":
      return (
        <Badge variant="success" className="gap-1.5 px-2.5 py-0.5 font-bold text-[11px] bg-emerald-50 text-emerald-700 border-emerald-200">
          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
          <span>Active</span>
        </Badge>
      );
    case "MAINTENANCE":
      return (
        <Badge variant="outline" className="gap-1.5 px-2.5 py-0.5 font-bold text-[11px] bg-amber-50 text-amber-700 border-amber-200">
          <Wrench className="h-3 w-3 text-amber-600" />
          <span>Maintenance</span>
        </Badge>
      );
    case "RETIRED":
      return (
        <Badge variant="outline" className="gap-1.5 px-2.5 py-0.5 font-bold text-[11px] bg-red-50 text-red-700 border-red-200">
          <XCircle className="h-3 w-3 text-red-600" />
          <span>Retired</span>
        </Badge>
      );
    case "INACTIVE":
    default:
      return (
        <Badge variant="outline" className="gap-1.5 px-2.5 py-0.5 text-slate-500 border-slate-200 bg-slate-100 font-semibold text-[11px]">
          <AlertTriangle className="h-3 w-3 text-slate-400" />
          <span>Inactive</span>
        </Badge>
      );
  }
}
