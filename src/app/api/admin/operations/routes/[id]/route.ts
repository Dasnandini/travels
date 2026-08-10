import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { updateRouteSchema } from "@/features/operations/routes/route.schema";
import { routeService } from "@/features/operations/routes/route.service";
import { successResponse } from "@/utils/api-response";
import { handleApiError } from "@/utils/api-error";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;
    const route = await routeService.getRoute(id);

    return successResponse(route);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;
    const body = await request.json();
    const validatedData = updateRouteSchema.parse(body);

    const updatedRoute = await routeService.updateRoute(id, validatedData);

    return successResponse(updatedRoute);
  } catch (error) {
    return handleApiError(error);
  }
}
