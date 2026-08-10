import { RouteStatus, StopStatus } from "@/generated/prisma/enums";

export { RouteStatus, StopStatus };

export interface StopSummary {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  address?: string | null;
  status?: string;
}

export interface RouteStopDetail {
  id: string;
  sequence: number;
  stop: StopSummary;
}

export interface RouteItem {
  id: string;
  name: string;
  code: string;
  description: string | null;
  status: RouteStatus;
  startDestination: StopSummary;
  endDestination: StopSummary;
  stops: RouteStopDetail[];
  createdAt: string;
  updatedAt: string;
}

export interface ListRoutesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: RouteStatus;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface RouteFormValues {
  name: string;
  code: string;
  description?: string | null;
  status?: RouteStatus;
  stops: Array<{ stopId: string }>;
}
