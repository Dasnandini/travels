import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { busService } from "@/features/operations/buses/bus.service";
import { createBusSchema, listBusesQuerySchema } from "@/features/operations/buses/bus.schema";
import { successResponse, paginatedResponse } from "@/utils/api-response";
import { handleApiError } from "@/utils/api-error";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);

    const queryParams = {
      page: searchParams.get("page") || undefined,
      limit: searchParams.get("limit") || undefined,
      search: searchParams.get("search") || undefined,
      type: searchParams.get("type") || undefined,
      status: searchParams.get("status") || undefined,
      sortBy: searchParams.get("sortBy") || undefined,
      sortOrder: searchParams.get("sortOrder") || undefined,
    };

    const validatedQuery = listBusesQuerySchema.parse(queryParams);
    const result = await busService.listBuses(validatedQuery);

    return paginatedResponse(
      result.items,
      result.pagination.total,
      result.pagination.page,
      result.pagination.limit
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();

    const validatedData = createBusSchema.parse(body);
    const bus = await busService.createBus(validatedData);

    return successResponse(bus, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
