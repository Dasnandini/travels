"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useRoute } from "@/features/operations/routes/hooks/use-route";
import { useUpdateRoute } from "@/features/operations/routes/hooks/use-update-route";
import { RouteDetails } from "@/features/operations/routes/components/route-details";
import { RouteForm } from "@/features/operations/routes/components/route-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function RouteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();

  const isEditing = searchParams.get("edit") === "true";

  const { data: route, isLoading, isError, error } = useRoute(id);
  const updateMutation = useUpdateRoute();

  const handleEditSubmit = async (values: any) => {
    await updateMutation.mutateAsync({ id, data: values });
    router.push(`/admin/dashboard/operations/routes/${id}`);
  };

  const handleDeactivate = async () => {
    await updateMutation.mutateAsync({ id, data: { status: "INACTIVE" } });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pt-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  if (isError || !route) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-100">Unable to load route</h2>
        <p className="text-xs text-slate-400">
          {error?.message || `Route with ID '${id}' could not be found or retrieved.`}
        </p>
        <Link
          href="/admin/dashboard/operations/routes"
          className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Routes List</span>
        </Link>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="border-b border-slate-800/80 pb-6">
          <Link
            href={`/admin/dashboard/operations/routes/${id}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors mb-3"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Cancel Editing</span>
          </Link>
          <h1 className="text-xl font-bold text-slate-100">Edit Route: {route.name}</h1>
          <p className="text-xs text-slate-400 mt-1">
            Modify route parameters or reorder intermediate stop sequence.
          </p>
        </div>

        <RouteForm
          mode="edit"
          initialValues={route}
          onSubmit={handleEditSubmit}
          onCancel={() => router.push(`/admin/dashboard/operations/routes/${id}`)}
          isLoading={updateMutation.isPending}
        />
      </div>
    );
  }

  return (
    <RouteDetails
      route={route}
      onEdit={() => router.push(`/admin/dashboard/operations/routes/${id}?edit=true`)}
      onDeactivate={handleDeactivate}
      isDeactivating={updateMutation.isPending}
    />
  );
}
