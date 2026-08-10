"use client";

import Link from "next/link";
import { Bus, Phone, Mail, MapPin, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex flex-col group cursor-pointer">
              <span className="text-3xl font-extrabold tracking-tight text-white font-serif italic">
                Muskan
              </span>
              <span className="text-[10px] font-bold tracking-[0.28em] text-red-500 uppercase -mt-1.5 pl-0.5">
                Travels
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              India&apos;s trusted bus reservation platform providing safe, comfortable, and punctual bus journeys across major cities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Bus Tickets</Link>
              </li>
              <li>
                <Link href="#offers" className="hover:text-white transition-colors">Offers & Deals</Link>
              </li>
              <li>
                <Link href="#about" className="hover:text-white transition-colors">About Muskan Travels</Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-white transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Top Routes */}
          <div>
            <h4 className="text-white font-bold text-base mb-4">Top Bus Routes</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>Bhubaneswar to Kolkata</li>
              <li>Bhubaneswar to Cuttack</li>
              <li>Cuttack to Kolkata</li>
              <li>Jajpur to Balasore</li>
              <li>Kolkata to Bhubaneswar</li>
            </ul>
          </div>

          {/* Contact Support */}
          <div>
            <h4 className="text-white font-bold text-base mb-4">Customer Support</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <span>+91 1800-123-4567</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-red-500 shrink-0" />
                <span>support@muskantravels.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                <span>Bhubaneswar, Odisha, India</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Muskan Travels. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Designed with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for comfortable bus travel
          </p>
        </div>
      </div>
    </footer>
  );
}
