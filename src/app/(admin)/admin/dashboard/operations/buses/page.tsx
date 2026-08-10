"use client";

import React, { useState } from "react";
import { BusesHeader } from "@/features/operations/buses/components/buses-header";
import { BusesTable } from "@/features/operations/buses/components/buses-table";
import { useBuses } from "@/features/operations/buses/hooks/use-buses";
import { useUpdateBus } from "@/features/operations/buses/hooks/use-update-bus";
import { ListBusesQueryDTO } from "@/features/operations/buses/bus.types";
import { BusStatus } from "@/generated/prisma/enums";

export default function BusesPage() {
  const [params, setParams] = useState<ListBusesQueryDTO>({
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { data, isLoading } = useBuses(params);
  const updateBusMutation = useUpdateBus();

  const handleParamsChange = (newParams: Partial<ListBusesQueryDTO>) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  };

  const handleDeactivate = (busId: string) => {
    updateBusMutation.mutate({
      id: busId,
      dto: { status: BusStatus.INACTIVE },
    });
  };

  return (
    <div className="space-y-6">
      <BusesHeader />

      <BusesTable
        data={data}
        isLoading={isLoading}
        params={params}
        onParamsChange={handleParamsChange}
        onDeactivate={handleDeactivate}
        isDeactivating={updateBusMutation.isPending}
      />
    </div>
  );
}
