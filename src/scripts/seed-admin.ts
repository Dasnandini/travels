import "dotenv/config";
import { prisma } from "../lib/prisma";
import { AUTH_CONSTANTS } from "../constants/auth";

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "nandini.intellizo@gmail.com";
  const adminName = process.env.ADMIN_NAME || "Nandini";

  console.log(`🚀 Bootstrapping Initial Admin Account...`);
  console.log(`Email: ${adminEmail}`);

  try {
    const existingUser = await prisma.user.findFirst({
      where: { email: adminEmail },
    });

    if (existingUser) {
      const updatedAdmin = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          role: AUTH_CONSTANTS.ROLES.ADMIN,
          status: AUTH_CONSTANTS.STATUSES.ACTIVE,
          name: existingUser.name || adminName,
          emailVerified: true,
        },
      });

      console.log(`✅ Promoted existing user ${updatedAdmin.id} to ADMIN role.`);
    } else {
      const newAdmin = await prisma.user.create({
        data: {
          name: adminName,
          email: adminEmail,
          emailVerified: true,
          role: AUTH_CONSTANTS.ROLES.ADMIN,
          status: AUTH_CONSTANTS.STATUSES.ACTIVE,
        },
      });

      console.log(`✅ Created initial ADMIN user with ID: ${newAdmin.id}`);
    }

    await prisma.auditLog.create({
      data: {
        action: "ADMIN_CREATED",
        entity: "User",
        metadata: {
          email: adminEmail,
          source: "seed-admin script",
        },
      },
    });

    console.log(`🎉 Admin bootstrap successfully completed!`);
  } catch (error) {
    console.error(`❌ Error seeding initial admin:`, error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
