import { redirect } from "next/navigation";

export default function AdminOperationsRedirectPage() {
  redirect("/admin/dashboard/operations/stops");
}
