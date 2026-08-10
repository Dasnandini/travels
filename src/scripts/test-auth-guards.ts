import "dotenv/config";
import { checkAccountStatus, isAdmin, AuthorizationError } from "../lib/auth/authorization";
import { AuthUser } from "../types/auth";

async function runVerificationTests() {
  console.log("==========================================");
  console.log("🧪 RUNNING AUTHENTICATION & AUTHORIZATION TESTS");
  console.log("==========================================");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // 1. Authorization & Status Guards
  console.log("\n1. Testing Authorization & Account Status Guards...");
  const activeUser: AuthUser = {
    id: "user-active",
    email: "user@test.com",
    emailVerified: false,
    role: "USER",
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const adminUser: AuthUser = {
    id: "admin-active",
    email: "admin@test.com",
    emailVerified: true,
    role: "ADMIN",
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const blockedAdminUser: AuthUser = {
    id: "admin-blocked",
    email: "blocked-admin@test.com",
    emailVerified: true,
    role: "ADMIN",
    status: "BLOCKED",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const suspendedUser: AuthUser = {
    id: "user-suspended",
    email: "suspended@test.com",
    emailVerified: false,
    role: "USER",
    status: "SUSPENDED",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // ACTIVE user status check
  try {
    checkAccountStatus(activeUser);
    assert(true, "ACTIVE account status check passes");
  } catch {
    assert(false, "ACTIVE account status check passes");
  }

  // SUSPENDED user status check
  try {
    checkAccountStatus(suspendedUser);
    assert(false, "SUSPENDED account status check throws AuthorizationError");
  } catch (err: any) {
    assert(err instanceof AuthorizationError && err.code === "ACCOUNT_SUSPENDED", "SUSPENDED account throws ACCOUNT_SUSPENDED");
  }

  // BLOCKED admin status check (Status takes precedence over role!)
  try {
    checkAccountStatus(blockedAdminUser);
    assert(false, "BLOCKED ADMIN status check throws AuthorizationError");
  } catch (err: any) {
    assert(err instanceof AuthorizationError && err.code === "ACCOUNT_BLOCKED", "BLOCKED ADMIN throws ACCOUNT_BLOCKED (status precedence over role)");
  }

  // Role checks
  assert(!isAdmin(activeUser), "USER role is not admin");
  assert(isAdmin(adminUser), "ADMIN role is admin");

  console.log("\n==========================================");
  console.log(`RESULT: ${passed} Passed, ${failed} Failed`);
  console.log("==========================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runVerificationTests();
