"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Globe, Calendar, Clock, Edit2, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StopStatusBadge } from "./stop-status-badge";
import { StopItem } from "../types/stop.types";

interface StopDetailsProps {
  stop: StopItem;
  onEdit: () => void;
}

export function StopDetails({ stop, onEdit }: StopDetailsProps) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Back & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <Link
            href="/admin/dashboard/operations/stops"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-3"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Stops</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{stop.name}</h1>
            <StopStatusBadge status={stop.status} />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {stop.city}, {stop.state}, {stop.country}
          </p>
        </div>

        <Button
          onClick={onEdit}
          variant="outline"
          className="border-slate-200 hover:bg-slate-50 text-slate-800 gap-2 self-start sm:self-auto"
        >
          <Edit2 className="h-4 w-4 text-[#002B66]" />
          <span>Edit Stop</span>
        </Button>
      </div>

      {/* Main Grid Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Location Details Card (Span 2) */}
        <Card className="md:col-span-2 bg-white border-slate-200/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-slate-900">
              <MapPin className="h-5 w-5 text-[#002B66]" />
              <span>Location Overview</span>
            </CardTitle>
            <CardDescription className="text-slate-500">
              Geographical boarding point parameters and address details
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-xs font-bold text-slate-500">Full Address</span>
              <p className="text-sm font-semibold text-slate-900">
                {stop.address || "No detailed address recorded."}
              </p>
            </div>

            {stop.landmark && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-xs font-bold text-slate-500">Landmark</span>
                <p className="text-sm font-semibold text-slate-900">{stop.landmark}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-xs font-bold text-slate-500">Latitude</span>
                <p className="text-sm font-mono font-bold text-slate-900">
                  {stop.latitude !== null ? stop.latitude : "N/A"}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-xs font-bold text-slate-500">Longitude</span>
                <p className="text-sm font-mono font-bold text-slate-900">
                  {stop.longitude !== null ? stop.longitude : "N/A"}
                </p>
              </div>
            </div>

            {stop.googlePlaceId && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-blue-600" />
                  <span>Google Place ID</span>
                </span>
                <p className="text-xs font-mono text-slate-700 truncate">{stop.googlePlaceId}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Audit & Status Card (Span 1) */}
        <Card className="bg-white border-slate-200/80 shadow-sm space-y-4">
          <CardHeader>
            <CardTitle className="text-base text-slate-900">Metadata</CardTitle>
            <CardDescription className="text-slate-500">System records</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 text-xs">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <Calendar className="h-4 w-4 text-[#002B66] shrink-0" />
              <div>
                <span className="text-slate-500 font-bold block">Created At</span>
                <span className="text-slate-900 font-bold">
                  {new Date(stop.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <Clock className="h-4 w-4 text-[#002B66] shrink-0" />
              <div>
                <span className="text-slate-500 font-bold block">Last Updated</span>
                <span className="text-slate-900 font-bold">
                  {new Date(stop.updatedAt).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Used by Routes Section */}
      <Card className="bg-white border-slate-200/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-slate-900">
            <ShieldAlert className="h-5 w-5 text-[#002B66]" />
            <span>Route Associations</span>
          </CardTitle>
          <CardDescription className="text-slate-500">
            Routes currently including {stop.name} as a start, intermediate, or end destination
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 rounded-xl border border-dashed border-slate-200 text-center">
            <p className="text-xs text-slate-400">
              Route associations are automatically linked when adding this stop to active routes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
