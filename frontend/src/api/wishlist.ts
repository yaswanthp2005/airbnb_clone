import apiClient from "@/api/client";
import { apiRoutes } from "@/constants/routes";
import type { ListingSummary, PaginatedResponse } from "@/types/listing";
import type { WishlistStatus } from "@/types/wishlist";
import { buildUrl } from "@/utils/buildUrl";

type WishlistStatusResponseBody = {
  data: WishlistStatus;
};

export type GetWishlistParams = {
  page: number;
  pageSize: number;
};

export const getWishlist = async (
  params: GetWishlistParams,
): Promise<PaginatedResponse<ListingSummary>> => {
  const { data } = await apiClient.get<PaginatedResponse<ListingSummary>>(
    buildUrl({ path: apiRoutes.wishlist, query: params }),
  );
  return data;
};

const wishlistItemUrl = (listingId: number) =>
  buildUrl({ path: apiRoutes.wishlistItem, pathParams: { id: listingId } });

export const postWishlistItem = async (listingId: number): Promise<WishlistStatus> => {
  const { data } = await apiClient.post<WishlistStatusResponseBody>(wishlistItemUrl(listingId));
  return data.data;
};

export const deleteWishlistItem = async (listingId: number): Promise<WishlistStatus> => {
  const { data } = await apiClient.delete<WishlistStatusResponseBody>(wishlistItemUrl(listingId));
  return data.data;
};
