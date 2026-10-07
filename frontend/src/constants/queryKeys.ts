export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    session: () => [...queryKeys.auth.all, "session"] as const,
  },
  listings: {
    all: ["listings"] as const,
    lists: () => [...queryKeys.listings.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.listings.lists(), filters] as const,
    count: (filters: Record<string, unknown>) =>
      [...queryKeys.listings.all, "count", filters] as const,
    filterOptions: () => [...queryKeys.listings.all, "filterOptions"] as const,
    propertyTypes: () => [...queryKeys.listings.all, "propertyTypes"] as const,
    locations: (query: string) =>
      [...queryKeys.listings.all, "locations", query] as const,
    details: () => [...queryKeys.listings.all, "detail"] as const,
    detail: (id: string | number) =>
      [...queryKeys.listings.details(), id] as const,
    reviews: (id: string | number) =>
      [...queryKeys.listings.all, "reviews", id] as const,
    unavailableDates: (id: string | number) =>
      [...queryKeys.listings.all, "unavailableDates", id] as const,
  },
  destinations: {
    all: ["destinations"] as const,
    list: () => [...queryKeys.destinations.all, "list"] as const,
  },
  wishlist: {
    all: ["wishlist"] as const,
    list: () => [...queryKeys.wishlist.all, "list"] as const,
  },
  host: {
    all: ["host"] as const,
    listings: () => [...queryKeys.host.all, "listings"] as const,
    listing: (id: string | number) => [...queryKeys.host.all, "listing", id] as const,
    bookings: (tab: string) => [...queryKeys.host.all, "bookings", tab] as const,
    stats: () => [...queryKeys.host.all, "stats"] as const,
    listingOptions: () => [...queryKeys.host.all, "listingOptions"] as const,
  },
  bookings: {
    all: ["bookings"] as const,
    list: (tab: string) => [...queryKeys.bookings.all, "list", tab] as const,
    detail: (id: string | number) =>
      [...queryKeys.bookings.all, "detail", id] as const,
  },
} as const;
