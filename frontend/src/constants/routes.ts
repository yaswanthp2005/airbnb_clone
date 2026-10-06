const BASE = "";

export const routes = {
  home: `${BASE}/`,
  login: `${BASE}/login`,
  signup: `${BASE}/signup`,
  search: `${BASE}/search`,
  trips: `${BASE}/trips`,
  wishlists: `${BASE}/wishlists`,
  hosting: `${BASE}/hosting`,
  account: `${BASE}/account`,
  messages: `${BASE}/messages`,
  identityVerification: `${BASE}/identity-verification`,
  comingSoon: `${BASE}/coming-soon/:slug`,
} as const;

export const LISTING_ROUTE_PREFIX = `${BASE}/listings/`;

export const listingRoute = (listingId: string | number) =>
  `${LISTING_ROUTE_PREFIX}${listingId}`;

export const bookingRoute = (bookingId: string | number) =>
  `${BASE}/bookings/${bookingId}`;

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
} as const;
