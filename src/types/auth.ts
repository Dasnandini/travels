import { UserRole, UserStatus } from "@/constants/auth";

export interface AuthUser {
  id: string;
  name?: string | null;
  email?: string | null;
  emailVerified: boolean;
  image?: string | null;
  role: UserRole;
  status: UserStatus;
  lastLoginAt?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface AuthSession {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date | string;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface AuthContext {
  user: AuthUser;
  session: AuthSession;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
