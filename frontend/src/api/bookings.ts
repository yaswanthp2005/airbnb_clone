import apiClient from "@/api/client";
import { apiRoutes } from "@/constants/routes";
import type { Booking, BookingTab, CreateBookingInput } from "@/types/booking";
import type { PaginatedResponse } from "@/types/listing";
import { buildUrl } from "@/utils/buildUrl";

type BookingResponseBody = {
  data: Booking;
};

export type GetMyBookingsParams = {
  tab: BookingTab;
  page: number;
  pageSize: number;
};

export const postBooking = async (input: CreateBookingInput): Promise<Booking> => {
  const { data } = await apiClient.post<BookingResponseBody>(apiRoutes.bookings, input);
  return data.data;
};

export const getMyBookings = async (
  params: GetMyBookingsParams,
): Promise<PaginatedResponse<Booking>> => {
  const { data } = await apiClient.get<PaginatedResponse<Booking>>(
    buildUrl({ path: apiRoutes.myBookings, query: params }),
  );
  return data;
};

/** The page renders its own not-found state, so no toast. */
export const getBooking = async (bookingId: number): Promise<Booking> => {
  const { data } = await apiClient.get<BookingResponseBody>(
    buildUrl({ path: apiRoutes.bookingDetail, pathParams: { id: bookingId } }),
    { skipToast: true },
  );
  return data.data;
};

export const cancelBooking = async (bookingId: number): Promise<Booking> => {
  const { data } = await apiClient.patch<BookingResponseBody>(
    buildUrl({ path: apiRoutes.bookingCancel, pathParams: { id: bookingId } }),
  );
  return data.data;
};
