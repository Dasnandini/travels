"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBusSchema } from "../bus.schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { BusItem } from "../bus.types";
import { BusType, BusStatus } from "@/generated/prisma/enums";

interface BusFormProps {
  initialValues?: Partial<BusItem>;
  onSubmit: (values: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode?: "create" | "edit";
}

export function BusForm({
  initialValues,
  onSubmit,
  onCancel,
  isLoading,
  mode = "create",
}: BusFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createBusSchema),
    defaultValues: {
      busNumber: initialValues?.busNumber || "",
      registrationNumber: initialValues?.registrationNumber || "",
      name: initialValues?.name || "",
      type: (initialValues?.type as BusType) || BusType.SLEEPER,
      description: initialValues?.description || "",
      status: (initialValues?.status as BusStatus) || BusStatus.ACTIVE,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Bus Number */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">
            Bus Number <span className="text-red-500">*</span>
          </label>
          <Input
            {...register("busNumber")}
            disabled={mode === "edit"}
            placeholder="e.g. BUS-001"
            className="bg-slate-50 border-slate-200 uppercase font-mono text-xs"
          />
          {errors.busNumber && (
            <p className="text-[11px] font-medium text-red-500">{errors.busNumber.message as string}</p>
          )}
        </div>

        {/* Registration Number */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">
            Registration Number <span className="text-red-500">*</span>
          </label>
          <Input
            {...register("registrationNumber")}
            disabled={mode === "edit"}
            placeholder="e.g. OD-02-AB-1234"
            className="bg-slate-50 border-slate-200 uppercase font-mono text-xs"
          />
          {errors.registrationNumber && (
            <p className="text-[11px] font-medium text-red-500">{errors.registrationNumber.message as string}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Bus Name */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Bus Name (Optional)</label>
          <Input
            {...register("name")}
            placeholder="e.g. Royal Express Sleeper"
            className="bg-slate-50 border-slate-200"
          />
        </div>

        {/* Bus Type */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">
            Bus Type <span className="text-red-500">*</span>
          </label>
          <Select
            {...register("type")}
            options={[
              { value: "SEATER", label: "Seater" },
              { value: "SEMI_SLEEPER", label: "Semi-Sleeper" },
              { value: "SLEEPER", label: "Sleeper" },
            ]}
            className="bg-slate-50 border-slate-200"
          />
          {errors.type && (
            <p className="text-[11px] font-medium text-red-500">{errors.type.message as string}</p>
          )}
        </div>
      </div>

      {/* Description & Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2 space-y-1">
          <label className="text-xs font-bold text-slate-700">Description</label>
          <Input
            {...register("description")}
            placeholder="e.g. AC Volvo multi-axle sleeper coach"
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
              { value: "MAINTENANCE", label: "Maintenance" },
              { value: "RETIRED", label: "Retired" },
            ]}
            className="bg-slate-50 border-slate-200"
          />
        </div>
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
          {mode === "edit" ? "Save Bus Changes" : "Create Bus"}
        </Button>
      </div>
    </form>
  );
}
