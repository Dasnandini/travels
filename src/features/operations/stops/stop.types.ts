import { StopStatus } from "@/generated/prisma/enums";

export { StopStatus };

export interface StopItem {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  landmark: string | null;
  googlePlaceId: string | null;
  status: StopStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ListStopsParams {
  page?: number;
  limit?: number;
  search?: string;
  city?: string;
  state?: string;
  status?: StopStatus;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface StopFormValues {
  name: string;
  code?: string;
  city: string;
  state: string;
  country?: string;
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
  landmark?: string | null;
  googlePlaceId?: string | null;
  status?: StopStatus;
}

export type CreateStopInput = StopFormValues;
export type UpdateStopInput = Partial<StopFormValues>;
export type ListStopsQuery = ListStopsParams;
export type StopResponseDTO = StopItem;
