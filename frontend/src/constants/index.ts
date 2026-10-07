export const STORAGE_KEYS = {
  authToken: "authToken",
  authUserId: "authUserId",
  authUserName: "authUserName",
  authEmail: "authEmail",
  hostMode: "hostMode",
  theme: "theme",
} as const;

const DEFAULT_API_URL = "http://localhost:8000";
const API_VERSION_PREFIX = "/api/v1";

/** Backend origin from `NEXT_PUBLIC_API_URL` (inlined at build time), e.g. `https://airbnb-clone-api.onrender.com`. */
export const API_BASE_URL = `${(process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL).replace(/\/+$/, "")}${API_VERSION_PREFIX}`;

export const DEFAULT_PAGE_SIZE = 20;

export const SEARCH_DEBOUNCE_MS = 400;

/** Guest service fee, charged on nights + cleaning fee (see `utils/pricing`). */
export const SERVICE_FEE_RATE = 0.12;

const CATEGORY_QUERY_PARAM = "category";

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
export const LISTING_DETAIL_STALE_TIME_MS = 5 * 60 * 1000;
export const LISTING_REVIEWS_STALE_TIME_MS = 5 * 60 * 1000;
export const UNAVAILABLE_DATES_STALE_TIME_MS = 60 * 1000;
export const REVIEWS_PAGE_SIZE = 6;
export const BOOKINGS_PAGE_SIZE = 12;
export const WISHLIST_PAGE_SIZE = 20;
export const BOOKINGS_STALE_TIME_MS = 60 * 1000;

export const HOST_LISTINGS_PAGE_SIZE = 12;
export const HOST_BOOKINGS_PAGE_SIZE = 12;
export const HOST_STALE_TIME_MS = 60 * 1000;
/** Listing options (property types, amenities) rarely change. */
export const HOST_OPTIONS_STALE_TIME_MS = 30 * 60 * 1000;

export const HTTP_STATUS = {
  unauthorized: 401,
  conflict: 409,
} as const;
export const LISTING_IMAGE_SIZES =
  "(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw";
/** Cards rendered with eager images (roughly the first visible row). */
export const LISTING_EAGER_IMAGE_COUNT = 5;

/** Hysteresis so the header doesn't flicker when its own height change shifts scrollY. */
export const HEADER_COLLAPSE_AT_PX = 80;
export const HEADER_EXPAND_AT_PX = 8;
/** Scroll distance before a direction change counts (ignores jitter and rubber-banding). */
export const SCROLL_DIRECTION_THRESHOLD_PX = 12;
/** The mobile tab bar stays put near the top of the page. */
export const MOBILE_TAB_BAR_HIDE_AFTER_PX = 120;
/** How far a bottom sheet must be dragged down before letting go closes it. */
export const SWIPE_DISMISS_THRESHOLD_PX = 96;

/** Bottom sheet on phones, centred dialog from `md` (append to `DialogContent`'s classes). */
export const BOTTOM_SHEET_DIALOG_CLASS_NAME =
  "max-md:inset-x-0 max-md:bottom-0 max-md:top-auto max-md:left-0 max-md:max-h-[92dvh] max-md:max-w-none max-md:translate-x-0 max-md:translate-y-0 max-md:rounded-b-none max-md:rounded-t-2xl max-md:data-open:zoom-in-100 max-md:data-open:slide-in-from-bottom max-md:data-closed:zoom-out-100 max-md:data-closed:slide-out-to-bottom";

export const CATEGORY_SCROLL_STEP_PX = 480;
