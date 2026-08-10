import * as React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export function FloatingFooter() {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-900/40 backdrop-blur-md mt-auto z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400 text-sm">
        {/* Left Side Brand */}
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-semibold text-slate-200">Lorem Ipsum</span>
          <span className="text-slate-600">|</span>
          <span className="text-xs text-slate-500">
            © {new Date().getFullYear()} Lorem Ipsum. All rights reserved.
          </span>
        </div>

        {/* Right Side Links */}
        <div className="flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-400">
          <Link href="#features" className="hover:text-slate-200 transition-colors">
            Lorem
          </Link>
          <Link href="#about" className="hover:text-slate-200 transition-colors">
            Ipsum
          </Link>
          <Link href="#privacy" className="hover:text-slate-200 transition-colors">
            Privacy
          </Link>
          <Link href="#terms" className="hover:text-slate-200 transition-colors">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
