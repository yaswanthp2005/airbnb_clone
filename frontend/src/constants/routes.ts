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
} as const;

export const listingRoute = (listingId: string | number) =>
  `${BASE}/listings/${listingId}`;

export const bookingRoute = (bookingId: string | number) =>
  `${BASE}/bookings/${bookingId}`;

/** Paths relative to `NEXT_PUBLIC_API_BASE_URL` (include leading segment only). */
export const apiRoutes = {
  health: "/health",
  healthEcho: "/health/echo",
  healthNotFound: "/health/__not_found__",
  authRegister: "/auth/register",
  authLogin: "/auth/login",
  authMe: "/auth/me",
} as const;
