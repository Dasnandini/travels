"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Edit2, Calendar, Bus as BusIcon, Route as RouteIcon, Clock, Power, Navigation, MapPin, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ServiceStatusBadge } from "./service-status-badge";
import { ServiceTimetable, ServiceTimetableStopState } from "./service-timetable";
import { BusServiceItem } from "../service.types";

interface ServiceDetailsProps {
  service: BusServiceItem;
  onEdit: () => void;
  onDeactivate: () => void;
  isDeactivating?: boolean;
}

export function ServiceDetails({
  service,
  onEdit,
  onDeactivate,
  isDeactivating,
}: ServiceDetailsProps) {
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);

  const handleConfirmDeactivate = () => {
    onDeactivate();
    setShowDeactivateDialog(false);
  };

  const timetableStops: ServiceTimetableStopState[] = service.stops.map((s) => ({
    routeStopId: s.routeStopId,
    sequence: s.sequence,
    stopName: s.stopName,
    city: s.city,
    state: s.state,
    arrivalTime: s.arrivalTime || "",
    departureTime: s.departureTime || "",
    boardingAllowed: s.boardingAllowed,
    droppingAllowed: s.droppingAllowed,
  }));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header & Back Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <Link
            href="/admin/dashboard/operations/services"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-3"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Bus Services</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-[#002B66] font-mono text-xs font-bold">
              {service.serviceCode}
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{service.name}</h1>
            <ServiceStatusBadge status={service.status} />
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            onClick={onEdit}
            variant="outline"
            className="border-slate-200 hover:bg-slate-50 text-slate-800 gap-2 text-xs font-semibold"
          >
            <Edit2 className="h-4 w-4 text-[#002B66]" />
            <span>Edit Service</span>
          </Button>

          {service.status === "ACTIVE" && (
            <Button
              onClick={() => setShowDeactivateDialog(true)}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 gap-2 text-xs font-semibold"
            >
              <Power className="h-4 w-4" />
              <span>Deactivate</span>
            </Button>
          )}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-white border-slate-200/80 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <BusIcon className="h-3.5 w-3.5 text-[#002B66]" />
              <span>Assigned Bus</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold font-mono text-[#002B66]">{service.bus.busNumber}</div>
            <p className="text-xs text-slate-500">
              {service.bus.registrationNumber} — {service.bus.type.replace("_", " ")} ({service.bus.seatCount} seats)
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200/80 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <RouteIcon className="h-3.5 w-3.5 text-blue-700" />
              <span>Route Itinerary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
              <span>{service.route.startDestination.city}</span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
              <span>{service.route.endDestination.city}</span>
            </div>
            <p className="text-xs text-slate-500">Code: {service.route.code}</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200/80 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[#002B66]" />
              <span>Operating Schedule</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold text-slate-900">
              {service.operatingDays.length === 7 ? "Every Day (Daily)" : `${service.operatingDays.length} Days / Week`}
            </div>
            <p className="text-xs text-slate-500 truncate">
              {service.operatingDays.map((d) => d.slice(0, 3)).join(", ")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Timetable Card */}
      <Card className="bg-white border-slate-200/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-slate-900">
            <Clock className="h-5 w-5 text-[#002B66]" />
            <span>Service Station Timetable</span>
          </CardTitle>
          <CardDescription className="text-slate-500">
            Scheduled arrival, departure, boarding, and dropping point configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ServiceTimetable stops={timetableStops} onChangeStop={() => {}} isReadOnly />
        </CardContent>
      </Card>

      {/* Deactivation Confirmation Dialog */}
      <Dialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
        <DialogContent onClose={() => setShowDeactivateDialog(false)}>
          <DialogHeader>
            <DialogTitle className="text-red-600">Deactivate Bus Service?</DialogTitle>
            <DialogDescription>
              <strong className="text-slate-900">{service.serviceCode}</strong> ({service.name}) will no longer be available for trip scheduling.
            </DialogDescription>
          </DialogHeader>

          <p className="text-xs text-slate-500 leading-relaxed">
            Existing historical schedules and passenger reservations will not be deleted.
          </p>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeactivateDialog(false)}
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
