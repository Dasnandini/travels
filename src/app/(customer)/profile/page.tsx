import { requireUser } from "@/lib/auth/require-user";
import { UserProfileView } from "@/components/customer/UserProfileView";

export const metadata = {
  title: "My Profile | Muskan Travels",
  description: "Manage your profile, payments, and view your bookings",
};

export default async function ProfilePage() {
  const { user } = await requireUser();

  return <UserProfileView user={user} />;
}
