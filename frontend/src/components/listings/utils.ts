import { LISTING_FILTER_PARAMS } from "@/constants";
import type { ListingFilters } from "@/types/listing";

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
  };
};

/** Query object for `buildUrl`; camelCase keys become the snake_case URL params. */
export const filtersToQuery = (filters: ListingFilters) => ({
  category: filters.category,
  minPrice: filters.minPrice,
  maxPrice: filters.maxPrice,
  propertyType: uniqueSorted(filters.propertyType),
  amenities: uniqueSorted(filters.amenities),
  bedrooms: filters.bedrooms,
});

export const countActiveFilters = (filters: ListingFilters): number =>
  Number(filters.minPrice !== undefined || filters.maxPrice !== undefined) +
  filters.propertyType.length +
  filters.amenities.length +
  Number(filters.bedrooms !== undefined);

export const toggleValue = <T>(values: T[], value: T): T[] =>
  values.includes(value)
    ? values.filter(item => item !== value)
    : [...values, value];
