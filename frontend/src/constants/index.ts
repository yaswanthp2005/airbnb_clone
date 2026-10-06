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

export const CATEGORY_QUERY_PARAM = "category";

/** Hysteresis so the header doesn't flicker when its own height change shifts scrollY. */
export const HEADER_COLLAPSE_AT_PX = 80;
export const HEADER_EXPAND_AT_PX = 8;

export const CATEGORY_SCROLL_STEP_PX = 480;

export {
  apiRoutes,
  bookingRoute,
  comingSoonRoute,
  listingRoute,
  routes,
} from "./routes";
export { queryKeys } from "./queryKeys";
