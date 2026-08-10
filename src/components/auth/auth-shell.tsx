import * as React from "react";

export interface AuthShellProps {
  children: React.ReactNode;
}

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="min-h-screen w-full bg-[#0B132A] text-slate-100 selection:bg-red-100 selection:text-red-900">
      {children}
    </div>
  );
}
