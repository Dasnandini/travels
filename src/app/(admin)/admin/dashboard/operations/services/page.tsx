"use client";

import React, { useState } from "react";
import { ServicesHeader } from "@/features/operations/services/components/services-header";
import { ServicesTable } from "@/features/operations/services/components/services-table";
import { useServices } from "@/features/operations/services/hooks/use-services";
import { useUpdateService } from "@/features/operations/services/hooks/use-update-service";
import { ListServicesQueryDTO } from "@/features/operations/services/service.types";
import { ServiceStatus } from "@/generated/prisma/enums";

export default function ServicesPage() {
  const [params, setParams] = useState<ListServicesQueryDTO>({
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { data, isLoading } = useServices(params);
  const updateServiceMutation = useUpdateService();

  const handleParamsChange = (newParams: Partial<ListServicesQueryDTO>) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  };

  const handleDeactivate = (serviceId: string) => {
    updateServiceMutation.mutate({
      id: serviceId,
      dto: { status: ServiceStatus.INACTIVE },
    });
  };

  return (
    <div className="space-y-6">
      <ServicesHeader />

      <ServicesTable
        data={data}
        isLoading={isLoading}
        params={params}
        onParamsChange={handleParamsChange}
        onDeactivate={handleDeactivate}
        isDeactivating={updateServiceMutation.isPending}
      />
    </div>
  );
}
