const BASE = "";

export const routes = {
  home: `${BASE}/`,
  login: `${BASE}/login`,
  signup: `${BASE}/signup`,
  search: `${BASE}/search`,
  trips: `${BASE}/trips`,
  wishlists: `${BASE}/wishlists`,
  hosting: `${BASE}/hosting`,
  hostingNewListing: `${BASE}/hosting/listings/new`,
  account: `${BASE}/account`,
  messages: `${BASE}/messages`,
  identityVerification: `${BASE}/identity-verification`,
  comingSoon: `${BASE}/coming-soon/:slug`,
} as const;

export const LISTING_ROUTE_PREFIX = `${BASE}/listings/`;

export const listingRoute = (listingId: string | number) =>
  `${LISTING_ROUTE_PREFIX}${listingId}`;

export const BOOK_ROUTE_PREFIX = `${BASE}/book/`;
export const BOOKING_ROUTE_PREFIX = `${BASE}/bookings/`;

/** "Confirm and pay" checkout for a listing. */
export const bookRoute = (listingId: string | number) => `${BOOK_ROUTE_PREFIX}${listingId}`;

/** Confirmation / details page of a placed booking. */
export const bookingRoute = (bookingId: string | number) =>
  `${BOOKING_ROUTE_PREFIX}${bookingId}`;

export const HOSTING_ROUTE_PREFIX = routes.hosting;

export const hostingEditListingRoute = (listingId: string | number) =>
  `${HOSTING_ROUTE_PREFIX}/listings/${listingId}/edit`;

export const comingSoonRoute = (slug: string) =>
  routes.comingSoon.replace(":slug", encodeURIComponent(slug));

/** Paths relative to `NEXT_PUBLIC_API_BASE_URL` (include leading segment only). */
export const apiRoutes = {
  health: "/health",
  healthEcho: "/health/echo",
  healthNotFound: "/health/__not_found__",
  authRegister: "/auth/register",
  authLogin: "/auth/login",
  authMe: "/auth/me",
  listings: "/listings",
  listingFilterOptions: "/listings/filter-options",
  listingLocations: "/listings/locations",
  listingDetail: "/listings/:id",
  listingReviews: "/listings/:id/reviews",
  listingUnavailableDates: "/listings/:id/unavailable-dates",
  bookings: "/bookings",
  myBookings: "/bookings/me",
  bookingDetail: "/bookings/:id",
  bookingCancel: "/bookings/:id/cancel",
  wishlist: "/wishlist",
  wishlistItem: "/wishlist/:id",
  hostListings: "/host/listings",
  hostListing: "/host/listings/:id",
  hostBookings: "/host/bookings",
  hostStats: "/host/stats",
  hostListingOptions: "/host/listing-options",
} as const;
