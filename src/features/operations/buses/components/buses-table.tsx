"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  MoreVertical,
  Eye,
  Edit2,
  Grid,
  Power,
  Bus as BusIcon,
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
import { BusStatusBadge } from "./bus-status-badge";
import { BusItem, ListBusesQueryDTO } from "../bus.types";
import { BusStatus, BusType } from "@/generated/prisma/enums";

interface BusesTableProps {
  data?: {
    items: BusItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  isLoading: boolean;
  params: ListBusesQueryDTO;
  onParamsChange: (newParams: Partial<ListBusesQueryDTO>) => void;
  onDeactivate: (busId: string) => void;
  isDeactivating?: boolean;
}

export function BusesTable({
  data,
  isLoading,
  params,
  onParamsChange,
  onDeactivate,
  isDeactivating,
}: BusesTableProps) {
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [deactivatingBus, setDeactivatingBus] = useState<BusItem | null>(null);
  const [searchInput, setSearchInput] = useState(params.search || "");

  // Debounced search handler
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
  const isFiltered = Boolean(params.search || params.type || params.status);

  const handleClearFilters = () => {
    setSearchInput("");
    onParamsChange({ search: undefined, type: undefined, status: undefined, page: 1 });
  };

  const handleConfirmDeactivate = () => {
    if (deactivatingBus) {
      onDeactivate(deactivatingBus.id);
      setDeactivatingBus(null);
    }
  };

  const startRecord = (pagination.page - 1) * pagination.limit + 1;
  const endRecord = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search buses by bus number, registration number, or name..."
            className="pl-9 bg-slate-50 border-slate-200 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {/* Type Filter */}
          <div className="w-32">
            <Select
              value={params.type || ""}
              onChange={(e) =>
                onParamsChange({
                  type: (e.target.value as BusType) || undefined,
                  page: 1,
                })
              }
              placeholder="All Types"
              options={[
                { value: "SEATER", label: "Seater" },
                { value: "SEMI_SLEEPER", label: "Semi-Sleeper" },
                { value: "SLEEPER", label: "Sleeper" },
              ]}
              className="bg-slate-50 border-slate-200 text-xs"
            />
          </div>

          {/* Status Filter */}
          <div className="w-36">
            <Select
              value={params.status || ""}
              onChange={(e) =>
                onParamsChange({
                  status: (e.target.value as BusStatus) || undefined,
                  page: 1,
                })
              }
              placeholder="All Status"
              options={[
                { value: "ACTIVE", label: "Active" },
                { value: "INACTIVE", label: "Inactive" },
                { value: "MAINTENANCE", label: "Maintenance" },
                { value: "RETIRED", label: "Retired" },
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
              <Skeleton className="h-5 w-32" />
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
            <BusIcon className="h-6 w-6" />
          </div>
          {isFiltered ? (
            <>
              <h3 className="text-base font-bold text-slate-900">No buses match your filters</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Try adjusting your search query or clear bus type and status filters.
              </p>
              <Button variant="outline" size="sm" onClick={handleClearFilters} className="mt-2">
                Clear Filters
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-base font-bold text-slate-900">No buses in fleet</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Add your first bus to configure the physical vehicle fleet and seat layouts.
              </p>
              <Link href="/admin/dashboard/operations/buses/new">
                <Button size="sm" className="bg-[#002B66] hover:bg-[#001f4d] text-white mt-2">
                  Add Bus
                </Button>
              </Link>
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
                  <TableHead>Bus Number</TableHead>
                  <TableHead>Registration</TableHead>
                  <TableHead>Bus Type</TableHead>
                  <TableHead>Seats</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((bus) => (
                  <TableRow key={bus.id}>
                    <TableCell className="font-mono text-xs font-bold text-[#002B66]">
                      <Link
                        href={`/admin/dashboard/operations/buses/${bus.id}`}
                        className="hover:underline"
                      >
                        {bus.busNumber}
                      </Link>
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900">
                      <div>
                        <span>{bus.registrationNumber}</span>
                        {bus.name && (
                          <span className="text-xs font-normal text-slate-500 block">
                            {bus.name}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-bold text-slate-700">
                      {bus.type.replace("_", " ")}
                    </TableCell>
                    <TableCell className="font-mono text-xs font-bold text-slate-600">
                      {bus.seatCount} seats
                    </TableCell>
                    <TableCell>
                      <BusStatusBadge status={bus.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <button
                          type="button"
                          onClick={() =>
                            setActiveDropdownId(activeDropdownId === bus.id ? null : bus.id)
                          }
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          aria-label="Actions menu"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        <DropdownMenuContent
                          open={activeDropdownId === bus.id}
                          onOpenChange={(open) => !open && setActiveDropdownId(null)}
                        >
                          <DropdownMenuItem onClick={() => (window.location.href = `/admin/dashboard/operations/buses/${bus.id}`)}>
                            <Eye className="h-3.5 w-3.5 text-blue-900" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => (window.location.href = `/admin/dashboard/operations/buses/${bus.id}/seat-layout`)}>
                            <Grid className="h-3.5 w-3.5 text-indigo-600" />
                            <span>Seat Layout</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => (window.location.href = `/admin/dashboard/operations/buses/${bus.id}?edit=true`)}>
                            <Edit2 className="h-3.5 w-3.5 text-slate-500" />
                            <span>Edit Bus</span>
                          </DropdownMenuItem>

                          {bus.status === "ACTIVE" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => {
                                  setActiveDropdownId(null);
                                  setDeactivatingBus(bus);
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
            {items.map((bus) => (
              <div
                key={bus.id}
                className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#002B66] block">
                      {bus.busNumber}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{bus.registrationNumber}</h4>
                    {bus.name && <p className="text-xs text-slate-500">{bus.name}</p>}
                  </div>
                  <BusStatusBadge status={bus.status} />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <span>Type: <strong className="text-slate-900">{bus.type.replace("_", " ")}</strong></span>
                  <span className="font-mono font-bold text-[#002B66]">{bus.seatCount} seats</span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <Link href={`/admin/dashboard/operations/buses/${bus.id}/seat-layout`}>
                    <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs border-slate-200 gap-1 text-indigo-700">
                      <Grid className="h-3.5 w-3.5" />
                      <span>Layout</span>
                    </Button>
                  </Link>
                  <Link href={`/admin/dashboard/operations/buses/${bus.id}`}>
                    <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs border-slate-200">
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p className="text-xs text-slate-500">
              Showing <span className="font-semibold text-slate-900">{startRecord}</span>–
              <span className="font-semibold text-slate-900">{endRecord}</span> of{" "}
              <span className="font-semibold text-slate-900">{pagination.total}</span> buses
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
      <Dialog open={Boolean(deactivatingBus)} onOpenChange={(open) => !open && setDeactivatingBus(null)}>
        <DialogContent onClose={() => setDeactivatingBus(null)}>
          <DialogHeader>
            <DialogTitle className="text-red-600">Deactivate Bus?</DialogTitle>
            <DialogDescription>
              <strong className="text-slate-900">{deactivatingBus?.busNumber}</strong> ({deactivatingBus?.registrationNumber}) will no longer be available for new bus services.
            </DialogDescription>
          </DialogHeader>

          <p className="text-xs text-slate-500 leading-relaxed">
            Existing historical schedules and past trips will not be deleted.
          </p>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeactivatingBus(null)}
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
