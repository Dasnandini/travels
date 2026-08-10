import { requireAuth } from "@/lib/auth/require-auth";
import { AuthContext } from "@/types/auth";

export async function requireUser(): Promise<AuthContext> {
  // Enforces valid session and ACTIVE account status
  return await requireAuth();
}
