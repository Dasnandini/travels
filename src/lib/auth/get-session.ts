import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { AuthContext } from "@/types/auth";
import { UserRole, UserStatus } from "@/constants/auth";

export async function getSession(): Promise<AuthContext | null> {
  try {
    const sessionData = await auth.api.getSession({
      headers: await headers(),
    });

    if (!sessionData || !sessionData.user || !sessionData.session) {
      return null;
    }

    const { user, session } = sessionData;

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified ?? false,
        image: user.image,
        role: ((user as any).role as UserRole) || "USER",
        status: ((user as any).status as UserStatus) || "ACTIVE",
        lastLoginAt: (user as any).lastLoginAt ? new Date((user as any).lastLoginAt) : null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      session: {
        id: session.id,
        userId: session.userId,
        token: session.token,
        expiresAt: session.expiresAt,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      },
    };
  } catch (error) {
    console.error("[GetSession Error]: Failed to fetch auth session", error);
    return null;
  }
}
