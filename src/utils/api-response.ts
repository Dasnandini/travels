import { NextResponse } from "next/server";
import { ApiResponse, PaginatedData } from "@/types/api.types";

export function successResponse<T>(data: T, status: number = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

export function paginatedResponse<T>(
  items: T[],
  total: number,
  page: number,
  limit: number,
  status: number = 200
): NextResponse<ApiResponse<PaginatedData<T>>> {
  const totalPages = Math.ceil(total / limit) || 1;

  return NextResponse.json(
    {
      success: true,
      data: {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
    },
    { status }
  );
}

export function errorResponse(
  code: string,
  message: string,
  status: number = 400,
  details?: unknown
): NextResponse<ApiResponse<never>> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        ...(details !== undefined && { details }),
      },
    },
    { status }
  );
}
