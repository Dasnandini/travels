"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CommandInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onValueChange?: (value: string) => void;
}

export const CommandInput = React.forwardRef<HTMLInputElement, CommandInputProps>(
  ({ className, onValueChange, onChange, ...props }, ref) => {
    return (
      <div className="flex items-center px-3 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
        <Search className="h-4 w-4 shrink-0 text-slate-400 mr-2" />
        <input
          ref={ref}
          className={cn(
            "flex h-9 w-full rounded-md bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 font-medium",
            className
          )}
          onChange={(e) => {
            if (onChange) onChange(e);
            if (onValueChange) onValueChange(e.target.value);
          }}
          {...props}
        />
      </div>
    );
  }
);
CommandInput.displayName = "CommandInput";

export function CommandList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("max-h-60 overflow-y-auto p-1 text-xs space-y-0.5 bg-white", className)}>
      {children}
    </div>
  );
}

export function CommandEmpty({ children }: { children: React.ReactNode }) {
  return <div className="py-6 text-center text-xs text-slate-400">{children}</div>;
}

export function CommandItem({
  children,
  onSelect,
  active,
  className,
}: {
  children: React.ReactNode;
  onSelect?: () => void;
  active?: boolean;
  className?: string;
}) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors font-medium",
        active && "bg-[#002B66] text-white font-bold",
        className
      )}
    >
      {children}
    </div>
  );
}
