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
  type GetUnavailableDatesParams,
} from "@/api/listings";
import {
  DEFAULT_PAGE_SIZE,
  LISTING_DETAIL_STALE_TIME_MS,
  LISTING_FILTER_OPTIONS_STALE_TIME_MS,
  LISTING_REVIEWS_STALE_TIME_MS,
  LISTINGS_STALE_TIME_MS,
  LOCATION_SUGGESTIONS_STALE_TIME_MS,
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
    staleTime: LISTINGS_STALE_TIME_MS,
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
    staleTime: LISTINGS_STALE_TIME_MS,
  });

export const useLocationSuggestions = (query: string, enabled = true) =>
  useQuery({
    queryKey: queryKeys.listings.locations(query),
    queryFn: () => getLocationSuggestions(query),
    enabled: enabled && query.length > 0,
    placeholderData: keepPreviousData,
    staleTime: LOCATION_SUGGESTIONS_STALE_TIME_MS,
  });

export const useListingFilterOptions = (category?: string, enabled = true) =>
  useQuery({
    queryKey: queryKeys.listings.filterOptions(category),
    queryFn: () => getListingFilterOptions(category),
    enabled,
    placeholderData: keepPreviousData,
    staleTime: LISTING_FILTER_OPTIONS_STALE_TIME_MS,
  });

export const useListing = (listingId: number) =>
  useQuery({
    queryKey: queryKeys.listings.detail(listingId),
    queryFn: () => getListing(listingId),
    staleTime: LISTING_DETAIL_STALE_TIME_MS,
  });

export const useListingReviewsInfinite = (listingId: number) =>
  useInfiniteQuery({
    queryKey: queryKeys.listings.reviews(listingId),
    queryFn: ({ pageParam }) =>
      getListingReviews(listingId, { page: pageParam, pageSize: REVIEWS_PAGE_SIZE }),
    initialPageParam: FIRST_PAGE,
    getNextPageParam: lastPage =>
      lastPage.hasNext ? lastPage.page + 1 : undefined,
    staleTime: LISTING_REVIEWS_STALE_TIME_MS,
  });

export const useListingUnavailableDates = (
  listingId: number,
  window: GetUnavailableDatesParams,
) =>
  useQuery({
    queryKey: queryKeys.listings.unavailableDates(listingId),
    queryFn: () => getListingUnavailableDates(listingId, window),
    staleTime: UNAVAILABLE_DATES_STALE_TIME_MS,
  });
