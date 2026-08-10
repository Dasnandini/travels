"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { GoogleLoginButton } from "@/components/auth/google-login-button";
import { Bus, Ticket, ShieldCheck, Headphones, AlertCircle } from "lucide-react";

export function LoginForm() {
  const [globalError, setGlobalError] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 font-sans selection:bg-red-100 selection:text-red-900">
      
      {/* LEFT COLUMN: LIGHT SIDE WITH BRANDING & SCENIC ROAD BUS */}
      <div className="lg:col-span-6 bg-slate-50 p-8 lg:p-14 flex flex-col justify-between relative overflow-hidden min-h-[500px]">
        
        {/* Top Branding Logo */}
        <Link href="/" className="flex flex-col group cursor-pointer z-10 w-fit">
          <span className="text-3xl font-extrabold tracking-tight text-[#D32F2F] font-serif italic">
            Muskan
          </span>
          <span className="text-[10px] font-bold tracking-[0.28em] text-[#D32F2F] uppercase -mt-1.5 pl-0.5">
            Travels
          </span>
        </Link>

        {/* Middle Content: Heading & 3 Feature Items */}
        <div className="space-y-8 z-10 my-auto py-8">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Welcome <span className="text-[#D32F2F]">Back!</span>
            </h1>
            <p className="text-slate-600 font-medium text-base mt-2 max-w-sm">
              Login to continue your journey with Muskan Travels
            </p>
          </div>

          {/* 3 Features */}
          <div className="space-y-6 max-w-md">
            
            {/* Feature 1 */}
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-red-50 text-[#D32F2F] flex items-center justify-center shrink-0 shadow-2xs">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Easy Bookings</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Book your tickets in just a few clicks.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-red-50 text-[#D32F2F] flex items-center justify-center shrink-0 shadow-2xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Secure & Safe</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Your payments and data are always protected with us.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-red-50 text-[#D32F2F] flex items-center justify-center shrink-0 shadow-2xs">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">24/7 Support</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  We&apos;re here to help you anytime, anywhere.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Scenic Bus Banner Image */}
    {/* <div className="relative w-full h-44 sm:h-56 rounded-3xl overflow-hidden mt-6 shadow-md border-2 border-white">
          <Image
            src="/images/hero-bus.png"
            alt="Muskan Travels Luxury Bus"
            fill
            className="object-cover object-bottom"
          />
        </div> */}

      </div>

      {/* RIGHT COLUMN: DARK NAVY SIDE WITH CENTERED CARD */}
      <div className="lg:col-span-6 bg-[#0B132A] flex flex-col justify-between items-center p-6 sm:p-12 relative min-h-screen">
        
        {/* Centered Login Card */}
        <div className="my-auto w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6 border border-slate-100/10">
          
          {/* Red Bus Icon Circle */}
          <div className="w-16 h-16 rounded-full bg-[#FFF0F2] text-[#D32F2F] mx-auto flex items-center justify-center shadow-2xs">
            <Bus className="w-8 h-8 text-[#D32F2F]" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Login to Your Account
            </h2>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Access your bookings and manage your trips
            </p>
          </div>

          {/* Divider line */}
          <div className="w-full border-t border-slate-100 my-4" />

          {/* Global Error message */}
          {globalError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium text-left">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{globalError}</span>
            </div>
          )}

          {/* Google OAuth Login Button */}
          <div className="pt-2">
            <GoogleLoginButton
              onError={(msg) => setGlobalError(msg)}
              onStart={() => setGlobalError(null)}
            />
          </div>

        </div>

        {/* Footer Text */}
        <div className="py-4 text-xs font-medium text-slate-400/80 text-center">
          © {new Date().getFullYear()} Muskan Travels. All rights reserved.
        </div>

      </div>

    </div>
  );
}
