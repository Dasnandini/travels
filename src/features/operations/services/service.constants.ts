export const SERVICE_CONSTANTS = {
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },
  SORT: {
    DEFAULT_SORT_BY: "createdAt",
    DEFAULT_SORT_ORDER: "desc" as const,
    ALLOWED_SORT_FIELDS: [
      "serviceCode",
      "name",
      "status",
      "createdAt",
      "updatedAt",
    ],
  },
};
