"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useStop } from "@/features/operations/stops/hooks/use-stop";
import { useUpdateStop } from "@/features/operations/stops/hooks/use-update-stop";
import { StopDetails } from "@/features/operations/stops/components/stop-details";
import { StopDialog } from "@/features/operations/stops/components/stop-dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function StopDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: stop, isLoading, isError, error } = useStop(id);
  const updateMutation = useUpdateStop();

  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleEditSubmit = async (values: any) => {
    await updateMutation.mutateAsync({ id, data: values });
    setEditDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pt-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 md:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (isError || !stop) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-100">Unable to load stop</h2>
        <p className="text-xs text-slate-400">
          {error?.message || `Stop with ID '${id}' could not be found or retrieved.`}
        </p>
        <Link
          href="/admin/operations/stops"
          className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Stops List</span>
        </Link>
      </div>
    );
  }

  return (
    <>
      <StopDetails stop={stop} onEdit={() => setEditDialogOpen(true)} />

      <StopDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        initialValues={stop}
        onSubmit={handleEditSubmit}
        isLoading={updateMutation.isPending}
      />
    </>
  );
}
