import apiClient from "@/api/client";
import { apiRoutes } from "@/constants/routes";
import type {
  ListingFilterOptions,
  ListingFilters,
  ListingSummary,
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

export const getListings = async (
  params: GetListingsParams,
  { skipToast }: RequestOptions = {},
): Promise<PaginatedResponse<ListingSummary>> => {
  const { data } = await apiClient.get<PaginatedResponse<ListingSummary>>(
    buildUrl({ path: apiRoutes.listings, query: params }),
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
