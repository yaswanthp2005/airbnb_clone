export const queryKeys = {
  health: {
    all: ["health"] as const,
    status: () => [...queryKeys.health.all, "status"] as const,
  },
  auth: {
    all: ["auth"] as const,
    session: () => [...queryKeys.auth.all, "session"] as const,
  },
  listings: {
    all: ["listings"] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.listings.all, "list", filters] as const,
    count: (filters: Record<string, unknown>) =>
      [...queryKeys.listings.all, "count", filters] as const,
    filterOptions: (category?: string) =>
      [...queryKeys.listings.all, "filterOptions", category ?? null] as const,
    locations: (query: string) =>
      [...queryKeys.listings.all, "locations", query] as const,
    detail: (id: string | number) =>
      [...queryKeys.listings.all, "detail", id] as const,
    reviews: (id: string | number) =>
      [...queryKeys.listings.all, "reviews", id] as const,
    unavailableDates: (id: string | number) =>
      [...queryKeys.listings.all, "unavailableDates", id] as const,
  },
  bookings: {
    all: ["bookings"] as const,
    list: () => [...queryKeys.bookings.all, "list"] as const,
    detail: (id: string | number) =>
      [...queryKeys.bookings.all, "detail", id] as const,
  },
} as const;
