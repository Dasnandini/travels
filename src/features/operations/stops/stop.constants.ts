export const STOP_SORT_FIELDS = [
  "name",
  "city",
  "state",
  "createdAt",
  "updatedAt",
  "status",
] as const;

export type StopSortField = (typeof STOP_SORT_FIELDS)[number];

export const STOP_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
  COUNTRY: "India",
} as const;
