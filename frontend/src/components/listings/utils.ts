import { isAfter } from "date-fns";

import { LISTING_FILTER_PARAMS } from "@/constants";
import type { ListingFilters } from "@/types/listing";
import { fromDateParam } from "@/utils/dateParam";

type ReadableSearchParams = Pick<URLSearchParams, "get">;

const parsePositiveInt = (value: string | null): number | undefined => {
  if (!value) {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
};

const parseCsv = (value: string | null): string[] =>
  (value ?? "")
    .split(",")
    .map(part => part.trim())
    .filter(Boolean);

const uniqueSorted = <T extends string | number>(values: T[]): T[] =>
  [...new Set(values)].sort((first, second) =>
    String(first).localeCompare(String(second), undefined, { numeric: true }),
  );

const parseStayDates = (searchParams: ReadableSearchParams) => {
  const checkIn = searchParams.get(LISTING_FILTER_PARAMS.checkIn);
  const checkOut = searchParams.get(LISTING_FILTER_PARAMS.checkOut);
  const checkInDate = fromDateParam(checkIn);
  const checkOutDate = fromDateParam(checkOut);

  if (!checkInDate || !checkOutDate || !isAfter(checkOutDate, checkInDate)) {
    return { checkIn: undefined, checkOut: undefined };
  }
  return { checkIn: checkIn ?? undefined, checkOut: checkOut ?? undefined };
};

export const filtersFromSearchParams = (
  searchParams: ReadableSearchParams,
): ListingFilters => {
  let minPrice = parsePositiveInt(searchParams.get(LISTING_FILTER_PARAMS.minPrice));
  let maxPrice = parsePositiveInt(searchParams.get(LISTING_FILTER_PARAMS.maxPrice));
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    minPrice = undefined;
    maxPrice = undefined;
  }

  return {
    category: searchParams.get(LISTING_FILTER_PARAMS.category) ?? undefined,
    minPrice,
    maxPrice,
    propertyType: uniqueSorted(
      parseCsv(searchParams.get(LISTING_FILTER_PARAMS.propertyType)),
    ),
    amenities: uniqueSorted(
      parseCsv(searchParams.get(LISTING_FILTER_PARAMS.amenities))
        .map(Number)
        .filter(id => Number.isInteger(id) && id > 0),
    ),
    bedrooms: parsePositiveInt(searchParams.get(LISTING_FILTER_PARAMS.bedrooms)),
    location: searchParams.get(LISTING_FILTER_PARAMS.location)?.trim() || undefined,
    ...parseStayDates(searchParams),
    adults: parsePositiveInt(searchParams.get(LISTING_FILTER_PARAMS.adults)),
    children: parsePositiveInt(searchParams.get(LISTING_FILTER_PARAMS.children)),
    infants: parsePositiveInt(searchParams.get(LISTING_FILTER_PARAMS.infants)),
    pets: parsePositiveInt(searchParams.get(LISTING_FILTER_PARAMS.pets)),
  };
};

/** Query object for `buildUrl`; camelCase keys become the snake_case URL params. */
export const filtersToQuery = (filters: ListingFilters) => ({
  location: filters.location,
  checkIn: filters.checkIn,
  checkOut: filters.checkOut,
  adults: filters.adults,
  children: filters.children,
  infants: filters.infants,
  pets: filters.pets,
  category: filters.category,
  minPrice: filters.minPrice,
  maxPrice: filters.maxPrice,
  propertyType: uniqueSorted(filters.propertyType),
  amenities: uniqueSorted(filters.amenities),
  bedrooms: filters.bedrooms,
});

/** Dates + guests to carry from search results into a listing page. */
export const stayQuery = (filters: ListingFilters) => ({
  checkIn: filters.checkIn,
  checkOut: filters.checkOut,
  adults: filters.adults,
  children: filters.children,
  infants: filters.infants,
  pets: filters.pets,
});

export const countActiveFilters = (filters: ListingFilters): number =>
  Number(filters.minPrice !== undefined || filters.maxPrice !== undefined) +
  filters.propertyType.length +
  filters.amenities.length +
  Number(filters.bedrooms !== undefined);

export const hasSearchCriteria = (filters: ListingFilters): boolean =>
  Boolean(
    filters.location ||
      filters.checkIn ||
      filters.adults ||
      filters.children ||
      filters.infants ||
      filters.pets,
  );

/** Resets what the Filters modal controls, keeping category and the search bar's values. */
export const clearModalFilters = (filters: ListingFilters): ListingFilters => ({
  ...filters,
  minPrice: undefined,
  maxPrice: undefined,
  propertyType: [],
  amenities: [],
  bedrooms: undefined,
});

export const toggleValue = <T>(values: T[], value: T): T[] =>
  values.includes(value)
    ? values.filter(item => item !== value)
    : [...values, value];
