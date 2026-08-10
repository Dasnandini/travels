"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, Menu, X, User, ChevronDown, LogOut, ShieldAlert, Bus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";

export interface HeaderUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
}

export function FloatingHeader({ user }: { user?: HeaderUser | null }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("[Logout Error]:", error);
      setIsLoggingOut(false);
    }
  };

  const displayName = user?.name || user?.email?.split("@")[0] || "Profile";
  const displayInitial = displayName.charAt(0).toUpperCase();

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-6xl">
      <div className="backdrop-blur-xl bg-[#f5e2d9] shadow-2xl rounded-2xl px-5 py-3.5 flex items-center justify-between transition-all">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-10 w-10 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/25  group-hover:scale-105 transition-transform">
            {/* <Bus className="h-5 w-5" /> */}
          </div>
          {/* <span className="font-bold text-lg text-white tracking-tight">
            Lorem<span className="text-blue-400">Ipsum</span>
          </span> */}
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-800">
          <Link href="#features" className="hover:text-slate-500 transition-colors">
            Lorem
          </Link>
          <Link href="#about" className="hover:text-slate-500 transition-colors">
            Lorem
          </Link>
          <Link href="#stats" className="hover:text-slate-500 transition-colors">
            Lorem
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5    text-slate-200 transition-all text-sm font-medium  focus:outline-none "
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={displayName}
                    className="h-7 w-7 rounded-lg object-cover ring-1 ring-white/20"
                  />
                ) : (
                  <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold ring-1 ring-white/20">
                    {displayInitial}
                  </div>
                )}
                {/* <span className="max-w-[120px] truncate font-medium text-slate-200">
                  {displayName}
                </span> */}
                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-background p-2 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in-50 zoom-in-95">
                  <div className="px-3 py-2.5 rounded-xl bg-background mb-1 ">
                    <p className="text-xs font-semibold text-foreground truncate">{displayName}</p>
                    {user.email && (
                      <p className="text-[11px] text-foreground truncate mt-0.5">{user.email}</p>
                    )}
                    {/* <div className="mt-1.5 flex items-center gap-1.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md  text-foreground">
                        {user.role || "USER"}
                      </span>
                    </div> */}
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
                  >
                    <User className="h-4 w-4 text-blue-400" />
                    <span className="text-sm font-medium text-foreground">Visit Profile</span>
                  </Link>

                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
                    >
                      <ShieldAlert className="h-4 w-4 text-indigo-400" />
                      <span>Admin Portal</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    disabled={isLoggingOut}
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-xl transition-colors text-left"
                  >
                    <LogOut className="h-4 w-4 text-red-400" />
                    <span>{isLoggingOut ? "Signing Out..." : "Logout"}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <Button
                variant="default"
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-md shadow-blue-600/20 rounded-xl"
              >
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-4 rounded-2xl backdrop-blur-xl bg-slate-900/95 border border-slate-800 shadow-2xl flex flex-col gap-3">
          <Link
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-xl transition-colors"
          >
            Lorem
          </Link>
          <Link
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-xl transition-colors"
          >
            Ipsum
          </Link>
          <Link
            href="#stats"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-xl transition-colors"
          >
            Dolor
          </Link>
          <Link
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-xl transition-colors"
          >
            Sit Amet
          </Link>
          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            {user ? (
              <>
                <div className="px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-800 flex items-center gap-3">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={displayName}
                      className="h-8 w-8 rounded-lg object-cover ring-1 ring-white/20"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                      {displayInitial}
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <p className="text-xs font-semibold text-slate-200 truncate">{displayName}</p>
                    {user.email && (
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    )}
                  </div>
                </div>

                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
                >
                  <User className="h-4 w-4 text-blue-400" />
                  <span>Visit Profile</span>
                </Link>

                {user.role === "ADMIN" && (
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
                  >
                    <ShieldAlert className="h-4 w-4 text-indigo-400" />
                    <span>Admin Portal</span>
                  </Link>
                )}

                <button
                  type="button"
                  disabled={isLoggingOut}
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-xl transition-colors text-left"
                >
                  <LogOut className="h-4 w-4 text-red-400" />
                  <span>{isLoggingOut ? "Signing Out..." : "Logout"}</span>
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
