import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { env } from "@/config/env";
import { UserRepository } from "@/repositories/user.repository";
import { AuditLogRepository } from "@/repositories/audit-log.repository";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: false, // We use Google OAuth
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID || "google-client-id-placeholder",
      clientSecret: env.GOOGLE_CLIENT_SECRET || "google-client-secret-placeholder",
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        input: false, // Security: Client cannot elevate role
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        input: false, // Security: Client cannot alter account status
      },
      lastLoginAt: {
        type: "date",
        required: false,
        input: false,
      },
    },
  },
  databaseHooks: {
    session: {
      create: {
        after: async (session) => {
          if (session?.userId) {
            await UserRepository.updateLastLogin(session.userId);
            await AuditLogRepository.record({
              actorId: session.userId,
              action: "LOGIN_SUCCESS",
              entity: "Session",
              entityId: session.id,
              ipAddress: session.ipAddress ?? null,
              userAgent: session.userAgent ?? null,
            });
          }
        },
      },
    },
  },
  secret: env.AUTH_SECRET,
  baseURL: env.AUTH_URL,
});
