"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  MoreVertical,
  Eye,
  Edit2,
  Power,
  MapPin,
  ChevronLeft,
  ChevronRight,
  FilterX,
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
import { StopStatusBadge } from "./stop-status-badge";
import { StopItem, ListStopsParams, StopStatus } from "../types/stop.types";

interface StopsTableProps {
  data?: {
    items: StopItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  isLoading: boolean;
  params: ListStopsParams;
  onParamsChange: (newParams: Partial<ListStopsParams>) => void;
  onEdit: (stop: StopItem) => void;
  onDeactivate: (stopId: string) => void;
  onAddStop: () => void;
  isDeactivating?: boolean;
}

export function StopsTable({
  data,
  isLoading,
  params,
  onParamsChange,
  onEdit,
  onDeactivate,
  onAddStop,
  isDeactivating,
}: StopsTableProps) {
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [deactivatingStop, setDeactivatingStop] = useState<StopItem | null>(null);
  const [searchInput, setSearchInput] = useState(params.search || "");

  // Debounced search input handler
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

  const isFiltered = Boolean(params.search || params.city || params.state || params.status);

  const handleClearFilters = () => {
    setSearchInput("");
    onParamsChange({
      search: undefined,
      city: undefined,
      state: undefined,
      status: undefined,
      page: 1,
    });
  };

  const handleConfirmDeactivate = () => {
    if (deactivatingStop) {
      onDeactivate(deactivatingStop.id);
      setDeactivatingStop(null);
    }
  };

  const startRecord = (pagination.page - 1) * pagination.limit + 1;
  const endRecord = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search stops by name, city, or state..."
            className="pl-9 bg-slate-50 border-slate-200 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {/* Status Filter */}
          <div className="w-32">
            <Select
              value={params.status || ""}
              onChange={(e) =>
                onParamsChange({
                  status: (e.target.value as StopStatus) || undefined,
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
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        /* Empty States */
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center flex flex-col items-center justify-center space-y-3 shadow-sm">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#002B66]">
            <MapPin className="h-6 w-6" />
          </div>
          {isFiltered ? (
            <>
              <h3 className="text-base font-bold text-slate-900">No stops match your search</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Try changing your search query or reset your status filters to view existing stops.
              </p>
              <Button variant="outline" size="sm" onClick={handleClearFilters} className="mt-2">
                Clear Filters
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-base font-bold text-slate-900">No stops found</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Create your first bus stop location to start building route itineraries.
              </p>
              <Button onClick={onAddStop} size="sm" className="bg-[#002B66] hover:bg-[#001f4d] text-white mt-2">
                Add Stop
              </Button>
            </>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stop Name</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Coordinates / Place ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((stop) => (
                  <TableRow key={stop.id}>
                    <TableCell className="font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-[#002B66] shrink-0" />
                        <Link
                          href={`/admin/dashboard/operations/stops/${stop.id}`}
                          className="hover:text-blue-700 transition-colors"
                        >
                          {stop.name}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-700 font-semibold">{stop.city}</TableCell>
                    <TableCell className="text-slate-500">{stop.state}</TableCell>
                    <TableCell className="font-mono text-xs text-slate-500">
                      {stop.latitude && stop.longitude ? (
                        <span>
                          {stop.latitude.toFixed(4)}, {stop.longitude.toFixed(4)}
                        </span>
                      ) : stop.googlePlaceId ? (
                        <span className="truncate max-w-[120px] block">{stop.googlePlaceId}</span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <StopStatusBadge status={stop.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <button
                          type="button"
                          onClick={() =>
                            setActiveDropdownId(activeDropdownId === stop.id ? null : stop.id)
                          }
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          aria-label="Actions menu"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        <DropdownMenuContent
                          open={activeDropdownId === stop.id}
                          onOpenChange={(open) => !open && setActiveDropdownId(null)}
                        >
                          <DropdownMenuItem onClick={() => (window.location.href = `/admin/dashboard/operations/stops/${stop.id}`)}>
                            <Eye className="h-3.5 w-3.5 text-blue-900" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setActiveDropdownId(null);
                              onEdit(stop);
                            }}
                          >
                            <Edit2 className="h-3.5 w-3.5 text-slate-500" />
                            <span>Edit Stop</span>
                          </DropdownMenuItem>

                          {stop.status === "ACTIVE" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => {
                                  setActiveDropdownId(null);
                                  setDeactivatingStop(stop);
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
            {items.map((stop) => (
              <div
                key={stop.id}
                className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#002B66] shrink-0" />
                    <div>
                      <Link
                        href={`/admin/dashboard/operations/stops/${stop.id}`}
                        className="text-sm font-bold text-slate-900 hover:text-blue-900 transition-colors"
                      >
                        {stop.name}
                      </Link>
                      <p className="text-xs text-slate-500">
                        {stop.city}, {stop.state}
                      </p>
                    </div>
                  </div>
                  <StopStatusBadge status={stop.status} />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="font-mono text-slate-500">
                    {stop.latitude && stop.longitude
                      ? `${stop.latitude.toFixed(4)}, ${stop.longitude.toFixed(4)}`
                      : stop.country}
                  </span>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => (window.location.href = `/admin/dashboard/operations/stops/${stop.id}`)}
                      className="h-8 px-2.5 text-xs border-slate-200"
                    >
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(stop)}
                      className="h-8 px-2.5 text-xs border-slate-200"
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p className="text-xs text-slate-500">
              Showing <span className="font-semibold text-slate-900">{startRecord}</span>–
              <span className="font-semibold text-slate-900">{endRecord}</span> of{" "}
              <span className="font-semibold text-slate-900">{pagination.total}</span> stops
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
      <Dialog open={Boolean(deactivatingStop)} onOpenChange={(open) => !open && setDeactivatingStop(null)}>
        <DialogContent onClose={() => setDeactivatingStop(null)}>
          <DialogHeader>
            <DialogTitle className="text-red-600">Deactivate Stop?</DialogTitle>
            <DialogDescription>
              <strong className="text-slate-900">{deactivatingStop?.name}</strong> ({deactivatingStop?.city}) will no longer be available when creating new routes.
            </DialogDescription>
          </DialogHeader>

          <p className="text-xs text-slate-500 leading-relaxed">
            Existing routes using this stop will not be modified or deleted.
          </p>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeactivatingStop(null)}
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
