"use client";

import Image from "next/image";
import { ShieldCheck, Armchair, Tag } from "lucide-react";
import { BusSearchWidget } from "./BusSearchWidget";

export function HeroSection() {
  return (
    <section className="relative pt-8 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Content (Headline + Bus Image) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
          
          {/* Left Column: Heading & Feature Pills */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                Your Journey, <br />
                <span className="text-[#D32F2F]">Our Priority</span>
              </h1>
              <p className="mt-4 text-base sm:text-lg text-slate-600 font-medium max-w-lg leading-relaxed">
                Safe, comfortable and reliable bus services across India.
              </p>
            </div>

            {/* 3 Feature Badges */}
            <div className="grid grid-cols-3 gap-3 max-w-md pt-2">
              <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-red-50/60 border border-red-100/60">
                <div className="w-10 h-10 rounded-full bg-white text-[#D32F2F] shadow-xs flex items-center justify-center mb-2">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800 leading-tight">
                  Safe & Secure <br /> Journeys
                </span>
              </div>

              <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-red-50/60 border border-red-100/60">
                <div className="w-10 h-10 rounded-full bg-white text-[#D32F2F] shadow-xs flex items-center justify-center mb-2">
                  <Armchair className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800 leading-tight">
                  Comfortable <br /> Seating
                </span>
              </div>

              <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-red-50/60 border border-red-100/60">
                <div className="w-10 h-10 rounded-full bg-white text-[#D32F2F] shadow-xs flex items-center justify-center mb-2">
                  <Tag className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800 leading-tight">
                  Best Price <br /> Guaranteed
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Bus Image */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full h-[280px] sm:h-[360px] lg:h-[400px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src="/images/hero-bus.png"
                alt="Muskan Travels Luxury Bus"
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
          </div>

        </div>

        {/* Floating Bus Search Form Widget */}
        <BusSearchWidget />

      </div>
    </section>
  );
}
