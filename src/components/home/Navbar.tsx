"use client";

import Link from "next/link";
import { Bus, Sparkles, ListOrdered, HelpCircle, User, LogOut, Shield } from "lucide-react";

interface NavbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  } | null;
}

export function Navbar({ user }: NavbarProps) {
  return (
    <header className="w-full bg-white border-b border-slate-100 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex flex-col group cursor-pointer">
          <span className="text-3xl font-extrabold tracking-tight text-[#D32F2F] font-serif italic">
            Muskan
          </span>
          <span className="text-[10px] font-bold tracking-[0.28em] text-[#D32F2F] uppercase -mt-1.5 pl-0.5">
            Travels
          </span>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-[#D32F2F] font-bold text-sm py-2 relative border-b-2 border-[#D32F2F]"
          >
            <Bus className="w-4 h-4" />
            <span>Bus Tickets</span>
          </Link>

          <Link
            href="#offers"
            className="flex items-center gap-2 text-slate-600 hover:text-[#D32F2F] font-medium text-sm py-2 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Offers</span>
          </Link>

          <Link
            href="#about"
            className="text-slate-600 hover:text-[#D32F2F] font-medium text-sm py-2 transition-colors"
          >
            About Us
          </Link>

          <Link
            href="#contact"
            className="text-slate-600 hover:text-[#D32F2F] font-medium text-sm py-2 transition-colors"
          >
            Contact
          </Link>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* <Link
            href="/my-bookings"
            className="hidden sm:flex items-center gap-1.5 text-slate-700 hover:text-[#D32F2F] font-medium text-sm transition-colors"
          >
            <ListOrdered className="w-4 h-4 text-slate-500" />
            <span>My Bookings</span>
          </Link> */}

          {/* <Link
            href="#help"
            className="hidden sm:flex items-center gap-1.5 text-slate-700 hover:text-[#D32F2F] font-medium text-sm transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span>Help</span>
          </Link> */}

          {user ? (
            <div className="flex items-center gap-3">
              {user.role === "ADMIN" && (
                <Link
                  href="/admin/dashboard"
                  className="bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-slate-800 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </Link>
              )}
              <Link
                href="/dashboard"
                className="flex items-center gap-2 border border-slate-200 rounded-full px-3 py-1.5 hover:bg-slate-50 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-[#D32F2F] text-white flex items-center justify-center text-xs font-bold">
                  {user.name?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="text-sm font-semibold text-slate-800 max-w-[100px] truncate">
                  {user.name || "Account"}
                </span>
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="border border-[#D32F2F] text-[#D32F2F] hover:bg-[#FFF0F2] font-semibold text-sm rounded-full px-4 py-1.5 flex items-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
