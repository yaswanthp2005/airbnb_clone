import apiClient from "@/api/client";
import { apiRoutes } from "@/constants/routes";
import type {
  ListingDetail,
  ListingFilterOptions,
  ListingFilters,
  ListingSummary,
  LocationSuggestion,
  PaginatedResponse,
  PropertyTypeSummary,
  Review,
} from "@/types/listing";
import { buildUrl } from "@/utils/buildUrl";

export type GetListingsParams = ListingFilters & {
  page: number;
  pageSize: number;
};

type RequestOptions = {
  skipToast?: boolean;
};

type FilterOptionsResponseBody = {
  data: ListingFilterOptions;
};

type PropertyTypesResponseBody = {
  data: PropertyTypeSummary[];
};

type LocationSuggestionsResponseBody = {
  data: LocationSuggestion[];
};

type ListingDetailResponseBody = {
  data: ListingDetail;
};

type UnavailableDatesResponseBody = {
  data: string[];
};

export type GetListingReviewsParams = {
  page: number;
  pageSize: number;
};

export type GetUnavailableDatesParams = {
  /** `yyyy-MM-dd` */
  startDate?: string;
  /** `yyyy-MM-dd` */
  endDate?: string;
};

/** Infants and pets don't count towards a listing's guest capacity. */
const toListingsQuery = ({ adults, children, ...params }: GetListingsParams) => ({
  ...params,
  infants: undefined,
  pets: undefined,
  guests: (adults ?? 0) + (children ?? 0) || undefined,
});

export const getListings = async (
  params: GetListingsParams,
  { skipToast }: RequestOptions = {},
): Promise<PaginatedResponse<ListingSummary>> => {
  const { data } = await apiClient.get<PaginatedResponse<ListingSummary>>(
    buildUrl({ path: apiRoutes.listings, query: toListingsQuery(params) }),
    { skipToast },
  );
  return data;
};

export const getListingFilterOptions = async (): Promise<ListingFilterOptions> => {
  const { data } = await apiClient.get<FilterOptionsResponseBody>(
    apiRoutes.listingFilterOptions,
  );
  return data.data;
};

export const getPropertyTypes = async (): Promise<PropertyTypeSummary[]> => {
  const { data } = await apiClient.get<PropertyTypesResponseBody>(
    apiRoutes.listingPropertyTypes,
  );
  return data.data;
};

export const getLocationSuggestions = async (
  query: string,
): Promise<LocationSuggestion[]> => {
  const { data } = await apiClient.get<LocationSuggestionsResponseBody>(
    buildUrl({ path: apiRoutes.listingLocations, query: { q: query } }),
    { skipToast: true },
  );
  return data.data;
};

/** The page renders its own not-found / error state, so no toast. */
export const getListing = async (listingId: number): Promise<ListingDetail> => {
  const { data } = await apiClient.get<ListingDetailResponseBody>(
    buildUrl({ path: apiRoutes.listingDetail, pathParams: { id: listingId } }),
    { skipToast: true },
  );
  return data.data;
};

export const getListingReviews = async (
  listingId: number,
  params: GetListingReviewsParams,
): Promise<PaginatedResponse<Review>> => {
  const { data } = await apiClient.get<PaginatedResponse<Review>>(
    buildUrl({
      path: apiRoutes.listingReviews,
      pathParams: { id: listingId },
      query: params,
    }),
  );
  return data;
};

export const getListingUnavailableDates = async (
  listingId: number,
  params: GetUnavailableDatesParams = {},
): Promise<string[]> => {
  const { data } = await apiClient.get<UnavailableDatesResponseBody>(
    buildUrl({
      path: apiRoutes.listingUnavailableDates,
      pathParams: { id: listingId },
      query: params,
    }),
  );
  return data.data;
};
