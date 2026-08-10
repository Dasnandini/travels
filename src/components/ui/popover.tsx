"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface PopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  trigger: React.ReactNode;
  className?: string;
  align?: "left" | "right";
}

export function Popover({
  open,
  onOpenChange,
  children,
  trigger,
  className,
  align = "left",
}: PopoverProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onOpenChange(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onOpenChange]);

  return (
    <div className="relative w-full" ref={containerRef}>
      <div onClick={() => onOpenChange(!open)}>{trigger}</div>
      {open && (
        <div
          className={cn(
            "absolute z-50 mt-1.5 w-full min-w-[240px] rounded-xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in-0 zoom-in-95 duration-150 text-slate-900",
            align === "right" ? "right-0" : "left-0",
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
