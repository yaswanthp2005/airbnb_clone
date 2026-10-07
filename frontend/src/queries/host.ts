"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  deleteHostListing,
  getHostBookings,
  getHostListing,
  getHostListingOptions,
  getHostListings,
  getHostStats,
  postHostListing,
  putHostListing,
} from "@/api/host";
import {
  HOST_BOOKINGS_PAGE_SIZE,
  HOST_LISTINGS_PAGE_SIZE,
  HOST_ACTIVITY_STALE_TIME_MS,
} from "@/constants";
import { queryKeys } from "@/constants/queryKeys";
import type { HostBookingTab, HostListing, HostListingInput } from "@/types/host";
import { invalidateViewerData } from "@/utils/invalidateViewerData";

const FIRST_PAGE = 1;

export type UpdateHostListingInput = {
  listingId: number;
  input: HostListingInput;
};

export const useHostListingsInfinite = () =>
  useInfiniteQuery({
    queryKey: queryKeys.host.listings(),
    queryFn: ({ pageParam }) =>
      getHostListings({ page: pageParam, pageSize: HOST_LISTINGS_PAGE_SIZE }),
    initialPageParam: FIRST_PAGE,
    getNextPageParam: lastPage =>
      lastPage.hasNext ? lastPage.page + 1 : undefined,
    staleTime: HOST_ACTIVITY_STALE_TIME_MS,
  });

export const useHostListing = (listingId: number) =>
  useQuery({
    queryKey: queryKeys.host.listing(listingId),
    queryFn: () => getHostListing(listingId),
    retry: false,
  });

export const useHostBookingsInfinite = (tab: HostBookingTab) =>
  useInfiniteQuery({
    queryKey: queryKeys.host.bookings(tab),
    queryFn: ({ pageParam }) =>
      getHostBookings({ tab, page: pageParam, pageSize: HOST_BOOKINGS_PAGE_SIZE }),
    initialPageParam: FIRST_PAGE,
    getNextPageParam: lastPage =>
      lastPage.hasNext ? lastPage.page + 1 : undefined,
    staleTime: HOST_ACTIVITY_STALE_TIME_MS,
  });

export const useHostStats = () =>
  useQuery({
    queryKey: queryKeys.host.stats(),
    queryFn: getHostStats,
    staleTime: HOST_ACTIVITY_STALE_TIME_MS,
  });

export const useHostListingOptions = () =>
  useQuery({
    queryKey: queryKeys.host.listingOptions(),
    queryFn: getHostListingOptions,
  });

/**
 * A listing change shows up everywhere it is rendered: the dashboard, explore / search
 * and detail pages, wishlists and the trip cards of its guests.
 */
const useInvalidateAfterListingChange = () => {
  const queryClient = useQueryClient();
  return () => invalidateViewerData(queryClient);
};

export const useCreateHostListing = () => {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateAfterListingChange();

  return useMutation({
    mutationFn: (input: HostListingInput) => postHostListing(input),
    onSuccess: (listing: HostListing) => {
      queryClient.setQueryData(queryKeys.host.listing(listing.id), listing);
      invalidate();
    },
  });
};

export const useUpdateHostListing = () => {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateAfterListingChange();

  return useMutation({
    mutationFn: ({ listingId, input }: UpdateHostListingInput) =>
      putHostListing(listingId, input),
    onSuccess: (listing: HostListing) => {
      queryClient.setQueryData(queryKeys.host.listing(listing.id), listing);
      invalidate();
    },
  });
};

export const useDeleteHostListing = () => {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateAfterListingChange();

  return useMutation({
    mutationFn: (listingId: number) => deleteHostListing(listingId),
    onSuccess: ({ id }) => {
      queryClient.removeQueries({ queryKey: queryKeys.host.listing(id) });
      queryClient.removeQueries({ queryKey: queryKeys.listings.detail(id) });
      invalidate();
    },
    // A 409 means a reservation arrived since the dashboard loaded; refresh the counts.
    onError: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.host.all });
    },
  });
};
