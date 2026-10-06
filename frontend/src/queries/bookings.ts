"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { isAxiosError } from "axios";

import {
  cancelBooking,
  getBooking,
  getMyBookings,
  postBooking,
} from "@/api/bookings";
import { BOOKINGS_PAGE_SIZE, BOOKINGS_STALE_TIME_MS, HTTP_STATUS } from "@/constants";
import { queryKeys } from "@/constants/queryKeys";
import type { Booking, BookingTab, CreateBookingInput } from "@/types/booking";

const FIRST_PAGE = 1;

export const useMyBookingsInfinite = (tab: BookingTab) =>
  useInfiniteQuery({
    queryKey: queryKeys.bookings.list(tab),
    queryFn: ({ pageParam }) =>
      getMyBookings({ tab, page: pageParam, pageSize: BOOKINGS_PAGE_SIZE }),
    initialPageParam: FIRST_PAGE,
    getNextPageParam: lastPage =>
      lastPage.hasNext ? lastPage.page + 1 : undefined,
    staleTime: BOOKINGS_STALE_TIME_MS,
  });

export const useBooking = (bookingId: number) =>
  useQuery({
    queryKey: queryKeys.bookings.detail(bookingId),
    queryFn: () => getBooking(bookingId),
    staleTime: BOOKINGS_STALE_TIME_MS,
    retry: false,
  });

/** Booked dates, trips and listing data (availability, prices) all change after a mutation. */
const useInvalidateAfterBookingChange = () => {
  const queryClient = useQueryClient();
  return (booking: Booking) => {
    queryClient.setQueryData(queryKeys.bookings.detail(booking.id), booking);
    void queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
    void queryClient.invalidateQueries({ queryKey: queryKeys.listings.all });
  };
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateAfterBookingChange();

  return useMutation({
    mutationFn: (input: CreateBookingInput) => postBooking(input),
    onSuccess: invalidate,
    onError: (error, input) => {
      if (isAxiosError(error) && error.response?.status === HTTP_STATUS.conflict) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.listings.unavailableDates(input.listingId),
        });
      }
    },
  });
};

export const useCancelBooking = () => {
  const invalidate = useInvalidateAfterBookingChange();

  return useMutation({
    mutationFn: (bookingId: number) => cancelBooking(bookingId),
    onSuccess: invalidate,
  });
};
