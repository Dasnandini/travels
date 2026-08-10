import { RouteStatus, StopStatus } from "@/generated/prisma/enums";
import { RouteSortField } from "./route.constants";

export interface RouteStopInput {
  stopId: string;
}

export interface CreateRouteInput {
  name: string;
  code: string;
  description?: string | null;
  stops: RouteStopInput[];
}

export interface UpdateRouteInput {
  name?: string;
  code?: string;
  description?: string | null;
  status?: RouteStatus;
  stops?: RouteStopInput[];
}

export interface ListRoutesQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: RouteStatus;
  sortBy?: RouteSortField;
  sortOrder?: "asc" | "desc";
}

export interface StopSummaryDTO {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  address?: string | null;
  status?: StopStatus;
}

export interface RouteStopDetailDTO {
  id: string;
  sequence: number;
  stop: StopSummaryDTO;
}

export interface RouteResponseDTO {
  id: string;
  name: string;
  code: string;
  description: string | null;
  status: RouteStatus;
  startDestination: StopSummaryDTO;
  endDestination: StopSummaryDTO;
  stops: RouteStopDetailDTO[];
  createdAt: string;
  updatedAt: string;
}
