"use client";

import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";

import { getListingFilterOptions, getListings } from "@/api/listings";
import {
  DEFAULT_PAGE_SIZE,
  LISTING_FILTER_OPTIONS_STALE_TIME_MS,
  LISTINGS_STALE_TIME_MS,
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

export const useListingFilterOptions = (category?: string, enabled = true) =>
  useQuery({
    queryKey: queryKeys.listings.filterOptions(category),
    queryFn: () => getListingFilterOptions(category),
    enabled,
    placeholderData: keepPreviousData,
    staleTime: LISTING_FILTER_OPTIONS_STALE_TIME_MS,
  });
