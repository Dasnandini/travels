"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, HeartHandshake, Users } from "lucide-react";

export function SpecialOffers() {
  return (
    <section id="offers" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-6">
          Special Offers for You
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Card 1: Festive Season Bonanza (Spans 6 cols) */}
          <div className="md:col-span-6 bg-gradient-to-r from-[#FFF2F2] via-[#FFECEB] to-[#FEF3C7] rounded-3xl p-6 sm:p-8 border border-red-100 relative overflow-hidden flex flex-col justify-between min-h-[220px] shadow-xs">
            <div className="relative z-10 max-w-xs space-y-2">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Festive Season Bonanza!
              </h3>
              <p className="text-sm font-medium text-slate-700">
                Get up to <strong className="font-bold text-[#D32F2F]">₹250 off</strong> on your bus tickets
              </p>
              <div className="pt-2">
                <span className="inline-block bg-white/90 backdrop-blur-xs border border-red-200 text-xs font-mono font-bold px-3 py-1.5 rounded-lg text-slate-800 shadow-2xs">
                  Use code: <span className="text-[#D32F2F]">FESTIVE250</span>
                </span>
              </div>
            </div>

            {/* Illustration Background */}
            <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-95 pointer-events-none">
              <Image
                src="/images/festive-offer.png"
                alt="Festive Season Offer"
                fill
                className="object-contain object-right-bottom"
              />
            </div>

            {/* Circular Action Arrow */}
            <div className="absolute right-6 bottom-6 z-20">
              <button className="w-10 h-10 rounded-full bg-white text-slate-900 shadow-md flex items-center justify-center hover:scale-110 hover:bg-[#D32F2F] hover:text-white transition-all cursor-pointer">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Card 2: Save More (Spans 3 cols) */}
          <div className="md:col-span-3 bg-[#F0FDF4] border border-emerald-100 rounded-3xl p-6 flex flex-col justify-between min-h-[220px] shadow-xs">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#10B981] flex items-center justify-center mb-4">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Save More</h3>
              <p className="text-sm text-slate-600 font-medium">
                Exclusive deals on round trip bookings
              </p>
            </div>
            
            <Link
              href="#book-roundtrip"
              className="text-[#10B981] font-bold text-sm flex items-center gap-1.5 hover:gap-2.5 transition-all mt-4"
            >
              <span>Book Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 3: Group Booking (Spans 3 cols) */}
          <div className="md:col-span-3 bg-[#F0F9FF] border border-sky-100 rounded-3xl p-6 flex flex-col justify-between min-h-[220px] shadow-xs">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-sky-100 text-[#0284C7] flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Group Booking</h3>
              <p className="text-sm text-slate-600 font-medium">
                Travel together & save more
              </p>
            </div>

            <Link
              href="#enquire"
              className="text-[#0284C7] font-bold text-sm flex items-center gap-1.5 hover:gap-2.5 transition-all mt-4"
            >
              <span>Enquire Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
