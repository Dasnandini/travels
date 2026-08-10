import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import BusDetailPageContent from "./bus-detail-page-content";

export default function BusDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense
      fallback={
        <div className="space-y-4 max-w-4xl mx-auto p-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      <BusDetailPageContent params={params} />
    </Suspense>
  );
}
