import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { errorResponse } from "@/utils/api-response";

export class ApiError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(message: string, code: string = "BAD_REQUEST", statusCode: number = 400, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static badRequest(message: string, code: string = "BAD_REQUEST", details?: unknown): ApiError {
    return new ApiError(message, code, 400, details);
  }

  static unauthorized(message: string = "Authentication required.", code: string = "UNAUTHORIZED"): ApiError {
    return new ApiError(message, code, 401);
  }

  static forbidden(message: string = "Forbidden access.", code: string = "FORBIDDEN"): ApiError {
    return new ApiError(message, code, 403);
  }

  static notFound(message: string = "Resource not found.", code: string = "NOT_FOUND"): ApiError {
    return new ApiError(message, code, 404);
  }

  static conflict(message: string, code: string = "CONFLICT"): ApiError {
    return new ApiError(message, code, 409);
  }

  static unprocessable(message: string, code: string = "UNPROCESSABLE_ENTITY", details?: unknown): ApiError {
    return new ApiError(message, code, 422, details);
  }

  static internal(message: string = "An unexpected internal error occurred.", code: string = "INTERNAL_SERVER_ERROR"): ApiError {
    return new ApiError(message, code, 500);
  }
}

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return errorResponse(error.code, error.message, error.statusCode, error.details);
  }

  if (error instanceof ZodError) {
    const formattedDetails = error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return errorResponse(
      "VALIDATION_ERROR",
      "Invalid request data.",
      422,
      formattedDetails
    );
  }

  // Generic fallback without exposing stack traces or SQL details
  console.error("[API Error Handler]:", error);
  return errorResponse(
    "INTERNAL_SERVER_ERROR",
    "An unexpected error occurred. Please try again later.",
    500
  );
}
