import { getSession } from "@/lib/auth/get-session";
import { AnnouncementBar } from "@/components/home/AnnouncementBar";
import { Navbar } from "@/components/home/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { SpecialOffers } from "@/components/home/SpecialOffers";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Footer } from "@/components/home/Footer";

export const metadata = {
  title: "Muskan Travels | Bus Reservation & Ticket Booking",
  description: "Book bus tickets online across India with Muskan Travels. Safe, comfortable, and reliable bus services.",
};

export default async function HomePage() {
  const sessionCtx = await getSession();
  const user = sessionCtx?.user
    ? {
        name: sessionCtx.user.name,
        email: sessionCtx.user.email,
        image: sessionCtx.user.image,
        role: sessionCtx.user.role,
      }
    : null;

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-red-100 selection:text-red-900">
      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Header Navbar */}
      <Navbar user={user} />

      {/* Main Content */}
      <main className="flex-1 w-full">
        {/* Hero Section & Search Form */}
        <HeroSection />

        {/* Special Offers Section */}
        <SpecialOffers />

        {/* Why Choose Us Section */}
        <WhyChooseUs />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
