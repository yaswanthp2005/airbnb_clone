import type { ListingFilters, ListingSort } from "@/types/listing";

export const LISTING_SORT_OPTIONS: { value: ListingSort; labelKey: string }[] = [
  { value: "recommended", labelKey: "listings.sort.recommended" },
  { value: "price_asc", labelKey: "listings.sort.priceAsc" },
  { value: "price_desc", labelKey: "listings.sort.priceDesc" },
  { value: "rating_desc", labelKey: "listings.sort.ratingDesc" },
  { value: "newest", labelKey: "listings.sort.newest" },
];

const LISTING_SORT_SET = new Set<ListingSort>(LISTING_SORT_OPTIONS.map(option => option.value));

export const parseListingSort = (value: string | null): ListingSort | undefined => {
  if (!value || !LISTING_SORT_SET.has(value as ListingSort)) {
    return undefined;
  }
  return value as ListingSort;
};

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

/** Home page horizontal listing rows (`ListingCard` `homeRow` variant). */
export const HOME_ROW_CARD_WIDTH_CLASS_NAME =
  "w-[calc((100%-1rem)/1.8)] sm:w-[calc((100%-2rem)/3)] md:w-[calc((100%-3rem)/4)] lg:w-[calc((100%-4rem)/5)] xl:w-[calc((100%-6rem)/7)]";

export const HOME_ROW_CARD_IMAGE_SIZES =
  "(min-width: 1280px) 15vw, (min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 55vw";

export const HOME_ROW_RATING_FORMAT: Intl.NumberFormatOptions = {
  minimumFractionDigits: 1,
  maximumFractionDigits: 2,
};
