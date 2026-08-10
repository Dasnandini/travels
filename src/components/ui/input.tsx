import * as React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        <input
          type={type}
          className={twMerge(
            clsx(
              "flex h-11 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm",
              error && "border-red-500 focus:ring-red-500",
              className
            )
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-xs text-red-500 font-medium pl-1">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
