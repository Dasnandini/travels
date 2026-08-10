import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { AuthorizationError } from "@/lib/auth/authorization";

export async function GET() {
  try {
    const { user } = await requireAuth();

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phoneNumber: (user as any).phoneNumber || null,
          role: user.role,
          status: user.status,
          image: user.image,
          lastLoginAt: user.lastLoginAt,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error: any) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: error.code,
            message: error.message,
          },
        },
        { status: error.status }
      );
    }

    console.error("[GET /api/me Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred. Please try again later.",
        },
      },
      { status: 500 }
    );
  }
}
