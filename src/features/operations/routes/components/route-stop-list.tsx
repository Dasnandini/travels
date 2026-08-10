"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";
import { StopItem } from "@/features/operations/stops/types/stop.types";

interface RouteStopListProps {
  stops: StopItem[];
  onReorder: (newStops: StopItem[]) => void;
  onRemove: (index: number) => void;
}

function SortableStopItem({
  stop,
  index,
  onRemove,
}: {
  stop: StopItem;
  index: number;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: stop.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-3 rounded-xl border bg-white transition-shadow ${
        isDragging
          ? "border-blue-900 shadow-xl z-50 opacity-90 scale-[1.02]"
          : "border-slate-200/80 hover:border-slate-300"
      }`}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-grab active:cursor-grabbing touch-none"
          title="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <div className="h-6 w-6 rounded-md bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-700 shrink-0 font-mono">
          {index + 1}
        </div>

        <div className="truncate">
          <span className="text-xs font-bold text-slate-900 block truncate">{stop.name}</span>
          <span className="text-[11px] text-slate-500">
            {stop.city}, {stop.state}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
        title="Remove stop"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function RouteStopList({ stops, onReorder, onRemove }: RouteStopListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = stops.findIndex((s) => s.id === active.id);
      const newIndex = stops.findIndex((s) => s.id === over.id);
      onReorder(arrayMove(stops, oldIndex, newIndex));
    }
  };

  if (stops.length === 0) {
    return (
      <div className="p-6 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400 font-medium">
        No intermediate stops added yet. Click "+ Add Intermediate Stop" below.
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={stops.map((s) => s.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {stops.map((stop, index) => (
            <SortableStopItem
              key={stop.id}
              stop={stop}
              index={index}
              onRemove={() => onRemove(index)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
