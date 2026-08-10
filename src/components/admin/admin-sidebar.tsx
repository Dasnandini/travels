"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MapPin,
  Route as RouteIcon,
  Bus,
  Calendar,
  Ticket,
  Users,
  BarChart3,
  ShieldAlert,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { ClientLogoutButton } from "@/components/auth/client-logout-button";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  exact?: boolean;
}

interface NavSection {
  header: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    header: "Main",
    items: [
      {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
        exact: true,
      },
    ],
  },
  {
    header: "Operations",
    items: [
      {
        title: "Stops & Boarding",
        href: "/admin/dashboard/operations/stops",
        icon: MapPin,
      },
      {
        title: "Routes & Journeys",
        href: "/admin/dashboard/operations/routes",
        icon: RouteIcon,
      },
      {
        title: "Buses & Fleet",
        href: "/admin/dashboard/operations/buses",
        icon: Bus,
      },
      {
        title: "Schedules & Services",
        href: "/admin/dashboard/operations/services",
        icon: Calendar,
      },
    ],
  },
  {
    header: "Reservations",
    items: [
      {
        title: "Bookings & Tickets",
        href: "/admin/dashboard/bookings",
        icon: Ticket,
        badge: "Soon",
      },
      {
        title: "Passengers",
        href: "/admin/dashboard/passengers",
        icon: Users,
        badge: "Soon",
      },
    ],
  },
  {
    header: "System",
    items: [
      {
        title: "Analytics & Reports",
        href: "/admin/dashboard/reports",
        icon: BarChart3,
        badge: "Soon",
      },
      {
        title: "Security & Audit",
        href: "/admin/dashboard",
        icon: ShieldAlert,
      },
      {
        title: "Settings",
        href: "/admin/dashboard/settings",
        icon: Settings,
        badge: "Soon",
      },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-3 left-3 z-50">
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-md hover:bg-slate-50 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Brand Header */}
          <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-100 shrink-0">
            <div className="h-9 w-9 rounded-xl bg-[#002B66] flex items-center justify-center text-white font-bold shadow-md shadow-blue-950/20">
              <Bus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-none">BusTravel</h2>
              <span className="text-[11px] font-semibold text-blue-900">Admin Operations</span>
            </div>
          </div>

          {/* Navigation Sections */}
          <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
            {navSections.map((section, idx) => (
              <div key={idx} className="space-y-1">
                <h3 className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {section.header}
                </h3>
                <nav className="space-y-0.5">
                  {section.items.map((item) => {
                    const isActive = item.exact
                      ? pathname === item.href
                      : pathname.startsWith(item.href);

                    const Icon = item.icon;

                    if (item.badge === "Soon") {
                      return (
                        <div
                          key={item.title}
                          className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-400 opacity-60 text-xs font-medium cursor-not-allowed"
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </div>
                          <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                            Soon
                          </span>
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={item.title}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? "bg-[#002B66] text-white shadow-sm shadow-blue-950/20"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                          <span>{item.title}</span>
                        </div>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>

          {/* Footer User & Logout */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/50 shrink-0">
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-slate-200/80">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-900 font-bold flex items-center justify-center text-xs shrink-0">
                  A
                </div>
                <div className="truncate">
                  <span className="text-xs font-bold text-slate-900 block truncate">Administrator</span>
                  <span className="text-[10px] text-slate-500 block truncate">System Authority</span>
                </div>
              </div>
              <ClientLogoutButton />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
