"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DropdownMenuProps {
  children: React.ReactNode;
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  return <div className="relative inline-block text-left">{children}</div>;
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export function DropdownMenuTrigger({ children }: DropdownMenuTriggerProps) {
  return <>{children}</>;
}

interface DropdownMenuContentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  align?: "left" | "right";
  children: React.ReactNode;
  className?: string;
}

export function DropdownMenuContent({
  open,
  onOpenChange,
  align = "right",
  children,
  className,
}: DropdownMenuContentProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onOpenChange(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 mt-1.5 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl animate-in fade-in-0 zoom-in-95 duration-150 text-slate-800 text-xs font-medium space-y-0.5",
        align === "right" ? "right-0" : "left-0",
        className
      )}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({
  children,
  onClick,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "destructive";
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors cursor-pointer text-xs font-semibold",
        variant === "destructive"
          ? "text-red-600 hover:bg-red-50"
          : "text-slate-700 hover:text-slate-900 hover:bg-slate-100",
        className
      )}
    >
      {children}
    </button>
  );
}

export function DropdownMenuSeparator() {
  return <div className="my-1 border-t border-slate-100" />;
}
