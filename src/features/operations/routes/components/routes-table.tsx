"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  MoreVertical,
  Eye,
  Edit2,
  Power,
  Route as RouteIcon,
  ChevronLeft,
  ChevronRight,
  FilterX,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { RouteStatusBadge } from "./route-status-badge";
import { RouteItem, ListRoutesParams, RouteStatus } from "../types/route.types";

interface RoutesTableProps {
  data?: {
    items: RouteItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  isLoading: boolean;
  params: ListRoutesParams;
  onParamsChange: (newParams: Partial<ListRoutesParams>) => void;
  onDeactivate: (routeId: string) => void;
  isDeactivating?: boolean;
}

export function RoutesTable({
  data,
  isLoading,
  params,
  onParamsChange,
  onDeactivate,
  isDeactivating,
}: RoutesTableProps) {
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [deactivatingRoute, setDeactivatingRoute] = useState<RouteItem | null>(null);
  const [searchInput, setSearchInput] = useState(params.search || "");

  // Debounced search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== (params.search || "")) {
        onParamsChange({ search: searchInput || undefined, page: 1 });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, params.search, onParamsChange]);

  const items = data?.items || [];
  const pagination = data?.pagination || { page: 1, limit: 20, total: 0, totalPages: 1 };
  const isFiltered = Boolean(params.search || params.status);

  const handleClearFilters = () => {
    setSearchInput("");
    onParamsChange({ search: undefined, status: undefined, page: 1 });
  };

  const handleConfirmDeactivate = () => {
    if (deactivatingRoute) {
      onDeactivate(deactivatingRoute.id);
      setDeactivatingRoute(null);
    }
  };

  const startRecord = (pagination.page - 1) * pagination.limit + 1;
  const endRecord = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <div className="space-y-4">
      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search routes by name, code, or stop cities..."
            className="pl-9 bg-slate-50 border-slate-200 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="w-32">
            <Select
              value={params.status || ""}
              onChange={(e) =>
                onParamsChange({
                  status: (e.target.value as RouteStatus) || undefined,
                  page: 1,
                })
              }
              placeholder="All Status"
              options={[
                { value: "ACTIVE", label: "Active" },
                { value: "INACTIVE", label: "Inactive" },
              ]}
              className="bg-slate-50 border-slate-200 text-xs"
            />
          </div>

          {isFiltered && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="border-slate-200 text-slate-600 hover:text-slate-900 gap-1.5 text-xs"
            >
              <FilterX className="h-3.5 w-3.5" />
              <span>Reset</span>
            </Button>
          )}
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 shadow-sm">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        /* Empty States */
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center flex flex-col items-center justify-center space-y-3 shadow-sm">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#002B66]">
            <RouteIcon className="h-6 w-6" />
          </div>
          {isFiltered ? (
            <>
              <h3 className="text-base font-bold text-slate-900">No routes match your search</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Try changing your search keywords or clear your status filters.
              </p>
              <Button variant="outline" size="sm" onClick={handleClearFilters} className="mt-2">
                Clear Filters
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-base font-bold text-slate-900">No routes created yet</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Build your first route itinerary connecting start and destination bus stops.
              </p>
              <Link href="/admin/dashboard/operations/routes/create">
                <Button size="sm" className="bg-[#002B66] hover:bg-[#001f4d] text-white mt-2">
                  Create Route
                </Button>
              </Link>
            </>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Data Table */}
          <div className="hidden md:block rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Route Name</TableHead>
                  <TableHead>Start → End Journey</TableHead>
                  <TableHead>Stops</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((route) => (
                  <TableRow key={route.id}>
                    <TableCell className="font-mono text-xs font-bold text-[#002B66]">
                      <Link
                        href={`/admin/dashboard/operations/routes/${route.id}`}
                        className="hover:underline"
                      >
                        {route.code}
                      </Link>
                    </TableCell>
                    <TableCell className="font-bold text-slate-900">
                      <Link
                        href={`/admin/dashboard/operations/routes/${route.id}`}
                        className="hover:text-blue-700 transition-colors"
                      >
                        {route.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-xs text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium">{route.startDestination.city}</span>
                        <ArrowRight className="h-3 w-3 text-slate-400 shrink-0" />
                        <span className="font-medium">{route.endDestination.city}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-600 font-bold">
                      {route.stops.length} stops
                    </TableCell>
                    <TableCell>
                      <RouteStatusBadge status={route.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <button
                          type="button"
                          onClick={() =>
                            setActiveDropdownId(activeDropdownId === route.id ? null : route.id)
                          }
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          aria-label="Actions menu"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        <DropdownMenuContent
                          open={activeDropdownId === route.id}
                          onOpenChange={(open) => !open && setActiveDropdownId(null)}
                        >
                          <DropdownMenuItem onClick={() => (window.location.href = `/admin/dashboard/operations/routes/${route.id}`)}>
                            <Eye className="h-3.5 w-3.5 text-blue-900" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => (window.location.href = `/admin/dashboard/operations/routes/${route.id}?edit=true`)}
                          >
                            <Edit2 className="h-3.5 w-3.5 text-slate-500" />
                            <span>Edit Route</span>
                          </DropdownMenuItem>

                          {route.status === "ACTIVE" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => {
                                  setActiveDropdownId(null);
                                  setDeactivatingRoute(route);
                                }}
                              >
                                <Power className="h-3.5 w-3.5 text-red-600" />
                                <span>Deactivate</span>
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {items.map((route) => (
              <div
                key={route.id}
                className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#002B66] block">
                      {route.code}
                    </span>
                    <Link
                      href={`/admin/dashboard/operations/routes/${route.id}`}
                      className="text-sm font-bold text-slate-900 hover:text-blue-900 transition-colors"
                    >
                      {route.name}
                    </Link>
                  </div>
                  <RouteStatusBadge status={route.status} />
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-700">
                  <span className="font-medium">{route.startDestination.city}</span>
                  <ArrowRight className="h-3 w-3 text-slate-400 shrink-0" />
                  <span className="font-medium">{route.endDestination.city}</span>
                  <span className="text-slate-400 ml-auto font-mono text-[11px]">
                    {route.stops.length} stops
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => (window.location.href = `/admin/dashboard/operations/routes/${route.id}`)}
                    className="h-8 px-3 text-xs border-slate-200"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p className="text-xs text-slate-500">
              Showing <span className="font-semibold text-slate-900">{startRecord}</span>–
              <span className="font-semibold text-slate-900">{endRecord}</span> of{" "}
              <span className="font-semibold text-slate-900">{pagination.total}</span> routes
            </p>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => onParamsChange({ page: pagination.page - 1 })}
                className="h-8 px-3 border-slate-200 text-xs gap-1"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Previous</span>
              </Button>

              <div className="px-3 py-1 text-xs font-bold text-slate-700 rounded-lg bg-white border border-slate-200">
                {pagination.page} / {pagination.totalPages}
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => onParamsChange({ page: pagination.page + 1 })}
                className="h-8 px-3 border-slate-200 text-xs gap-1"
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Deactivation Confirmation Dialog */}
      <Dialog open={Boolean(deactivatingRoute)} onOpenChange={(open) => !open && setDeactivatingRoute(null)}>
        <DialogContent onClose={() => setDeactivatingRoute(null)}>
          <DialogHeader>
            <DialogTitle className="text-red-600">Deactivate Route?</DialogTitle>
            <DialogDescription>
              <strong className="text-slate-900">{deactivatingRoute?.code}</strong> ({deactivatingRoute?.name}) will no longer be available for new bus services.
            </DialogDescription>
          </DialogHeader>

          <p className="text-xs text-slate-500 leading-relaxed">
            Existing data and historical schedules using this route will not be deleted.
          </p>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeactivatingRoute(null)}
              disabled={isDeactivating}
              className="border-slate-200"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDeactivate}
              isLoading={isDeactivating}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              Deactivate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
