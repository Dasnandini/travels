"use client";

import React, { use } from "react";
import { useBus } from "@/features/operations/buses/hooks/use-bus";
import { SeatLayoutEditor } from "@/features/operations/seat-layouts/components/seat-layout-editor";
import { Skeleton } from "@/components/ui/skeleton";

export default function BusSeatLayoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: bus, isLoading } = useBus(id);

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-6xl mx-auto p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!bus) {
    return (
      <div className="text-center p-12 bg-white rounded-2xl border border-slate-200">
        <p className="text-xs text-slate-500 font-semibold">Bus record not found.</p>
      </div>
    );
  }

  return <SeatLayoutEditor bus={bus} />;
}
