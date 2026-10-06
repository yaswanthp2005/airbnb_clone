import type { ListingFilters } from "@/types/listing";

export const LISTING_GRID_CLASS_NAME =
  "grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";

export const NEXT_PAGE_SKELETON_COUNT = 5;

export const EMPTY_LISTING_FILTERS: ListingFilters = {
  propertyType: [],
  amenities: [],
};
