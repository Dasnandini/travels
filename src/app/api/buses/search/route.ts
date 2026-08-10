import { NextRequest } from "next/server";
import { busSearchSchema } from "@/features/bus-search/bus-search.schema";
import { busSearchService } from "@/features/bus-search/bus-search.service";
import { successResponse } from "@/utils/api-response";
import { handleApiError } from "@/utils/api-error";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawQueryParams = Object.fromEntries(searchParams.entries());

    const validatedQuery = busSearchSchema.parse(rawQueryParams);

    const result = await busSearchService.searchBuses(validatedQuery);

    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}
