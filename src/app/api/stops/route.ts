import { NextRequest } from "next/server";
import { stopService } from "@/features/operations/stops/stop.service";
import { paginatedResponse } from "@/utils/api-response";
import { handleApiError } from "@/utils/api-error";
import { StopStatus } from "@/generated/prisma/enums";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || undefined;

    const { items, total } = await stopService.listStops({
      status: StopStatus.ACTIVE,
      search,
      page: 1,
      limit: 100,
    });

    return paginatedResponse(items, total, 1, 100);
  } catch (error) {
    return handleApiError(error);
  }
}
