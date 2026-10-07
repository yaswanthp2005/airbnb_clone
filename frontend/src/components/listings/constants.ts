import type { ListingFilters } from "@/types/listing";

export const LISTING_GRID_CLASS_NAME =
  "grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";

/** Fewer columns while the map takes the right side (from `lg`; smaller screens hide the map). */
export const LISTING_MAP_GRID_CLASS_NAME =
  "grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 2xl:grid-cols-3";

export const NEXT_PAGE_SKELETON_COUNT = 5;

/** Listing cards open the listing in a new tab, keeping the results where they were. */
export const LISTING_LINK_TARGET_PROPS = { target: "_blank", rel: "noopener" } as const;

export const EMPTY_LISTING_FILTERS: ListingFilters = {
  propertyType: [],
  amenities: [],
};
