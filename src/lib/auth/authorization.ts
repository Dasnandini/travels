import { AuthUser } from "@/types/auth";
import { AUTH_CONSTANTS, UserRole, UserStatus } from "@/constants/auth";

export class AuthorizationError extends Error {
  public code: string;
  public status: number;

  constructor(message: string, code: string = "FORBIDDEN", status: number = 403) {
    super(message);
    this.name = "AuthorizationError";
    this.code = code;
    this.status = status;
  }
}

/**
 * Checks if user account is in ACTIVE status.
 * Throws AuthorizationError if user is SUSPENDED or BLOCKED.
 */
export function checkAccountStatus(user: AuthUser): void {
  if (user.status === AUTH_CONSTANTS.STATUSES.BLOCKED) {
    throw new AuthorizationError(
      AUTH_CONSTANTS.ERROR_MESSAGES.ACCOUNT_BLOCKED,
      "ACCOUNT_BLOCKED",
      403
    );
  }

  if (user.status === AUTH_CONSTANTS.STATUSES.SUSPENDED) {
    throw new AuthorizationError(
      AUTH_CONSTANTS.ERROR_MESSAGES.ACCOUNT_SUSPENDED,
      "ACCOUNT_SUSPENDED",
      403
    );
  }

  if (user.status !== AUTH_CONSTANTS.STATUSES.ACTIVE) {
    throw new AuthorizationError(
      AUTH_CONSTANTS.ERROR_MESSAGES.FORBIDDEN,
      "FORBIDDEN",
      403
    );
  }
}

/**
 * Verifies if user has a required role. Account status must be checked first.
 */
export function hasRole(user: AuthUser, requiredRole: UserRole): boolean {
  return user.role === requiredRole;
}

/**
 * Verifies if user is an Administrator.
 */
export function isAdmin(user: AuthUser): boolean {
  return hasRole(user, AUTH_CONSTANTS.ROLES.ADMIN);
}
