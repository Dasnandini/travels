"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bus as BusIcon } from "lucide-react";
import { BusForm } from "@/features/operations/buses/components/bus-form";
import { useCreateBus } from "@/features/operations/buses/hooks/use-create-bus";

export default function CreateBusPage() {
  const router = useRouter();
  const createBusMutation = useCreateBus();

  const handleSubmit = (values: any) => {
    createBusMutation.mutate(values, {
      onSuccess: (newBus) => {
        router.push(`/admin/dashboard/operations/buses/${newBus.id}/seat-layout`);
      },
    });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="border-b border-slate-200/80 pb-6">
        <Link
          href="/admin/dashboard/operations/buses"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-3"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Buses</span>
        </Link>
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#002B66] font-bold shadow-sm">
            <BusIcon className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Add New Bus</h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Register a physical vehicle in the fleet before configuring its seat layout.
        </p>
      </div>

      <div className="p-6 rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <BusForm
          onSubmit={handleSubmit}
          onCancel={() => router.push("/admin/dashboard/operations/buses")}
          isLoading={createBusMutation.isPending}
          mode="create"
        />
      </div>
    </div>
  );
}
