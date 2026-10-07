import apiClient from "@/api/client";
import { apiRoutes } from "@/constants/routes";
import type {
  HostBooking,
  HostBookingTab,
  HostListing,
  HostListingInput,
  HostListingOptions,
  HostStats,
} from "@/types/host";
import type { PaginatedResponse } from "@/types/listing";
import { buildUrl } from "@/utils/buildUrl";

type DataResponseBody<T> = {
  data: T;
};

export type GetHostListingsParams = {
  page: number;
  pageSize: number;
};

export type GetHostBookingsParams = {
  tab: HostBookingTab;
  page: number;
  pageSize: number;
  listingId?: number;
};

const hostListingUrl = (listingId: number) =>
  buildUrl({ path: apiRoutes.hostListing, pathParams: { id: listingId } });

export const getHostListings = async (
  params: GetHostListingsParams,
): Promise<PaginatedResponse<HostListing>> => {
  const { data } = await apiClient.get<PaginatedResponse<HostListing>>(
    buildUrl({ path: apiRoutes.hostListings, query: params }),
  );
  return data;
};

/** The edit page renders its own not-found / forbidden state, so no toast. */
export const getHostListing = async (listingId: number): Promise<HostListing> => {
  const { data } = await apiClient.get<DataResponseBody<HostListing>>(
    hostListingUrl(listingId),
    { skipToast: true },
  );
  return data.data;
};

export const postHostListing = async (input: HostListingInput): Promise<HostListing> => {
  const { data } = await apiClient.post<DataResponseBody<HostListing>>(
    apiRoutes.hostListings,
    input,
  );
  return data.data;
};

export const putHostListing = async (
  listingId: number,
  input: HostListingInput,
): Promise<HostListing> => {
  const { data } = await apiClient.put<DataResponseBody<HostListing>>(
    hostListingUrl(listingId),
    input,
  );
  return data.data;
};

export const deleteHostListing = async (listingId: number): Promise<{ id: number }> => {
  const { data } = await apiClient.delete<DataResponseBody<{ id: number }>>(
    hostListingUrl(listingId),
  );
  return data.data;
};

export const getHostBookings = async (
  params: GetHostBookingsParams,
): Promise<PaginatedResponse<HostBooking>> => {
  const { data } = await apiClient.get<PaginatedResponse<HostBooking>>(
    buildUrl({ path: apiRoutes.hostBookings, query: params }),
  );
  return data;
};

export const getHostStats = async (): Promise<HostStats> => {
  const { data } = await apiClient.get<DataResponseBody<HostStats>>(apiRoutes.hostStats);
  return data.data;
};

export const getHostListingOptions = async (): Promise<HostListingOptions> => {
  const { data } = await apiClient.get<DataResponseBody<HostListingOptions>>(
    apiRoutes.hostListingOptions,
  );
  return data.data;
};
