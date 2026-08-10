import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import ServiceDetailPageContent from "./service-detail-page-content";

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense
      fallback={
        <div className="space-y-4 max-w-4xl mx-auto p-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      <ServiceDetailPageContent params={params} />
    </Suspense>
  );
}
