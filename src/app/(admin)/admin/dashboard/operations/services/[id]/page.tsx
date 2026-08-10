"use client";

import React, { use, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useService } from "@/features/operations/services/hooks/use-service";
import { useUpdateService } from "@/features/operations/services/hooks/use-update-service";
import { ServiceDetails } from "@/features/operations/services/components/service-details";
import { ServiceForm } from "@/features/operations/services/components/service-form";
import { Skeleton } from "@/components/ui/skeleton";
import { ServiceStatus } from "@/generated/prisma/enums";

function ServiceDetailPageContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();

  const isEditing = searchParams.get("edit") === "true";

  const { data: service, isLoading } = useService(id);
  const updateServiceMutation = useUpdateService();

  const handleDeactivate = () => {
    updateServiceMutation.mutate({
      id,
      dto: { status: ServiceStatus.INACTIVE },
    });
  };

  const handleEditSubmit = (values: any) => {
    updateServiceMutation.mutate(
      { id, dto: values },
      {
        onSuccess: () => {
          router.push(`/admin/dashboard/operations/services/${id}`);
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

  if (!service) {
    return (
      <div className="text-center p-12 bg-white rounded-2xl border border-slate-200">
        <p className="text-xs text-slate-500 font-semibold">Bus service record not found.</p>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <h1 className="text-xl font-bold text-slate-900">Edit Service {service.serviceCode}</h1>
        <div className="p-6 rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <ServiceForm
            initialValues={service}
            onSubmit={handleEditSubmit}
            onCancel={() => router.push(`/admin/dashboard/operations/services/${id}`)}
            isLoading={updateServiceMutation.isPending}
            mode="edit"
          />
        </div>
      </div>
    );
  }

  return (
    <ServiceDetails
      service={service}
      onEdit={() => router.push(`/admin/dashboard/operations/services/${id}?edit=true`)}
      onDeactivate={handleDeactivate}
      isDeactivating={updateServiceMutation.isPending}
    />
  );
}

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="space-y-4 max-w-4xl mx-auto p-6"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 w-full" /></div>}>
      <ServiceDetailPageContent params={params} />
    </Suspense>
  );
}
