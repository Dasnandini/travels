import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { seatLayoutService } from "@/features/operations/seat-layouts/seat-layout.service";
import { successResponse } from "@/utils/api-response";
import { handleApiError } from "@/utils/api-error";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id: busId } = await params;

    const seats = await seatLayoutService.getSeatsByBusId(busId);
    return successResponse(seats);
  } catch (error) {
    return handleApiError(error);
  }
}
