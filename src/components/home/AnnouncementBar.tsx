"use client";

import { useState } from "react";
import { X, Tag } from "lucide-react";

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-[#FFF0F2] border-b border-red-100 text-slate-800 text-xs sm:text-sm py-2 px-4 flex items-center justify-between z-50">
      <div className="flex-1 flex items-center justify-center gap-2 flex-wrap text-center">
        <span className="inline-flex items-center justify-center bg-[#D32F2F] text-white p-1 rounded-md text-xs">
          <Tag className="w-3.5 h-3.5" />
        </span>
        <span className="font-medium">
          Get <strong className="font-bold text-[#D32F2F]">10% Discount</strong> on your first booking! Use code:{" "}
          <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-red-200 text-[#D32F2F]">
            MUSKAN10
          </span>
        </span>
        <button className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs font-semibold px-3 py-1 rounded-md transition-colors shadow-sm ml-2 cursor-pointer">
          Book Now
        </button>
      </div>

      <button
        onClick={() => setIsVisible(false)}
        className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
        aria-label="Close discount bar"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
