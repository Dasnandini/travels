import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { getSession } from "@/lib/auth/get-session";
import { redirect } from "next/navigation";
import { AUTH_CONSTANTS } from "@/constants/auth";

export const metadata = {
  title: "Login",
  description: "Secure customer and administrator sign in",
};

export default async function LoginPage() {
  const sessionCtx = await getSession();

  // If already authenticated with an ACTIVE status, auto-redirect by role
  if (sessionCtx?.user && sessionCtx.user.status === AUTH_CONSTANTS.STATUSES.ACTIVE) {
    if (sessionCtx.user.role === AUTH_CONSTANTS.ROLES.ADMIN) {
      redirect("/admin/dashboard");
    } else {
      redirect("/");
    }
  }

  return (
    <AuthShell>
      <LoginForm />
    </AuthShell>
  );
}
