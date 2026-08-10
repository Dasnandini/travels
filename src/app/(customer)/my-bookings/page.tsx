import { requireUser } from "@/lib/auth/require-user";
import { UserProfileView } from "@/components/customer/UserProfileView";

export const metadata = {
  title: "My Bookings | Muskan Travels",
  description: "View and manage your recent bus bookings",
};

export default async function MyBookingsPage() {
  const { user } = await requireUser();

  return <UserProfileView user={user} />;
}
