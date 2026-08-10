"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { RoutesHeader } from "@/features/operations/routes/components/routes-header";
import { RoutesTable } from "@/features/operations/routes/components/routes-table";
import { useRoutes } from "@/features/operations/routes/hooks/use-routes";
import { useUpdateRoute } from "@/features/operations/routes/hooks/use-update-route";
import { ListRoutesParams, RouteStatus } from "@/features/operations/routes/types/route.types";

export default function RoutesPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const search = searchParams.get("search") || undefined;
  const status = (searchParams.get("status") as RouteStatus) || undefined;

  const params: ListRoutesParams = {
    page,
    limit,
    search,
    status,
  };

  const { data, isLoading } = useRoutes(params);
  const updateMutation = useUpdateRoute();

  const handleParamsChange = (newParams: Partial<ListRoutesParams>) => {
    const updated = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        updated.set(key, String(value));
      } else {
        updated.delete(key);
      }
    });

    const queryString = updated.toString();
    router.push(
      `/admin/operations/routes${
        queryString ? `?${queryString}` : ""
      }`
    );
  };

  const handleDeactivate = async (routeId: string) => {
    await updateMutation.mutateAsync({ id: routeId, data: { status: "INACTIVE" } });
  };

  return (
    <div className="space-y-6">
      <RoutesHeader />

      <RoutesTable
        data={data}
        isLoading={isLoading}
        params={params}
        onParamsChange={handleParamsChange}
        onDeactivate={handleDeactivate}
        isDeactivating={updateMutation.isPending}
      />
    </div>
  );
}
