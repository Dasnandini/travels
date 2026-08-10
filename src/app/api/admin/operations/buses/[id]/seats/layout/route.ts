import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { seatLayoutService } from "@/features/operations/seat-layouts/seat-layout.service";
import { saveSeatLayoutSchema } from "@/features/operations/seat-layouts/seat-layout.schema";
import { successResponse } from "@/utils/api-response";
import { handleApiError } from "@/utils/api-error";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id: busId } = await params;
    const body = await request.json();

    const validatedData = saveSeatLayoutSchema.parse(body);
    const seats = await seatLayoutService.saveBusLayout(busId, validatedData);

    return successResponse(seats);
  } catch (error) {
    return handleApiError(error);
  }
}
