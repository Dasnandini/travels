import * as React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-xl cursor-pointer";

    const variants = {
      default: "bg-[#002B66] hover:bg-[#001f4d] text-white shadow-sm shadow-blue-950/20 active:scale-[0.98]",
      secondary: "bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200",
      outline: "border border-slate-200 bg-white hover:bg-slate-50 text-slate-800",
      ghost: "hover:bg-slate-100 text-slate-700",
      destructive: "bg-red-600 hover:bg-red-700 text-white shadow-sm",
    };

    const sizes = {
      default: "h-10 px-4 py-2 text-xs",
      sm: "h-8 px-3 text-xs rounded-lg",
      lg: "h-12 px-6 text-sm rounded-xl",
      icon: "h-9 w-9 p-2",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Please wait...</span>
          </div>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = "Button";
