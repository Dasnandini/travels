import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { busService } from "@/features/operations/buses/bus.service";
import { updateBusSchema } from "@/features/operations/buses/bus.schema";
import { successResponse } from "@/utils/api-response";
import { handleApiError } from "@/utils/api-error";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const bus = await busService.getBusById(id);
    return successResponse(bus);
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

    const validatedData = updateBusSchema.parse(body);
    const updatedBus = await busService.updateBus(id, validatedData);

    return successResponse(updatedBus);
  } catch (error) {
    return handleApiError(error);
  }
}
