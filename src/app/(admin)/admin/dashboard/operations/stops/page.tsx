"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { StopsHeader } from "@/features/operations/stops/components/stops-header";
import { StopsTable } from "@/features/operations/stops/components/stops-table";
import { StopDialog } from "@/features/operations/stops/components/stop-dialog";
import { useStops } from "@/features/operations/stops/hooks/use-stops";
import { useCreateStop } from "@/features/operations/stops/hooks/use-create-stop";
import { useUpdateStop } from "@/features/operations/stops/hooks/use-update-stop";
import { StopItem, ListStopsParams, StopStatus } from "@/features/operations/stops/types/stop.types";
import { Skeleton } from "@/components/ui/skeleton";

function StopsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const search = searchParams.get("search") || undefined;
  const status = (searchParams.get("status") as StopStatus) || undefined;
  const city = searchParams.get("city") || undefined;
  const state = searchParams.get("state") || undefined;

  const params: ListStopsParams = {
    page,
    limit,
    search,
    status,
    city,
    state,
  };

  const { data, isLoading } = useStops(params);
  const createMutation = useCreateStop();
  const updateMutation = useUpdateStop();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStop, setEditingStop] = useState<StopItem | undefined>(undefined);

  const handleParamsChange = (newParams: Partial<ListStopsParams>) => {
    const updated = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        updated.set(key, String(value));
      } else {
        updated.delete(key);
      }
    });

    router.push(`/admin/dashboard/operations/stops?${updated.toString()}`);
  };

  const handleOpenAdd = () => {
    setEditingStop(undefined);
    setDialogOpen(true);
  };

  const handleOpenEdit = (stop: StopItem) => {
    setEditingStop(stop);
    setDialogOpen(true);
  };

  const handleFormSubmit = async (values: any) => {
    if (editingStop) {
      await updateMutation.mutateAsync({ id: editingStop.id, data: values });
    } else {
      await createMutation.mutateAsync(values);
    }
    setDialogOpen(false);
  };

  const handleDeactivate = async (stopId: string) => {
    await updateMutation.mutateAsync({ id: stopId, data: { status: "INACTIVE" } });
  };

  return (
    <div className="space-y-6">
      <StopsHeader onAddStop={handleOpenAdd} />

      <StopsTable
        data={data}
        isLoading={isLoading}
        params={params}
        onParamsChange={handleParamsChange}
        onEdit={handleOpenEdit}
        onDeactivate={handleDeactivate}
        onAddStop={handleOpenAdd}
        isDeactivating={updateMutation.isPending}
      />

      <StopDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialValues={editingStop}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}

export default function StopsPage() {
  return (
    <Suspense fallback={<div className="space-y-4 p-6"><Skeleton className="h-10 w-48" /><Skeleton className="h-64 w-full" /></div>}>
      <StopsPageContent />
    </Suspense>
  );
}
