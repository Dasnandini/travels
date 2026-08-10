"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      theme="light"
      position="top-right"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-slate-900 group-[.toaster]:border-slate-200 group-[.toaster]:shadow-xl rounded-xl font-sans text-xs font-semibold",
          description: "group-[.toast]:text-slate-500 text-xs font-normal",
          actionButton:
            "group-[.toast]:bg-[#002B66] group-[.toast]:text-white font-semibold text-xs rounded-lg px-3 py-1",
          cancelButton:
            "group-[.toast]:bg-slate-100 group-[.toast]:text-slate-700 font-semibold text-xs rounded-lg px-3 py-1",
        },
      }}
    />
  );
}
