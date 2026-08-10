import { BusType } from "@/generated/prisma/enums";

export interface BusSearchQueryParams {
  from: string;
  to: string;
  date: string;
  passengers?: number;
  page?: number;
  limit?: number;
}

export interface BusSearchResultItem {
  serviceId: string;
  serviceCode: string;
  serviceName: string;
  bus: {
    id: string;
    busNumber: string;
    type: BusType;
  };
  route: {
    id: string;
    name: string;
  };
  from: {
    stopId: string;
    name: string;
    city: string;
    departureTime: string;
  };
  to: {
    stopId: string;
    name: string;
    city: string;
    arrivalTime: string;
  };
  durationMinutes: number;
  operatingDate: string;
  availability: {
    status: "NOT_AVAILABLE_YET";
  };
}

export interface BusSearchPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface BusSearchResponseData {
  items: BusSearchResultItem[];
  pagination: BusSearchPagination;
}
