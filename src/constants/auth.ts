export const AUTH_CONSTANTS = {
  ROLES: {
    USER: "USER",
    ADMIN: "ADMIN",
  } as const,
  STATUSES: {
    ACTIVE: "ACTIVE",
    SUSPENDED: "SUSPENDED",
    BLOCKED: "BLOCKED",
  } as const,
  REDIRECT_PATHS: {
    USER: "/",
    ADMIN: "/admin/dashboard",
    LOGIN: "/login",
  } as const,
  ERROR_MESSAGES: {
    ACCOUNT_SUSPENDED: "Your account is suspended. Please contact support.",
    ACCOUNT_BLOCKED: "Your account has been blocked.",
    UNAUTHORIZED: "Authentication required to access this resource.",
    FORBIDDEN: "You do not have permission to access this resource.",
  },
} as const;

export type UserRole = (typeof AUTH_CONSTANTS.ROLES)[keyof typeof AUTH_CONSTANTS.ROLES];
export type UserStatus = (typeof AUTH_CONSTANTS.STATUSES)[keyof typeof AUTH_CONSTANTS.STATUSES];
