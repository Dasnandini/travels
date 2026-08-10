import { requireUser } from "@/lib/auth/require-user";
import { UserProfileView } from "@/components/customer/UserProfileView";

export const metadata = {
  title: "My Profile | Muskan Travels",
  description: "Manage your payments and view your bookings with Muskan Travels",
};

export default async function DashboardPage() {
  const { user } = await requireUser();

  return <UserProfileView user={user} />;
}
