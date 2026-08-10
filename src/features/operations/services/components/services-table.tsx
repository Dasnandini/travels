"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  MoreVertical,
  Eye,
  Edit2,
  Power,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  FilterX,
  ArrowRight,
  Bus as BusIcon,
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
import { ServiceStatusBadge } from "./service-status-badge";
import { BusServiceItem, ListServicesQueryDTO } from "../service.types";
import { ServiceStatus } from "@/generated/prisma/enums";

interface ServicesTableProps {
  data?: {
    items: BusServiceItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  isLoading: boolean;
  params: ListServicesQueryDTO;
  onParamsChange: (newParams: Partial<ListServicesQueryDTO>) => void;
  onDeactivate: (serviceId: string) => void;
  isDeactivating?: boolean;
}

export function ServicesTable({
  data,
  isLoading,
  params,
  onParamsChange,
  onDeactivate,
  isDeactivating,
}: ServicesTableProps) {
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [deactivatingService, setDeactivatingService] = useState<BusServiceItem | null>(null);
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
    if (deactivatingService) {
      onDeactivate(deactivatingService.id);
      setDeactivatingService(null);
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
            placeholder="Search services by code, name, bus number, or route..."
            className="pl-9 bg-slate-50 border-slate-200 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="w-36">
            <Select
              value={params.status || ""}
              onChange={(e) =>
                onParamsChange({
                  status: (e.target.value as ServiceStatus) || undefined,
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
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        /* Empty States */
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center flex flex-col items-center justify-center space-y-3 shadow-sm">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#002B66]">
            <CalendarIcon className="h-6 w-6" />
          </div>
          {isFiltered ? (
            <>
              <h3 className="text-base font-bold text-slate-900">No bus services match your search</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Try changing your search query or reset status filters.
              </p>
              <Button variant="outline" size="sm" onClick={handleClearFilters} className="mt-2">
                Clear Filters
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-base font-bold text-slate-900">No bus services created yet</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Create your first bus service by linking an active bus to an itinerary route.
              </p>
              <Link href="/admin/dashboard/operations/services/new">
                <Button size="sm" className="bg-[#002B66] hover:bg-[#001f4d] text-white mt-2">
                  Create Service
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
                  <TableHead>Code</TableHead>
                  <TableHead>Service & Route</TableHead>
                  <TableHead>Assigned Vehicle</TableHead>
                  <TableHead>Operating Days</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((svc) => (
                  <TableRow key={svc.id}>
                    <TableCell className="font-mono text-xs font-bold text-[#002B66]">
                      <Link
                        href={`/admin/dashboard/operations/services/${svc.id}`}
                        className="hover:underline"
                      >
                        {svc.serviceCode}
                      </Link>
                    </TableCell>

                    <TableCell className="font-bold text-slate-900">
                      <div>
                        <Link
                          href={`/admin/dashboard/operations/services/${svc.id}`}
                          className="hover:text-blue-700 transition-colors"
                        >
                          {svc.name}
                        </Link>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mt-0.5">
                          <span>{svc.route.startDestination.city}</span>
                          <ArrowRight className="h-3 w-3 text-slate-400 shrink-0" />
                          <span>{svc.route.endDestination.city}</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs font-semibold text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <BusIcon className="h-3.5 w-3.5 text-[#002B66]" />
                        <span>{svc.bus.busNumber}</span>
                        <span className="text-[11px] text-slate-400 font-mono">({svc.bus.seatCount}s)</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs font-bold text-slate-600">
                      {svc.operatingDays.length === 7 ? (
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-[#002B66] font-bold">
                          Daily
                        </span>
                      ) : (
                        <span>{svc.operatingDays.map((d) => d.slice(0, 3)).join(", ")}</span>
                      )}
                    </TableCell>

                    <TableCell>
                      <ServiceStatusBadge status={svc.status} />
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <button
                          type="button"
                          onClick={() =>
                            setActiveDropdownId(activeDropdownId === svc.id ? null : svc.id)
                          }
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          aria-label="Actions menu"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        <DropdownMenuContent
                          open={activeDropdownId === svc.id}
                          onOpenChange={(open) => !open && setActiveDropdownId(null)}
                        >
                          <DropdownMenuItem onClick={() => (window.location.href = `/admin/dashboard/operations/services/${svc.id}`)}>
                            <Eye className="h-3.5 w-3.5 text-blue-900" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => (window.location.href = `/admin/dashboard/operations/services/${svc.id}?edit=true`)}>
                            <Edit2 className="h-3.5 w-3.5 text-slate-500" />
                            <span>Edit Timetable</span>
                          </DropdownMenuItem>

                          {svc.status === "ACTIVE" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => {
                                  setActiveDropdownId(null);
                                  setDeactivatingService(svc);
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
            {items.map((svc) => (
              <div
                key={svc.id}
                className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#002B66] block">
                      {svc.serviceCode}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{svc.name}</h4>
                  </div>
                  <ServiceStatusBadge status={svc.status} />
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-700">
                  <span>{svc.route.startDestination.city}</span>
                  <ArrowRight className="h-3 w-3 text-slate-400" />
                  <span>{svc.route.endDestination.city}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span>Bus: <strong className="text-slate-900">{svc.bus.busNumber}</strong></span>
                  <span className="font-bold text-[#002B66]">
                    {svc.operatingDays.length === 7 ? "Daily" : `${svc.operatingDays.length} days/wk`}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <Link href={`/admin/dashboard/operations/services/${svc.id}`}>
                    <Button variant="outline" size="sm" className="h-8 px-3 text-xs border-slate-200">
                      View Timetable
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p className="text-xs text-slate-500">
              Showing <span className="font-semibold text-slate-900">{startRecord}</span>–
              <span className="font-semibold text-slate-900">{endRecord}</span> of{" "}
              <span className="font-semibold text-slate-900">{pagination.total}</span> services
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
      <Dialog open={Boolean(deactivatingService)} onOpenChange={(open) => !open && setDeactivatingService(null)}>
        <DialogContent onClose={() => setDeactivatingService(null)}>
          <DialogHeader>
            <DialogTitle className="text-red-600">Deactivate Bus Service?</DialogTitle>
            <DialogDescription>
              <strong className="text-slate-900">{deactivatingService?.serviceCode}</strong> ({deactivatingService?.name}) will no longer be available for generating new trip schedules.
            </DialogDescription>
          </DialogHeader>

          <p className="text-xs text-slate-500 leading-relaxed">
            Existing historical trips and bookings will remain unchanged.
          </p>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeactivatingService(null)}
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
