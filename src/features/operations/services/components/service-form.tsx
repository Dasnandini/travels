"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createServiceSchema } from "../service.schema";
import { OperatingDaysSelector } from "./operating-days-selector";
import { ServiceTimetable, ServiceTimetableStopState } from "./service-timetable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useBuses } from "@/features/operations/buses/hooks/use-buses";
import { useRoutes } from "@/features/operations/routes/hooks/use-routes";
import { useRoute } from "@/features/operations/routes/hooks/use-route";
import { BusServiceItem } from "../service.types";
import { BusItem } from "@/features/operations/buses/bus.types";
import { RouteItem } from "@/features/operations/routes/types/route.types";
import { ServiceStatus, Weekday } from "@/generated/prisma/enums";
import { AlertCircle, Bus as BusIcon, Route as RouteIcon, Clock } from "lucide-react";

interface ServiceFormProps {
  initialValues?: Partial<BusServiceItem>;
  onSubmit: (values: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode?: "create" | "edit";
}

export function ServiceForm({
  initialValues,
  onSubmit,
  onCancel,
  isLoading,
  mode = "create",
}: ServiceFormProps) {
  const [selectedBusId, setSelectedBusId] = useState<string>(initialValues?.busId || "");
  const [selectedRouteId, setSelectedRouteId] = useState<string>(initialValues?.routeId || "");
  const [operatingDays, setOperatingDays] = useState<Weekday[]>(
    initialValues?.operatingDays || [
      Weekday.MONDAY,
      Weekday.TUESDAY,
      Weekday.WEDNESDAY,
      Weekday.THURSDAY,
      Weekday.FRIDAY,
      Weekday.SATURDAY,
      Weekday.SUNDAY,
    ]
  );

  const [timetableStops, setTimetableStops] = useState<ServiceTimetableStopState[]>(() => {
    if (initialValues?.stops && initialValues.stops.length > 0) {
      return initialValues.stops.map((s) => ({
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
    }
    return [];
  });

  const [formError, setFormError] = useState<string | null>(null);

  // Load Active Buses
  const { data: busesData } = useBuses({ status: "ACTIVE", limit: 100 });
  const buses: BusItem[] = Array.isArray(busesData) ? busesData : (busesData as any)?.items || [];

  // Load Active Routes
  const { data: routesData } = useRoutes({ status: "ACTIVE", limit: 100 });
  const routes: RouteItem[] = Array.isArray(routesData) ? routesData : (routesData as any)?.items || [];

  // Fetch full details of selected Route to load stops
  const { data: selectedRouteDetail } = useRoute(selectedRouteId);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      serviceCode: initialValues?.serviceCode || "",
      name: initialValues?.name || "",
      busId: initialValues?.busId || "",
      routeId: initialValues?.routeId || "",
      status: (initialValues?.status as ServiceStatus) || ServiceStatus.ACTIVE,
      operatingDays: operatingDays,
      stops: timetableStops.map((s) => ({
        routeStopId: s.routeStopId,
        arrivalTime: s.arrivalTime || null,
        departureTime: s.departureTime || null,
        boardingAllowed: s.boardingAllowed,
        droppingAllowed: s.droppingAllowed,
      })),
    },
  });

  // Keep react-hook-form `operatingDays` in sync
  const handleOperatingDaysChange = (days: Weekday[]) => {
    setOperatingDays(days);
    setValue("operatingDays", days, { shouldValidate: true });
  };

  // Auto-select first active bus if not set
  useEffect(() => {
    if (mode === "create" && buses.length > 0 && !selectedBusId) {
      const firstBusId = buses[0].id;
      setSelectedBusId(firstBusId);
      setValue("busId", firstBusId, { shouldValidate: true });
    }
  }, [buses, selectedBusId, mode, setValue]);

  // Auto-select first active route if not set
  useEffect(() => {
    if (mode === "create" && routes.length > 0 && !selectedRouteId) {
      const firstRouteId = routes[0].id;
      setSelectedRouteId(firstRouteId);
      setValue("routeId", firstRouteId, { shouldValidate: true });
    }
  }, [routes, selectedRouteId, mode, setValue]);

  // Auto-populate timetable stops when Route changes in Create mode
  useEffect(() => {
    if (selectedRouteDetail && selectedRouteDetail.stops && selectedRouteDetail.stops.length > 0) {
      const stopsState: ServiceTimetableStopState[] = selectedRouteDetail.stops.map((rs, index) => {
        const isFirst = index === 0;
        const isLast = index === selectedRouteDetail.stops.length - 1;

        return {
          routeStopId: rs.id,
          sequence: rs.sequence,
          stopName: rs.stop.name,
          city: rs.stop.city,
          state: rs.stop.state,
          arrivalTime: isFirst ? "" : "10:00",
          departureTime: isLast ? "" : "10:15",
          boardingAllowed: !isLast,
          droppingAllowed: !isFirst,
        };
      });

      setTimetableStops(stopsState);

      const formattedStops = stopsState.map((s) => ({
        routeStopId: s.routeStopId,
        arrivalTime: s.arrivalTime || null,
        departureTime: s.departureTime || null,
        boardingAllowed: s.boardingAllowed,
        droppingAllowed: s.droppingAllowed,
      }));
      setValue("stops", formattedStops, { shouldValidate: true });
    }
  }, [selectedRouteDetail, setValue]);

  // Keep react-hook-form `stops` in sync whenever timetableStops change
  useEffect(() => {
    if (timetableStops.length > 0) {
      const formattedStops = timetableStops.map((s) => ({
        routeStopId: s.routeStopId,
        arrivalTime: s.arrivalTime || null,
        departureTime: s.departureTime || null,
        boardingAllowed: s.boardingAllowed,
        droppingAllowed: s.droppingAllowed,
      }));
      setValue("stops", formattedStops, { shouldValidate: true });
    }
  }, [timetableStops, setValue]);

  // Auto-suggest Service Code from Bus and Route
  useEffect(() => {
    if (mode === "create" && selectedBusId && selectedRouteDetail) {
      const busObj = buses.find((b: BusItem) => b.id === selectedBusId);
      if (busObj && selectedRouteDetail.code) {
        const code = `${selectedRouteDetail.code}-${busObj.busNumber.replace(/[^A-Z0-9]/gi, "")}`;
        setValue("serviceCode", code, { shouldValidate: true });
        setValue("name", `${selectedRouteDetail.name} (${busObj.busNumber})`, { shouldValidate: true });
      }
    }
  }, [selectedBusId, selectedRouteDetail, mode, buses, setValue]);

  const handleTimetableStopChange = (index: number, updated: ServiceTimetableStopState) => {
    setTimetableStops((prev) => {
      const copy = [...prev];
      copy[index] = updated;
      return copy;
    });
  };

  const handleFormSubmit = (data: any) => {
    setFormError(null);

    if (operatingDays.length === 0) {
      setFormError("At least one operating day must be selected.");
      return;
    }

    if (timetableStops.length < 2) {
      setFormError("At least start and destination timetable stops are required.");
      return;
    }

    const payload = {
      ...data,
      serviceCode: data.serviceCode.trim().toUpperCase(),
      name: data.name.trim(),
      busId: selectedBusId,
      routeId: selectedRouteId,
      operatingDays,
      stops: timetableStops.map((s) => ({
        routeStopId: s.routeStopId,
        arrivalTime: s.arrivalTime || null,
        departureTime: s.departureTime || null,
        boardingAllowed: s.boardingAllowed,
        droppingAllowed: s.droppingAllowed,
      })),
    };

    onSubmit(payload);
  };

  const handleFormError = (formErrors: any) => {
    console.error("ServiceForm validation error:", formErrors);
    if (formErrors.stops) {
      setFormError("Please select a route to populate journey timetable stops.");
    } else if (formErrors.busId) {
      setFormError("Please select an active bus vehicle.");
    } else if (formErrors.routeId) {
      setFormError("Please select an active route itinerary.");
    } else if (formErrors.serviceCode) {
      setFormError(formErrors.serviceCode.message || "Please enter a valid service code.");
    } else if (formErrors.name) {
      setFormError(formErrors.name.message || "Please enter a valid service name.");
    } else {
      setFormError("Please fill out all required fields.");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit, handleFormError)} className="space-y-6">
      {formError && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{formError}</span>
        </div>
      )}

      {/* Step 1 & 2: Select Bus & Route */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Bus Selector */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <BusIcon className="h-3.5 w-3.5 text-[#002B66]" />
            <span>Select Vehicle / Bus</span> <span className="text-red-500">*</span>
          </label>
          <Select
            value={selectedBusId}
            onChange={(e) => {
              setSelectedBusId(e.target.value);
              setValue("busId", e.target.value, { shouldValidate: true });
            }}
            placeholder="-- Choose Active Bus --"
            options={buses.map((b: BusItem) => ({
              value: b.id,
              label: `${b.busNumber} (${b.registrationNumber}) — ${b.type.replace("_", " ")} (${b.seatCount} seats)`,
            }))}
            className="bg-slate-50 border-slate-200"
          />
          {errors.busId && (
            <p className="text-[11px] font-medium text-red-500">{errors.busId.message as string}</p>
          )}
        </div>

        {/* Route Selector */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <RouteIcon className="h-3.5 w-3.5 text-[#002B66]" />
            <span>Select Route</span> <span className="text-red-500">*</span>
          </label>
          <Select
            value={selectedRouteId}
            onChange={(e) => {
              setSelectedRouteId(e.target.value);
              setValue("routeId", e.target.value, { shouldValidate: true });
            }}
            placeholder="-- Choose Active Route --"
            options={routes.map((r: RouteItem) => ({
              value: r.id,
              label: `${r.code} — ${r.name} (${r.stops ? r.stops.length : 0} stops)`,
            }))}
            className="bg-slate-50 border-slate-200"
          />
          {errors.routeId && (
            <p className="text-[11px] font-medium text-red-500">{errors.routeId.message as string}</p>
          )}
        </div>
      </div>

      {/* Service Code & Name */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">
            Service Code <span className="text-red-500">*</span>
          </label>
          <Input
            {...register("serviceCode")}
            placeholder="e.g. BBSR-KOL-001"
            className="bg-slate-50 border-slate-200 uppercase font-mono text-xs"
          />
          {errors.serviceCode && (
            <p className="text-[11px] font-medium text-red-500">{errors.serviceCode.message as string}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">
            Service Name <span className="text-red-500">*</span>
          </label>
          <Input
            {...register("name")}
            placeholder="e.g. BBSR-KOL Daily Night Express"
            className="bg-slate-50 border-slate-200"
          />
          {errors.name && (
            <p className="text-[11px] font-medium text-red-500">{errors.name.message as string}</p>
          )}
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

      {/* Step 3: Operating Days Selector */}
      <OperatingDaysSelector selectedDays={operatingDays} onChange={handleOperatingDaysChange} />

      {/* Step 4: Journey Timetable */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-[#002B66]" />
          <span>Journey Timetable Configuration</span>
        </h3>
        <ServiceTimetable stops={timetableStops} onChangeStop={handleTimetableStopChange} />
        {errors.stops && (
          <p className="text-[11px] font-medium text-red-500">
            {typeof errors.stops.message === "string"
              ? errors.stops.message
              : "At least start and end timetable stops are required."}
          </p>
        )}
      </div>

      {/* Actions */}
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
          {mode === "edit" ? "Save Service Changes" : "Create Bus Service"}
        </Button>
      </div>
    </form>
  );
}
