"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Edit2, Route as RouteIcon, Navigation, MapPin, Power } from "lucide-react";
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
import { RouteStatusBadge } from "./route-status-badge";
import { RouteTimeline } from "./route-timeline";
import { RouteItem } from "../types/route.types";

interface RouteDetailsProps {
  route: RouteItem;
  onEdit: () => void;
  onDeactivate: () => void;
  isDeactivating?: boolean;
}

export function RouteDetails({
  route,
  onEdit,
  onDeactivate,
  isDeactivating,
}: RouteDetailsProps) {
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);

  const handleConfirmDeactivate = () => {
    onDeactivate();
    setShowDeactivateDialog(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back Link & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <Link
            href="/admin/dashboard/operations/routes"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-3"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Routes</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-[#002B66] font-mono text-xs font-bold">
              {route.code}
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{route.name}</h1>
            <RouteStatusBadge status={route.status} />
          </div>

          {route.description && (
            <p className="text-xs text-slate-500 mt-1">{route.description}</p>
          )}
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            onClick={onEdit}
            variant="outline"
            className="border-slate-200 hover:bg-slate-50 text-slate-800 gap-2 text-xs font-semibold"
          >
            <Edit2 className="h-4 w-4 text-[#002B66]" />
            <span>Edit Route</span>
          </Button>

          {route.status === "ACTIVE" && (
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
              <Navigation className="h-3.5 w-3.5 text-[#002B66]" />
              <span>Start Destination</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold text-slate-900">{route.startDestination.name}</div>
            <p className="text-xs text-slate-500">
              {route.startDestination.city}, {route.startDestination.state}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200/80 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-emerald-600" />
              <span>End Destination</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold text-slate-900">{route.endDestination.name}</div>
            <p className="text-xs text-slate-500">
              {route.endDestination.city}, {route.endDestination.state}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200/80 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <RouteIcon className="h-3.5 w-3.5 text-[#002B66]" />
              <span>Total Route Stops</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-[#002B66]">
              {route.stops.length}
            </div>
            <p className="text-xs text-slate-500">Includes start & destination</p>
          </CardContent>
        </Card>
      </div>

      {/* Journey Timeline Card */}
      <Card className="bg-white border-slate-200/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-slate-900">
            <RouteIcon className="h-5 w-5 text-[#002B66]" />
            <span>Ordered Journey Sequence</span>
          </CardTitle>
          <CardDescription className="text-slate-500">
            Exact geographical sequence from Start to Destination
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <RouteTimeline
            startDestination={route.startDestination}
            endDestination={route.endDestination}
            stops={route.stops}
          />
        </CardContent>
      </Card>

      {/* Deactivation Confirmation Dialog */}
      <Dialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
        <DialogContent onClose={() => setShowDeactivateDialog(false)}>
          <DialogHeader>
            <DialogTitle className="text-red-600">Deactivate Route?</DialogTitle>
            <DialogDescription>
              <strong className="text-slate-900">{route.code}</strong> ({route.name}) will no longer be available for new bus services.
            </DialogDescription>
          </DialogHeader>

          <p className="text-xs text-slate-500 leading-relaxed">
            Existing data and historical schedules using this route will not be deleted.
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
