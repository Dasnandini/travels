import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { serviceService } from "@/features/operations/services/service.service";
import { updateServiceSchema } from "@/features/operations/services/service.schema";
import { successResponse } from "@/utils/api-response";
import { handleApiError } from "@/utils/api-error";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const service = await serviceService.getServiceById(id);
    return successResponse(service);
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

    const validatedData = updateServiceSchema.parse(body);
    const updatedService = await serviceService.updateService(id, validatedData);

    return successResponse(updatedService);
  } catch (error) {
    return handleApiError(error);
  }
}
