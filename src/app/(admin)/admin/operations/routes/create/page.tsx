"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Route as RouteIcon } from "lucide-react";
import { RouteForm } from "@/features/operations/routes/components/route-form";
import { useCreateRoute } from "@/features/operations/routes/hooks/use-create-route";

export default function CreateRoutePage() {
  const router = useRouter();
  const createMutation = useCreateRoute();

  const handleSubmit = async (values: any) => {
    await createMutation.mutateAsync(values);
    router.push("/admin/operations/routes");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-6">
        <Link
          href="/admin/operations/routes"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors mb-3"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Routes</span>
        </Link>
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400 border border-blue-500/20">
            <RouteIcon className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">Create Route</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Define the journey starting destination, intermediate stop sequence, and final end destination.
        </p>
      </div>

      <RouteForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={() => router.push("/admin/operations/routes")}
        isLoading={createMutation.isPending}
      />
    </div>
  );
}
