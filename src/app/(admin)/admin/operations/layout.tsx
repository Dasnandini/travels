"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldAlert, MapPin, Route as RouteIcon, ArrowLeft } from "lucide-react";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/toaster";
import { ClientLogoutButton } from "@/components/auth/client-logout-button";

export default function AdminOperationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isStopsActive = pathname.startsWith("/admin/operations/stops");
  const isRoutesActive = pathname.startsWith("/admin/operations/routes");

  return (
    <QueryProvider>
      <Toaster />
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        {/* Top Operations Header */}
        <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors p-1.5 rounded-lg hover:bg-slate-800/60"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-indigo-600/90 flex items-center justify-center text-white shadow-sm ring-1 ring-white/10">
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <div>
                  <h1 className="text-sm font-bold text-slate-100 leading-none">
                    Operations Portal
                  </h1>
                  <span className="text-[11px] text-slate-400">
                    Stops & Route Management
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ClientLogoutButton />
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/60">
            <nav className="flex items-center gap-2 pt-2">
              <Link
                href="/admin/operations/stops"
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${
                  isStopsActive
                    ? "border-blue-500 text-blue-400 bg-slate-800/40"
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/20"
                }`}
              >
                <MapPin className="h-4 w-4" />
                <span>Stops & Boarding Points</span>
              </Link>

              <Link
                href="/admin/operations/routes"
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${
                  isRoutesActive
                    ? "border-blue-500 text-blue-400 bg-slate-800/40"
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/20"
                }`}
              >
                <RouteIcon className="h-4 w-4" />
                <span>Routes & Journeys</span>
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </div>
    </QueryProvider>
  );
}
