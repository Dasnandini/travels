import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to initialize Prisma.");
}

// Ensure global prisma instance in development is re-created if new schema models are added
if (
  globalForPrisma.prisma &&
  (!("stop" in globalForPrisma.prisma) ||
    !("bus" in globalForPrisma.prisma) ||
    !("busService" in globalForPrisma.prisma))
) {
  globalForPrisma.prisma = undefined;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}