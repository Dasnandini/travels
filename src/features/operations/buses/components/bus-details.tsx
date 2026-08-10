"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Edit2, Grid, Bus as BusIcon, Calendar, Clock, Power, ShieldAlert } from "lucide-react";
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
import { BusStatusBadge } from "./bus-status-badge";
import { BusItem } from "../bus.types";

interface BusDetailsProps {
  bus: BusItem;
  onEdit: () => void;
  onDeactivate: () => void;
  isDeactivating?: boolean;
}

export function BusDetails({ bus, onEdit, onDeactivate, isDeactivating }: BusDetailsProps) {
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);

  const handleConfirmDeactivate = () => {
    onDeactivate();
    setShowDeactivateDialog(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <Link
            href="/admin/dashboard/operations/buses"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-3"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Buses</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-[#002B66] font-mono text-xs font-bold">
              {bus.busNumber}
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {bus.registrationNumber}
            </h1>
            <BusStatusBadge status={bus.status} />
          </div>

          {bus.name && <p className="text-xs text-slate-500 mt-1 font-semibold">{bus.name}</p>}
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link href={`/admin/dashboard/operations/buses/${bus.id}/seat-layout`}>
            <Button
              variant="outline"
              className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 gap-2 text-xs font-semibold"
            >
              <Grid className="h-4 w-4" />
              <span>Seat Layout</span>
            </Button>
          </Link>

          <Button
            onClick={onEdit}
            variant="outline"
            className="border-slate-200 hover:bg-slate-50 text-slate-800 gap-2 text-xs font-semibold"
          >
            <Edit2 className="h-4 w-4 text-[#002B66]" />
            <span>Edit Bus</span>
          </Button>

          {bus.status === "ACTIVE" && (
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
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200/80 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <BusIcon className="h-3.5 w-3.5 text-[#002B66]" />
              <span>Bus Type</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-base font-bold text-slate-900">
              {bus.type.replace("_", " ")}
            </div>
            <p className="text-xs text-slate-500">Physical configuration</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200/80 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Grid className="h-3.5 w-3.5 text-indigo-600" />
              <span>Total Seats</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-[#002B66]">
              {bus.seatCount}
            </div>
            <p className="text-xs text-slate-500">Configured in layout</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200/80 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5 text-slate-600" />
              <span>Registration</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold font-mono text-slate-900">
              {bus.registrationNumber}
            </div>
            <p className="text-xs text-slate-500">RTO record</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200/80 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-600" />
              <span>Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-1">
              <BusStatusBadge status={bus.status} />
            </div>
            <p className="text-xs text-slate-500 mt-1">Fleet availability</p>
          </CardContent>
        </Card>
      </div>

      {bus.description && (
        <Card className="bg-white border-slate-200/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-slate-900">Bus Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-700 leading-relaxed">{bus.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Deactivation Confirmation Dialog */}
      <Dialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
        <DialogContent onClose={() => setShowDeactivateDialog(false)}>
          <DialogHeader>
            <DialogTitle className="text-red-600">Deactivate Bus?</DialogTitle>
            <DialogDescription>
              <strong className="text-slate-900">{bus.busNumber}</strong> ({bus.registrationNumber}) will no longer be available for assigning to new bus services.
            </DialogDescription>
          </DialogHeader>

          <p className="text-xs text-slate-500 leading-relaxed">
            Existing historical schedules and assigned services will not be deleted.
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
