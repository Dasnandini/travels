import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { seatLayoutService } from "@/features/operations/seat-layouts/seat-layout.service";
import { updateSeatSchema } from "@/features/operations/seat-layouts/seat-layout.schema";
import { successResponse } from "@/utils/api-response";
import { handleApiError } from "@/utils/api-error";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; seatId: string }> }
) {
  try {
    await requireAdmin();
    const { seatId } = await params;
    const body = await request.json();

    const validatedData = updateSeatSchema.parse(body);
    const updatedSeat = await seatLayoutService.updateSingleSeat(seatId, validatedData);

    return successResponse(updatedSeat);
  } catch (error) {
    return handleApiError(error);
  }
}
