import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import RoutesPageContent from "./routes-page-content";

function RoutesPageFallback() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-56" />
      <div className="rounded-xl border p-4">
        <Skeleton className="mb-4 h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}

export default function RoutesPage() {
  return (
    <Suspense fallback={<RoutesPageFallback />}>
      <RoutesPageContent />
    </Suspense>
  );
}