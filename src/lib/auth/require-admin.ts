import { getSession } from "@/lib/auth/get-session";
import { isAdmin, checkAccountStatus } from "@/lib/auth/authorization";
import { AuthContext } from "@/types/auth";
import { redirect } from "next/navigation";

export async function requireAdmin(): Promise<AuthContext> {
  const sessionCtx = await getSession();

  if (!sessionCtx || !sessionCtx.user) {
    redirect("/login");
  }

  try {
    checkAccountStatus(sessionCtx.user);
  } catch {
    redirect("/login");
  }

  if (!isAdmin(sessionCtx.user)) {
    redirect("/");
  }

  return sessionCtx;
}
