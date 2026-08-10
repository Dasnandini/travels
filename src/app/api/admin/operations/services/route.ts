import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { serviceService } from "@/features/operations/services/service.service";
import { createServiceSchema, listServicesQuerySchema } from "@/features/operations/services/service.schema";
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
      status: searchParams.get("status") || undefined,
      busId: searchParams.get("busId") || undefined,
      routeId: searchParams.get("routeId") || undefined,
      sortBy: searchParams.get("sortBy") || undefined,
      sortOrder: searchParams.get("sortOrder") || undefined,
    };

    const validatedQuery = listServicesQuerySchema.parse(queryParams);
    const result = await serviceService.listServices(validatedQuery);

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

    const validatedData = createServiceSchema.parse(body);
    const service = await serviceService.createService(validatedData);

    return successResponse(service, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
