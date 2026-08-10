"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bus,
  Sparkles,
  Info,
  PhoneCall,
  ListOrdered,
  HelpCircle,
  ChevronDown,
  User as UserIcon,
  CreditCard,
  Ticket,
  Pencil,
  Plus,
  ArrowRight,
  Calendar,
  Clock,
  UserCheck,
  CheckCircle2,
  X,
  Download,
  Printer,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import { ClientLogoutButton } from "@/components/auth/client-logout-button";

interface UserProfileViewProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: string;
  };
}

interface BookingRecord {
  bookingId: string;
  from: string;
  fromDetail: string;
  to: string;
  toDetail: string;
  date: string;
  time: string;
  passengersCount: number;
  seats: string;
  busNumber: string;
  busType: string;
  fare: string;
  status: string;
}

export function UserProfileView({ user }: UserProfileViewProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "payment" | "history">("overview");

  // User details state (for edit mode)
  const [fullName, setFullName] = useState(user.name || "");
  const [email] = useState(user.email || "");
  const [phone, setPhone] = useState("");

  // Edit Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(fullName);
  const [tempPhone, setTempPhone] = useState(phone);

  // Ticket Download Modal State
  const [selectedTicket, setSelectedTicket] = useState<BookingRecord | null>(null);

  // Sample bookings list
  const bookings: BookingRecord[] = [
    {
      bookingId: "MT1234567890",
      from: "Bhubaneswar",
      fromDetail: "Bhubaneswar Central Bus Terminal, Baramunda",
      to: "Puri",
      toDetail: "Puri Bus Stand, Grand Road",
      date: "10 Aug, 2026",
      time: "08:30 AM",
      passengersCount: 1,
      seats: "A1",
      busNumber: "BUS-001",
      busType: "AC Sleeper 2+1",
      fare: "₹ 450",
      status: "Confirmed",
    },
    {
      bookingId: "MT1234567889",
      from: "Puri",
      fromDetail: "Puri Bus Stand, Grand Road",
      to: "Cuttack",
      toDetail: "Cuttack Badambadi Bus Terminal",
      date: "15 Aug, 2026",
      time: "06:15 PM",
      passengersCount: 2,
      seats: "B2, B3",
      busNumber: "BUS-002",
      busType: "AC Semi-Sleeper",
      fare: "₹ 750",
      status: "Confirmed",
    },
  ];

  // User initial
  const initial = (fullName || user.email || "N")[0].toUpperCase();

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setFullName(tempName);
    setPhone(tempPhone);
    setIsEditing(false);
  };

  const handlePrintTicket = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 font-sans">
      
      {/* PRINT-ONLY TICKET STYLESHEET */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-ticket, #printable-ticket * {
            visibility: visible;
          }
          #printable-ticket {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* 1. TOP NAVBAR */}
      <header className="w-full bg-white border-b border-slate-100 sticky top-0 z-40 no-print">
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

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-700 hover:text-[#D32F2F] font-medium text-sm py-2 transition-colors"
            >
              <Bus className="w-4 h-4 text-slate-500" />
              <span>Bus Tickets</span>
            </Link>

            <Link
              href="/#offers"
              className="flex items-center gap-2 text-slate-700 hover:text-[#D32F2F] font-medium text-sm py-2 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Offers</span>
            </Link>

            <Link
              href="/#about"
              className="flex items-center gap-2 text-slate-700 hover:text-[#D32F2F] font-medium text-sm py-2 transition-colors"
            >
              <Info className="w-4 h-4 text-slate-500" />
              <span>About Us</span>
            </Link>

            <Link
              href="/#contact"
              className="flex items-center gap-2 text-slate-700 hover:text-[#D32F2F] font-medium text-sm py-2 transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-slate-500" />
              <span>Contact</span>
            </Link>
          </nav>

          {/* Right Utilities & User Profile Pill */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => setActiveTab("history")}
              className="hidden sm:flex items-center gap-1.5 text-slate-700 hover:text-[#D32F2F] font-medium text-sm transition-colors cursor-pointer"
            >
              <ListOrdered className="w-4 h-4 text-slate-500" />
              <span>My Bookings</span>
            </button>

            <Link
              href="/#help"
              className="hidden sm:flex items-center gap-1.5 text-slate-700 hover:text-[#D32F2F] font-medium text-sm transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-slate-500" />
              <span>Help</span>
            </Link>

            {/* Profile Pill */}
            <div className="relative group">
              <div className="flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-full px-3 py-1.5 cursor-pointer transition-all">
                <div className="w-7 h-7 rounded-full bg-[#FFDADA] text-[#D32F2F] font-bold text-xs flex items-center justify-center">
                  {initial}
                </div>
                <span className="text-sm font-bold text-slate-800 max-w-[120px] truncate">
                  {fullName}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </div>

              {/* Dropdown menu on hover/click */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-lg p-2 hidden group-hover:block transition-all z-50">
                <div className="px-3 py-2 border-b border-slate-100">
                  <div className="text-xs font-semibold text-slate-400">Signed in as</div>
                  <div className="text-xs font-bold text-slate-800 truncate">{email}</div>
                </div>
                <div className="pt-1">
                  <ClientLogoutButton />
                </div>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* 2. PAGE BODY CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 no-print">
        
        {/* Page Title & Subtitle */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Profile
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Manage your payments and view your bookings
          </p>
        </div>

        {/* Main Card Container */}
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden">
          
          {/* Navigation Tabs Header */}
          <div className="border-b border-slate-100 px-6 sm:px-8 pt-4">
            <div className="flex items-center gap-8 overflow-x-auto">
              
              {/* Tab 1: Profile Overview */}
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex items-center gap-2 pb-4 font-bold text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "overview"
                    ? "border-[#D32F2F] text-[#D32F2F]"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <UserIcon className="w-4.5 h-4.5" />
                <span>Profile Overview</span>
              </button>

              {/* Tab 2: Payment Information */}
              <button
                onClick={() => setActiveTab("payment")}
                className={`flex items-center gap-2 pb-4 font-bold text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "payment"
                    ? "border-[#D32F2F] text-[#D32F2F]"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <CreditCard className="w-4.5 h-4.5" />
                <span>Payment Information</span>
              </button>

              {/* Tab 3: Booking History */}
              <button
                onClick={() => setActiveTab("history")}
                className={`flex items-center gap-2 pb-4 font-bold text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "history"
                    ? "border-[#D32F2F] text-[#D32F2F]"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Ticket className="w-4.5 h-4.5" />
                <span>Booking History</span>
              </button>

            </div>
          </div>

          {/* Tab Contents */}
          <div className="p-6 sm:p-8 space-y-10">
            
            {/* --- SECTION 1: USER INFORMATION --- */}
            {(activeTab === "overview" || activeTab === "history") && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-extrabold text-slate-900">
                    User Information
                  </h2>
                  <button
                    onClick={() => {
                      setTempName(fullName);
                      setTempPhone(phone);
                      setIsEditing(true);
                    }}
                    className="bg-[#FFF0F2] hover:bg-red-100 text-[#D32F2F] text-xs font-bold px-4 py-1.5 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>

                {/* User Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-slate-50/40 p-5 rounded-2xl border border-slate-100">
                  
                  {/* Column 1: Avatar & Full Name */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-[#FFF0F2] text-[#D32F2F] text-xl font-extrabold flex items-center justify-center shrink-0">
                      {initial}
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-semibold block">Full Name</span>
                      <span className="text-base font-extrabold text-slate-900">{fullName}</span>
                    </div>
                  </div>

                  {/* Column 2: Email Address */}
                  <div className="md:border-l md:border-slate-200/60 md:pl-6">
                    <span className="text-xs text-slate-400 font-semibold block">Email Address</span>
                    <span className="text-base font-extrabold text-slate-900 break-all">{email}</span>
                  </div>

                  {/* Column 3: Phone Number */}
                  <div className="md:border-l md:border-slate-200/60 md:pl-6">
                    <span className="text-xs text-slate-400 font-semibold block">Phone Number</span>
                    <span className="text-base font-extrabold text-slate-900">{phone}</span>
                  </div>

                </div>
              </div>
            )}

            {/* --- SECTION 2: PAYMENT INFORMATION --- */}
            {(activeTab === "overview" || activeTab === "payment") && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900">
                      Payment Information
                    </h2>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      Saved Payment Methods
                    </p>
                  </div>

                  <button className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer">
                    <Plus className="w-4 h-4" />
                    <span>Add Payment Method</span>
                  </button>
                </div>

                {/* Empty Payment State Box */}
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50/40 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-[#D32F2F] mx-auto flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">No saved payment methods</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    You haven&apos;t added any payment methods yet.
                  </p>
                </div>
              </div>
            )}

            {/* --- SECTION 3: BOOKING HISTORY --- */}
            {(activeTab === "overview" || activeTab === "history") && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900">
                      Booking History
                    </h2>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      Your recent bus bookings
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab("history")}
                    className="text-[#D32F2F] hover:underline text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All Bookings</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Booking Cards List */}
                <div className="space-y-3">
                  {bookings.map((b) => (
                    <div
                      key={b.bookingId}
                      className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-[#FFF0F2] text-[#D32F2F] flex items-center justify-center shrink-0">
                          <Bus className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-extrabold text-slate-900">
                            {b.from} → {b.to}
                          </h3>
                          <span className="text-xs font-bold text-[#D32F2F] block">
                            Muskan Travels
                          </span>
                        </div>
                      </div>

                      {/* Date */}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                        <div>
                          <span className="text-sm font-bold text-slate-900 block">{b.date}</span>
                          <span className="text-[11px] text-slate-400 font-medium">Date of Journey</span>
                        </div>
                      </div>

                      {/* Time */}
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                        <div>
                          <span className="text-sm font-bold text-slate-900 block">{b.time}</span>
                          <span className="text-[11px] text-slate-400 font-medium">Departure Time</span>
                        </div>
                      </div>

                      {/* Passengers */}
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-slate-400 shrink-0" />
                        <div>
                          <span className="text-sm font-bold text-slate-900 block">
                            {b.passengersCount} {b.passengersCount === 1 ? "Passenger" : "Passengers"}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {b.seats.includes(",") ? `Seats: ${b.seats}` : `Seat: ${b.seats}`}
                          </span>
                        </div>
                      </div>

                      {/* Actions & Ticket Download */}
                      <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-t-0 pt-3 md:pt-0">
                        <div className="text-left md:text-right">
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                            {b.status}
                          </span>
                          <div className="text-[11px] text-slate-400 font-medium mt-1">
                            Booking ID <span className="font-mono font-bold text-[#D32F2F] ml-1">{b.bookingId}</span>
                          </div>
                        </div>

                        {/* DOWNLOAD TICKET BUTTON */}
                        <button
                          onClick={() => setSelectedTicket(b)}
                          className="bg-[#FFF0F2] hover:bg-red-100 text-[#D32F2F] border border-red-200 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer shrink-0 ml-2"
                          title="Download E-Ticket PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Ticket</span>
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

      </main>

      {/* EDIT PROFILE MODAL */}
      {isEditing && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200 no-print">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-slate-900">Edit Profile</h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-900 focus:outline-none focus:border-[#D32F2F]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={tempPhone}
                  onChange={(e) => setTempPhone(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-900 focus:outline-none focus:border-[#D32F2F]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Email Address (Verified)
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-500 cursor-not-allowed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#D32F2F] text-white font-bold text-sm hover:bg-[#B71C1C] transition-colors shadow-xs cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OFFICIAL TICKET VIEW & PRINT / DOWNLOAD MODAL */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden space-y-0 relative border border-slate-100 my-8">
            
            {/* Modal Header Controls (Not printed) */}
            <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between no-print">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-red-500" />
                <span className="font-bold text-sm">Official E-Ticket Preview</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrintTicket}
                  className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>Download / Print PDF</span>
                </button>

                <button
                  onClick={() => setSelectedTicket(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                  aria-label="Close ticket"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PRINTABLE TICKET CARD CONTAINER */}
            <div id="printable-ticket" className="p-6 sm:p-8 space-y-6 bg-white">
              
              {/* Ticket Top Branding Banner */}
              <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-[#D32F2F] font-serif italic">
                      Muskan
                    </span>
                    <span className="text-xs font-bold tracking-[0.25em] text-[#D32F2F] uppercase">
                      Travels
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Safe, Comfortable & Reliable Bus Services
                  </p>
                </div>

                <div className="text-right">
                  <div className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold px-3 py-1 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>CONFIRMED E-TICKET</span>
                  </div>
                  <div className="text-xs font-mono font-bold text-slate-900 mt-2">
                    PNR / ID: <span className="text-[#D32F2F]">{selectedTicket.bookingId}</span>
                  </div>
                </div>
              </div>

              {/* Journey Route & Timings Banner */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                
                <div className="sm:col-span-5 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Boarding Stop (Origin)
                  </span>
                  <div className="text-lg font-extrabold text-slate-900">
                    {selectedTicket.from}
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {selectedTicket.fromDetail}
                  </p>
                </div>

                <div className="sm:col-span-2 text-center py-2 sm:py-0">
                  <div className="w-8 h-8 rounded-full bg-red-100 text-[#D32F2F] mx-auto flex items-center justify-center font-bold">
                    →
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 block mt-1">Direct</span>
                </div>

                <div className="sm:col-span-5 text-left sm:text-right space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Dropping Stop (Destination)
                  </span>
                  <div className="text-lg font-extrabold text-slate-900">
                    {selectedTicket.to}
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {selectedTicket.toDetail}
                  </p>
                </div>

              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-white border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5">Date of Journey</span>
                  <span className="text-sm font-extrabold text-slate-900">{selectedTicket.date}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5">Departure Time</span>
                  <span className="text-sm font-extrabold text-slate-900">{selectedTicket.time}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5">Bus / Coach Info</span>
                  <span className="text-sm font-extrabold text-slate-900">{selectedTicket.busNumber}</span>
                  <span className="text-[10px] text-slate-500 font-medium block">{selectedTicket.busType}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5">Seat No(s)</span>
                  <span className="text-sm font-extrabold text-[#D32F2F]">{selectedTicket.seats}</span>
                  <span className="text-[10px] text-slate-500 font-medium block">
                    {selectedTicket.passengersCount} {selectedTicket.passengersCount === 1 ? "Passenger" : "Passengers"}
                  </span>
                </div>
              </div>

              {/* Passenger & Payment Information */}
              <div className="border-t border-b border-slate-200 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                    Passenger Information
                  </span>
                  <div className="font-bold text-slate-900 text-sm">{fullName}</div>
                  <div className="text-slate-600 font-medium">{phone} • {email}</div>
                </div>

                <div className="sm:text-right space-y-1">
                  <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                    Total Fare Paid
                  </span>
                  <div className="font-extrabold text-[#D32F2F] text-lg">{selectedTicket.fare}</div>
                  <div className="text-emerald-700 font-bold text-[11px]">Payment Status: Completed</div>
                </div>
              </div>

              {/* Bottom QR Code & Verification Note */}
              <div className="flex items-center justify-between gap-4 pt-2">
                <div className="space-y-1 text-xs text-slate-500 font-medium max-w-sm">
                  <p className="font-bold text-slate-800">Important Boarding Note:</p>
                  <p>Please present this E-Ticket along with a valid Govt Photo ID (Aadhaar/Voter ID) at the boarding stop 15 minutes prior to departure.</p>
                </div>

                <div className="text-center shrink-0 border border-slate-200 p-3 rounded-2xl bg-slate-50">
                  <div className="w-16 h-16 bg-slate-900 text-white rounded-xl flex items-center justify-center mx-auto mb-1">
                    <QrCode className="w-12 h-12 text-white" />
                  </div>
                  <span className="text-[9px] font-mono font-bold text-slate-600 block">SCAN TO VERIFY</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
