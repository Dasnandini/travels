import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createRouteSchema, listRoutesQuerySchema } from "@/features/operations/routes/route.schema";
import { routeService } from "@/features/operations/routes/route.service";
import { successResponse, paginatedResponse } from "@/utils/api-response";
import { handleApiError } from "@/utils/api-error";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const validatedData = createRouteSchema.parse(body);

    const newRoute = await routeService.createRoute(validatedData);

    return successResponse(newRoute, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());

    const validatedQuery = listRoutesQuerySchema.parse(queryParams);
    const { items, total } = await routeService.listRoutes(validatedQuery);

    return paginatedResponse(
      items,
      total,
      validatedQuery.page,
      validatedQuery.limit
    );
  } catch (error) {
    return handleApiError(error);
  }
}
