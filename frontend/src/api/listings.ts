import apiClient from "@/api/client";
import { apiRoutes } from "@/constants/routes";
import type {
  ListingFilterOptions,
  ListingFilters,
  ListingSummary,
  LocationSuggestion,
  PaginatedResponse,
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

type LocationSuggestionsResponseBody = {
  data: LocationSuggestion[];
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

export const getListingFilterOptions = async (
  category?: string,
): Promise<ListingFilterOptions> => {
  const { data } = await apiClient.get<FilterOptionsResponseBody>(
    buildUrl({ path: apiRoutes.listingFilterOptions, query: { category } }),
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
