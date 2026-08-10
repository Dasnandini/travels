"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar } from "lucide-react";
import { ServiceForm } from "@/features/operations/services/components/service-form";
import { useCreateService } from "@/features/operations/services/hooks/use-create-service";

export default function CreateServicePage() {
  const router = useRouter();
  const createServiceMutation = useCreateService();

  const handleSubmit = (values: any) => {
    createServiceMutation.mutate(values, {
      onSuccess: (newService) => {
        router.push(`/admin/dashboard/operations/services/${newService.id}`);
      },
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-slate-200/80 pb-6">
        <Link
          href="/admin/dashboard/operations/services"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-3"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Services</span>
        </Link>
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#002B66] font-bold shadow-sm">
            <Calendar className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Create Bus Service Schedule</h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Link an active bus vehicle to a route itinerary and configure operating days and timetable.
        </p>
      </div>

      <div className="p-6 rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <ServiceForm
          onSubmit={handleSubmit}
          onCancel={() => router.push("/admin/dashboard/operations/services")}
          isLoading={createServiceMutation.isPending}
          mode="create"
        />
      </div>
    </div>
  );
}
