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

/** URL search param names for listing filters (snake_case to mirror the API). */
export const LISTING_FILTER_PARAMS = {
  category: CATEGORY_QUERY_PARAM,
  minPrice: "min_price",
  maxPrice: "max_price",
  propertyType: "property_type",
  amenities: "amenities",
  bedrooms: "bedrooms",
  location: "location",
  checkIn: "check_in",
  checkOut: "check_out",
  adults: "adults",
  children: "children",
  infants: "infants",
  pets: "pets",
} as const;

/** `yyyy-MM-dd`, the date format shared by URL params and the API. */
export const DATE_PARAM_FORMAT = "yyyy-MM-dd";
export const LOCATION_SUGGESTIONS_STALE_TIME_MS = 10 * 60 * 1000;

export const LISTINGS_STALE_TIME_MS = 5 * 60 * 1000;
export const LISTING_FILTER_OPTIONS_STALE_TIME_MS = 30 * 60 * 1000;
export const FILTERS_PREVIEW_DEBOUNCE_MS = 400;
export const INFINITE_SCROLL_ROOT_MARGIN = "600px";
export const LISTING_IMAGE_SIZES =
  "(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw";
/** Cards rendered with eager images (roughly the first visible row). */
export const LISTING_EAGER_IMAGE_COUNT = 5;

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
