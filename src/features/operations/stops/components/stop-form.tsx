"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { stopFormSchema, StopFormSchemaValues } from "../schemas/stop-form.schema";
import { StopLocationSearch } from "./stop-location-search";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { StopItem, PlaceSearchItem } from "../types/stop.types";

interface StopFormProps {
  initialValues?: Partial<StopItem>;
  onSubmit: (values: StopFormSchemaValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function StopForm({ initialValues, onSubmit, onCancel, isLoading }: StopFormProps) {
  const [selectedPlaceName, setSelectedPlaceName] = useState<string | undefined>(
    initialValues?.googlePlaceId ? initialValues.name : undefined
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(stopFormSchema),
    defaultValues: {
      name: initialValues?.name || "",
      city: initialValues?.city || "",
      state: initialValues?.state || "",
      country: initialValues?.country || "India",
      address: initialValues?.address || "",
      landmark: initialValues?.landmark || "",
      googlePlaceId: initialValues?.googlePlaceId || "",
      latitude: initialValues?.latitude ?? undefined,
      longitude: initialValues?.longitude ?? undefined,
      status: (initialValues?.status as "ACTIVE" | "INACTIVE") || "ACTIVE",
    },
  });

  const handlePlaceSelect = (place: PlaceSearchItem) => {
    setSelectedPlaceName(place.name);

    if (place.name) setValue("name", place.name, { shouldValidate: true });
    if (place.address) {
      setValue("address", place.address);
      const parts = place.address.split(",").map((p) => p.trim());
      if (parts.length >= 2) {
        setValue("city", parts[0], { shouldValidate: true });
        if (parts.length >= 3) {
          setValue("state", parts[1], { shouldValidate: true });
        }
      }
    }
    if (place.latitude !== null && place.latitude !== undefined) setValue("latitude", place.latitude);
    if (place.longitude !== null && place.longitude !== undefined) setValue("longitude", place.longitude);
    if (place.placeId) setValue("googlePlaceId", place.placeId);
  };

  const handleClearPlace = () => {
    setSelectedPlaceName(undefined);
    setValue("googlePlaceId", "");
  };

  const onFormSubmit = (data: any) => {
    onSubmit(data as StopFormSchemaValues);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {/* Location Search & Map Picker */}
      <StopLocationSearch
        onSelectPlace={handlePlaceSelect}
        selectedPlaceName={selectedPlaceName}
        onClear={handleClearPlace}
        initialLat={initialValues?.latitude}
        initialLng={initialValues?.longitude}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Stop Name */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">
            Stop Name <span className="text-red-500">*</span>
          </label>
          <Input
            {...register("name")}
            placeholder="e.g. Baramunda Bus Stand"
            className="bg-slate-50 border-slate-200"
          />
          {errors.name && (
            <p className="text-[11px] font-medium text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* City */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">
            City <span className="text-red-500">*</span>
          </label>
          <Input
            {...register("city")}
            placeholder="e.g. Bhubaneswar"
            className="bg-slate-50 border-slate-200"
          />
          {errors.city && (
            <p className="text-[11px] font-medium text-red-500">{errors.city.message}</p>
          )}
        </div>

        {/* State */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">
            State <span className="text-red-500">*</span>
          </label>
          <Input
            {...register("state")}
            placeholder="e.g. Odisha"
            className="bg-slate-50 border-slate-200"
          />
          {errors.state && (
            <p className="text-[11px] font-medium text-red-500">{errors.state.message}</p>
          )}
        </div>

        {/* Country */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Country</label>
          <Input
            {...register("country")}
            placeholder="India"
            className="bg-slate-50 border-slate-200"
          />
        </div>
      </div>

      {/* Address */}
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-700">Full Address</label>
        <Input
          {...register("address")}
          placeholder="e.g. Baramunda, NH 16, Bhubaneswar"
          className="bg-slate-50 border-slate-200"
        />
      </div>

      {/* Landmark */}
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-700">Landmark</label>
        <Input
          {...register("landmark")}
          placeholder="e.g. Near ISBT / Main Gate"
          className="bg-slate-50 border-slate-200"
        />
      </div>

      {/* Coordinates & Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Latitude */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Latitude</label>
          <Input
            type="number"
            step="any"
            {...register("latitude", { valueAsNumber: true })}
            placeholder="e.g. 20.2961"
            className="bg-slate-50 border-slate-200 font-mono text-xs"
          />
          {errors.latitude && (
            <p className="text-[11px] font-medium text-red-500">{errors.latitude.message}</p>
          )}
        </div>

        {/* Longitude */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Longitude</label>
          <Input
            type="number"
            step="any"
            {...register("longitude", { valueAsNumber: true })}
            placeholder="e.g. 85.8245"
            className="bg-slate-50 border-slate-200 font-mono text-xs"
          />
          {errors.longitude && (
            <p className="text-[11px] font-medium text-red-500">{errors.longitude.message}</p>
          )}
        </div>

        {/* Status */}
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
          {initialValues?.id ? "Save Changes" : "Save Stop"}
        </Button>
      </div>
    </form>
  );
}
