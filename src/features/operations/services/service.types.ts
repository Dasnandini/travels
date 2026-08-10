import { ServiceStatus, Weekday } from "@/generated/prisma/enums";
import { BusItem } from "@/features/operations/buses/bus.types";
import { RouteItem } from "@/features/operations/routes/types/route.types";

export interface ServiceStopDetail {
  id: string;
  routeStopId: string;
  sequence: number;
  stopName: string;
  city: string;
  state: string;
  arrivalTime: string | null;
  departureTime: string | null;
  boardingAllowed: boolean;
  droppingAllowed: boolean;
}

export interface BusServiceItem {
  id: string;
  serviceCode: string;
  name: string;
  busId: string;
  routeId: string;
  status: ServiceStatus;
  createdAt: string;
  updatedAt: string;
  bus: BusItem;
  route: RouteItem;
  operatingDays: Weekday[];
  stops: ServiceStopDetail[];
}

export interface CreateServiceStopDTO {
  routeStopId: string;
  arrivalTime?: string | null;
  departureTime?: string | null;
  boardingAllowed?: boolean;
  droppingAllowed?: boolean;
}

export interface CreateServiceDTO {
  serviceCode: string;
  name: string;
  busId: string;
  routeId: string;
  status?: ServiceStatus;
  operatingDays: Weekday[];
  stops: CreateServiceStopDTO[];
}

export interface UpdateServiceDTO {
  name?: string;
  status?: ServiceStatus;
  operatingDays?: Weekday[];
  stops?: CreateServiceStopDTO[];
}

export interface ListServicesQueryDTO {
  page?: number;
  limit?: number;
  search?: string;
  status?: ServiceStatus;
  busId?: string;
  routeId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
