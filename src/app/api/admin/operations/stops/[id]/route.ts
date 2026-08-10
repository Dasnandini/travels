import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { updateStopSchema } from "@/features/operations/stops/stop.schema";
import { stopService } from "@/features/operations/stops/stop.service";
import { successResponse } from "@/utils/api-response";
import { handleApiError } from "@/utils/api-error";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;
    const stop = await stopService.getStop(id);

    return successResponse(stop);
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
    const validatedData = updateStopSchema.parse(body);

    const result = await stopService.updateStop(id, validatedData);

    return successResponse({
      ...result.stop,
      ...(result.warning && { warning: result.warning }),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
