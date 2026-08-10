"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { routeFormSchema, RouteFormSchemaValues } from "../schemas/route-form.schema";
import { RouteStopSelector } from "./route-stop-selector";
import { RouteStopList } from "./route-stop-list";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { StopItem } from "@/features/operations/stops/types/stop.types";
import { RouteItem } from "../types/route.types";
import { MapPin, Navigation, ArrowDown, AlertCircle } from "lucide-react";

interface RouteFormProps {
  initialValues?: Partial<RouteItem>;
  onSubmit: (values: RouteFormSchemaValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode?: "create" | "edit";
}

export function RouteForm({
  initialValues,
  onSubmit,
  onCancel,
  isLoading,
  mode = "create",
}: RouteFormProps) {
  const [startStop, setStartStop] = useState<StopItem | null>(
    initialValues?.startDestination
      ? ({
          id: initialValues.startDestination.id,
          name: initialValues.startDestination.name,
          city: initialValues.startDestination.city,
          state: initialValues.startDestination.state,
          country: initialValues.startDestination.country,
          status: "ACTIVE",
        } as StopItem)
      : null
  );

  const [endStop, setEndStop] = useState<StopItem | null>(
    initialValues?.endDestination
      ? ({
          id: initialValues.endDestination.id,
          name: initialValues.endDestination.name,
          city: initialValues.endDestination.city,
          state: initialValues.endDestination.state,
          country: initialValues.endDestination.country,
          status: "ACTIVE",
        } as StopItem)
      : null
  );

  const [intermediateStops, setIntermediateStops] = useState<StopItem[]>(() => {
    if (initialValues?.stops && initialValues.stops.length > 2) {
      return initialValues.stops.slice(1, -1).map((rs) => ({
        id: rs.stop.id,
        name: rs.stop.name,
        city: rs.stop.city,
        state: rs.stop.state,
        country: rs.stop.country,
        status: "ACTIVE",
      })) as StopItem[];
    }
    return [];
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(routeFormSchema),
    defaultValues: {
      name: initialValues?.name || "",
      code: initialValues?.code || "",
      description: initialValues?.description || "",
      status: (initialValues?.status as "ACTIVE" | "INACTIVE") || "ACTIVE",
      stops: [] as Array<{ stopId: string }>,
    },
  });

  // Sync stops into form schema
  useEffect(() => {
    const allStops: Array<{ stopId: string }> = [];
    if (startStop) allStops.push({ stopId: startStop.id });
    intermediateStops.forEach((s) => allStops.push({ stopId: s.id }));
    if (endStop) allStops.push({ stopId: endStop.id });

    setValue("stops", allStops, { shouldValidate: true });
  }, [startStop, intermediateStops, endStop, setValue]);

  // Auto-suggest Route Code from Start & End
  useEffect(() => {
    if (mode === "create" && startStop && endStop) {
      const startShort = startStop.city.substring(0, 4).toUpperCase();
      const endShort = endStop.city.substring(0, 4).toUpperCase();
      const autoCode = `${startShort}-${endShort}`;
      const autoName = `${startStop.city} - ${endStop.city}`;

      setValue("code", autoCode);
      setValue("name", autoName);
    }
  }, [startStop, endStop, mode, setValue]);

  const handleFormSubmit = (data: any) => {
    setValidationError(null);

    if (!startStop) {
      setValidationError("Start destination stop is required.");
      return;
    }

    if (!endStop) {
      setValidationError("End destination stop is required.");
      return;
    }

    if (startStop.id === endStop.id) {
      setValidationError("Start and End destinations cannot be the same stop.");
      return;
    }

    const allStopIds = [
      startStop.id,
      ...intermediateStops.map((s) => s.id),
      endStop.id,
    ];

    const uniqueSet = new Set(allStopIds);
    if (uniqueSet.size !== allStopIds.length) {
      setValidationError("A stop cannot appear multiple times in the same route.");
      return;
    }

    onSubmit({
      ...data,
      name: data.name.trim(),
      code: data.code.trim().toUpperCase(),
      stops: allStopIds.map((stopId) => ({ stopId })),
    });
  };

  const selectedIds = [
    ...(startStop ? [startStop.id] : []),
    ...intermediateStops.map((s) => s.id),
    ...(endStop ? [endStop.id] : []),
  ];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {validationError && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Basic Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">
            Route Name <span className="text-red-500">*</span>
          </label>
          <Input
            {...register("name")}
            placeholder="e.g. Bhubaneswar - Kolkata Express"
            className="bg-slate-50 border-slate-200"
          />
          {errors.name && (
            <p className="text-[11px] font-medium text-red-500">{errors.name?.message as string}</p>
          )}
        </div>

        {/* Code */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">
            Route Code <span className="text-red-500">*</span>
          </label>
          <Input
            {...register("code")}
            placeholder="e.g. BBSR-KOL"
            className="bg-slate-50 border-slate-200 uppercase font-mono text-xs"
          />
          {errors.code && (
            <p className="text-[11px] font-medium text-red-500">{errors.code?.message as string}</p>
          )}
        </div>
      </div>

      {/* Description & Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2 space-y-1">
          <label className="text-xs font-bold text-slate-700">Description</label>
          <Input
            {...register("description")}
            placeholder="e.g. Daily interstate express route via Cuttack and Balasore"
            className="bg-slate-50 border-slate-200"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Status</label>
          <Select
            {...register("status")}
            options={[
              { value: "ACTIVE", label: "Active" },
              { value: "INACTIVE", label: "Inactive" },
            ]}
            className="bg-slate-50 border-slate-200"
          />
        </div>
      </div>

      {/* Journey Builder Section */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <span>Journey Itinerary Builder</span>
        </h3>

        {/* START DESTINATION */}
        <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold tracking-wider text-[#002B66] flex items-center gap-1.5">
              <Navigation className="h-3.5 w-3.5" />
              <span>START DESTINATION (Sequence 1)</span>
            </span>
            {startStop && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setStartStop(null)}
                className="h-6 px-2 text-[10px] border-blue-200 text-blue-900 hover:bg-blue-100"
              >
                Change
              </Button>
            )}
          </div>

          {startStop ? (
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-[#002B66] flex items-center justify-center text-white font-bold text-xs">
                1
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900">{startStop.name}</span>
                <span className="text-[11px] text-slate-500 block">
                  {startStop.city}, {startStop.state}
                </span>
              </div>
            </div>
          ) : (
            <RouteStopSelector
              onSelectStop={setStartStop}
              excludeStopIds={selectedIds}
              placeholder="Search start destination stop..."
              buttonLabel="Select Start Stop"
            />
          )}
        </div>

        <div className="flex justify-center my-1">
          <ArrowDown className="h-4 w-4 text-slate-400" />
        </div>

        {/* INTERMEDIATE STOPS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              Intermediate Stops ({intermediateStops.length})
            </span>

            <RouteStopSelector
              onSelectStop={(stop) => setIntermediateStops((prev) => [...prev, stop])}
              excludeStopIds={selectedIds}
              placeholder="Search intermediate stop..."
              buttonLabel="+ Add Intermediate Stop"
            />
          </div>

          <RouteStopList
            stops={intermediateStops}
            onReorder={setIntermediateStops}
            onRemove={(index) =>
              setIntermediateStops((prev) => prev.filter((_, i) => i !== index))
            }
          />
        </div>

        <div className="flex justify-center my-1">
          <ArrowDown className="h-4 w-4 text-slate-400" />
        </div>

        {/* END DESTINATION */}
        <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold tracking-wider text-emerald-800 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              <span>END DESTINATION (Sequence {selectedIds.length || "N"})</span>
            </span>
            {endStop && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEndStop(null)}
                className="h-6 px-2 text-[10px] border-emerald-200 text-emerald-800 hover:bg-emerald-100"
              >
                Change
              </Button>
            )}
          </div>

          {endStop ? (
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                {selectedIds.length}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900">{endStop.name}</span>
                <span className="text-[11px] text-slate-500 block">
                  {endStop.city}, {endStop.state}
                </span>
              </div>
            </div>
          ) : (
            <RouteStopSelector
              onSelectStop={setEndStop}
              excludeStopIds={selectedIds}
              placeholder="Search end destination stop..."
              buttonLabel="Select End Stop"
            />
          )}
        </div>
      </div>

      {errors.stops && (
        <p className="text-[11px] font-medium text-red-500">{errors.stops?.message as string}</p>
      )}

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="border-slate-200 text-slate-700"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          className="bg-[#002B66] hover:bg-[#001f4d] text-white font-semibold shadow-md shadow-blue-950/20"
        >
          {mode === "edit" ? "Save Route Changes" : "Create Route"}
        </Button>
      </div>
    </form>
  );
}
