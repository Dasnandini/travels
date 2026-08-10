import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import RouteDetailPageContent from "./route-detail-page-content";

export default function RouteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto space-y-6 pt-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-64" />
        </div>
      }
    >
      <RouteDetailPageContent params={params} />
    </Suspense>
  );
}
