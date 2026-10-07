"use client";

import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";

import {
  getListing,
  getListingFilterOptions,
  getListingReviews,
  getListings,
  getListingUnavailableDates,
  getLocationSuggestions,
  getPropertyTypes,
  getSearchAmenities,
  type GetUnavailableDatesParams,
} from "@/api/listings";
import {
  DEFAULT_PAGE_SIZE,
  REVIEWS_PAGE_SIZE,
  UNAVAILABLE_DATES_STALE_TIME_MS,
} from "@/constants";
import { queryKeys } from "@/constants/queryKeys";
import type { ListingFilters } from "@/types/listing";

const FIRST_PAGE = 1;

export const useListingsInfinite = (filters: ListingFilters) =>
  useInfiniteQuery({
    queryKey: queryKeys.listings.list(filters),
    queryFn: ({ pageParam }) =>
      getListings({ ...filters, page: pageParam, pageSize: DEFAULT_PAGE_SIZE }),
    initialPageParam: FIRST_PAGE,
    getNextPageParam: lastPage =>
      lastPage.hasNext ? lastPage.page + 1 : undefined,
  });

export const useListingsCount = (filters: ListingFilters, enabled = true) =>
  useQuery({
    queryKey: queryKeys.listings.count(filters),
    queryFn: async () => {
      const page = await getListings(
        { ...filters, page: FIRST_PAGE, pageSize: 1 },
        { skipToast: true },
      );
      return page.total;
    },
    enabled,
    placeholderData: keepPreviousData,
  });

export const useLocationSuggestions = (query: string, enabled = true) =>
  useQuery({
    queryKey: queryKeys.listings.locations(query),
    queryFn: () => getLocationSuggestions(query),
    enabled: enabled && query.length > 0,
    placeholderData: keepPreviousData,
  });

export const useListingFilterOptions = () =>
  useQuery({
    queryKey: queryKeys.listings.filterOptions(),
    queryFn: getListingFilterOptions,
  });

/** The amenity bar's tabs: what the current search's listings offer. */
export const useSearchAmenities = (filters: ListingFilters) => {
  const searchFilters = { ...filters, amenities: [] };
  return useQuery({
    queryKey: queryKeys.listings.searchAmenities(searchFilters),
    queryFn: () => getSearchAmenities(searchFilters),
    placeholderData: keepPreviousData,
  });
};

export const usePropertyTypes = () =>
  useQuery({
    queryKey: queryKeys.listings.propertyTypes(),
    queryFn: getPropertyTypes,
  });

export const useListing = (listingSlug: string) =>
  useQuery({
    queryKey: queryKeys.listings.detail(listingSlug),
    queryFn: () => getListing(listingSlug),
  });

export const useListingReviewsInfinite = (listingSlug: string) =>
  useInfiniteQuery({
    queryKey: queryKeys.listings.reviews(listingSlug),
    queryFn: ({ pageParam }) =>
      getListingReviews(listingSlug, { page: pageParam, pageSize: REVIEWS_PAGE_SIZE }),
    initialPageParam: FIRST_PAGE,
    getNextPageParam: lastPage =>
      lastPage.hasNext ? lastPage.page + 1 : undefined,
  });

export const useListingUnavailableDates = (
  listingSlug: string,
  window: GetUnavailableDatesParams,
) =>
  useQuery({
    queryKey: queryKeys.listings.unavailableDates(listingSlug),
    queryFn: () => getListingUnavailableDates(listingSlug, window),
    staleTime: UNAVAILABLE_DATES_STALE_TIME_MS,
  });
