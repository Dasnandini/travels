export type StopStatus = "ACTIVE" | "INACTIVE";

export interface StopItem {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  address: string | null;
  landmark: string | null;
  googlePlaceId: string | null;
  latitude: number | null;
  longitude: number | null;
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
  city: string;
  state: string;
  country: string;
  address?: string | null;
  landmark?: string | null;
  googlePlaceId?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  status?: StopStatus;
}

export interface PlaceSearchItem {
  placeId: string;
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
}
