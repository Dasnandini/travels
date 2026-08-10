export const ROUTE_SORT_FIELDS = [
  "name",
  "code",
  "createdAt",
  "updatedAt",
  "status",
] as const;

export type RouteSortField = (typeof ROUTE_SORT_FIELDS)[number];

export const ROUTE_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
  MIN_STOPS: 2,
} as const;
