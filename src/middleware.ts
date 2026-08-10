import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check for Better Auth session cookies across default and custom configurations
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value ||
    request.cookies.get("auth.session_token")?.value ||
    request.cookies.get("__Secure-auth.session_token")?.value;

  const isAuthPath = pathname.startsWith("/login");
  const isAdminPath = pathname.startsWith("/admin");
  const isDashboardPath = pathname.startsWith("/dashboard");

  if (!sessionToken && (isAdminPath || isDashboardPath)) {
    const url = new URL("/login", request.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/login",
  ],
};
