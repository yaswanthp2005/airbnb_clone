export const STORAGE_KEYS = {
  authToken: "authToken",
  authUserId: "authUserId",
  authUserName: "authUserName",
  authEmail: "authEmail",
} as const;

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

export const DEFAULT_PAGE_SIZE = 20;

export const SEARCH_DEBOUNCE_MS = 400;

/** Mock checkout fee rates (INR); used when displaying price breakdowns. */
export const SERVICE_FEE_RATE = 0.14;
export const CLEANING_FEE_DEFAULT = 500;

export { apiRoutes, listingRoute, bookingRoute, routes } from "./routes";
export { queryKeys } from "./queryKeys";
