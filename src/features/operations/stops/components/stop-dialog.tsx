"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { StopForm } from "./stop-form";
import { StopItem, StopFormValues } from "../types/stop.types";

interface StopDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<StopItem>;
  onSubmit: (values: StopFormValues) => void;
  isLoading?: boolean;
}

export function StopDialog({
  open,
  onOpenChange,
  initialValues,
  onSubmit,
  isLoading,
}: StopDialogProps) {
  const isEditing = Boolean(initialValues?.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Bus Stop" : "Add Bus Stop"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update details for this boarding point location."
              : "Search location via Google Places or manually enter bus stop details."}
          </DialogDescription>
        </DialogHeader>

        <StopForm
          initialValues={initialValues}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
