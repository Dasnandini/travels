import { prisma } from "@/lib/prisma";
import { UserRole, UserStatus } from "@/constants/auth";

export class UserRepository {
  static async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  static async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  static async updateLastLogin(id: string) {
    return prisma.user.update({
      where: { id },
      data: {
        lastLoginAt: new Date(),
      },
    });
  }

  static async updateStatus(id: string, status: UserStatus) {
    return prisma.user.update({
      where: { id },
      data: { status },
    });
  }

  static async updateRole(id: string, role: UserRole) {
    return prisma.user.update({
      where: { id },
      data: { role },
    });
  }
}
