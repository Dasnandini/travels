import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { googlePlacesService } from "@/services/maps/google-places.service";
import { successResponse } from "@/utils/api-response";
import { handleApiError, ApiError } from "@/utils/api-error";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const url = new URL(request.url);
    const query = url.searchParams.get("query")?.trim();

    if (!query) {
      throw ApiError.badRequest("Query parameter 'query' is required.", "MISSING_SEARCH_QUERY");
    }

    const places = await googlePlacesService.searchPlaces(query);

    return successResponse(places);
  } catch (error) {
    return handleApiError(error);
  }
}
