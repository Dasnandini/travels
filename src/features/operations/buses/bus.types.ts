import { BusStatus, BusType } from "@/generated/prisma/enums";

export interface BusItem {
  id: string;
  busNumber: string;
  registrationNumber: string;
  name: string | null;
  type: BusType;
  description: string | null;
  status: BusStatus;
  seatCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBusDTO {
  busNumber: string;
  registrationNumber: string;
  name?: string;
  type: BusType;
  description?: string;
  status?: BusStatus;
}

export interface UpdateBusDTO {
  name?: string;
  type?: BusType;
  description?: string;
  status?: BusStatus;
}

export interface ListBusesQueryDTO {
  page?: number;
  limit?: number;
  search?: string;
  type?: BusType;
  status?: BusStatus;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
