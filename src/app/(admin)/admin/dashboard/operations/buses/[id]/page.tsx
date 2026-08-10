"use client";

import React, { use } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useBus } from "@/features/operations/buses/hooks/use-bus";
import { useUpdateBus } from "@/features/operations/buses/hooks/use-update-bus";
import { BusDetails } from "@/features/operations/buses/components/bus-details";
import { BusForm } from "@/features/operations/buses/components/bus-form";
import { Skeleton } from "@/components/ui/skeleton";
import { BusStatus } from "@/generated/prisma/enums";

export default function BusDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();

  const isEditing = searchParams.get("edit") === "true";

  const { data: bus, isLoading } = useBus(id);
  const updateBusMutation = useUpdateBus();

  const handleDeactivate = () => {
    updateBusMutation.mutate({
      id,
      dto: { status: BusStatus.INACTIVE },
    });
  };

  const handleEditSubmit = (values: any) => {
    updateBusMutation.mutate(
      { id, dto: values },
      {
        onSuccess: () => {
          router.push(`/admin/dashboard/operations/buses/${id}`);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
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

  if (isEditing) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <h1 className="text-xl font-bold text-slate-900">Edit Bus {bus.busNumber}</h1>
        <div className="p-6 rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <BusForm
            initialValues={bus}
            onSubmit={handleEditSubmit}
            onCancel={() => router.push(`/admin/dashboard/operations/buses/${id}`)}
            isLoading={updateBusMutation.isPending}
            mode="edit"
          />
        </div>
      </div>
    );
  }

  return (
    <BusDetails
      bus={bus}
      onEdit={() => router.push(`/admin/dashboard/operations/buses/${id}?edit=true`)}
      onDeactivate={handleDeactivate}
      isDeactivating={updateBusMutation.isPending}
    />
  );
}
