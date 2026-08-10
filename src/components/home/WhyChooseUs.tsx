"use client";

import { Clock, MapPin, PhoneCall, RotateCcw } from "lucide-react";

export function WhyChooseUs() {
  const features = [
    {
      icon: Clock,
      title: "On-time Guarantee",
      description: "We value your time",
    },
    {
      icon: MapPin,
      title: "Live Tracking",
      description: "Track your bus live",
    },
    {
      icon: PhoneCall,
      title: "24x7 Support",
      description: "Always here to help",
    },
    {
      icon: RotateCcw,
      title: "Easy Cancellation",
      description: "Hassle-free process",
    },
  ];

  return (
    <section className="py-12 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-8">
          Why Choose Muskan Travels?
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-red-50/40 hover:border-red-100 transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#D32F2F] flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
