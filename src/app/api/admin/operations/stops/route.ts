import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createStopSchema, listStopsQuerySchema } from "@/features/operations/stops/stop.schema";
import { stopService } from "@/features/operations/stops/stop.service";
import { successResponse, paginatedResponse } from "@/utils/api-response";
import { handleApiError } from "@/utils/api-error";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const validatedData = createStopSchema.parse(body);

    const newStop = await stopService.createStop(validatedData);

    return successResponse(newStop, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());

    const validatedQuery = listStopsQuerySchema.parse(queryParams);
    const { items, total } = await stopService.listStops(validatedQuery);

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
