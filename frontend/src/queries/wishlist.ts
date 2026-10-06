"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
  type QueryKey,
} from "@tanstack/react-query";

import { deleteWishlistItem, getWishlist, postWishlistItem } from "@/api/wishlist";
import { WISHLIST_PAGE_SIZE } from "@/constants";
import { queryKeys } from "@/constants/queryKeys";
import type { ListingDetail, ListingSummary, PaginatedResponse } from "@/types/listing";

const FIRST_PAGE = 1;

type ListingPages = InfiniteData<PaginatedResponse<ListingSummary>>;

export type ToggleWishlistInput = {
  listingId: number;
  /** The state to move to. */
  isWishlisted: boolean;
};

type ToggleWishlistContext = {
  snapshots: [QueryKey, unknown][];
  /** A listings refetch (e.g. right after login) was cancelled and must be redone. */
  cancelledListingsRefetch: boolean;
};

export const useWishlistInfinite = () =>
  useInfiniteQuery({
    queryKey: queryKeys.wishlist.list(),
    queryFn: ({ pageParam }) => getWishlist({ page: pageParam, pageSize: WISHLIST_PAGE_SIZE }),
    initialPageParam: FIRST_PAGE,
    getNextPageParam: lastPage =>
      lastPage.hasNext ? lastPage.page + 1 : undefined,
  });

const updatePages = (
  data: ListingPages | undefined,
  update: (page: PaginatedResponse<ListingSummary>) => PaginatedResponse<ListingSummary>,
) => (data ? { ...data, pages: data.pages.map(update) } : data);

/**
 * Flips the heart everywhere it's cached (feed pages, the detail page, the wishlist) before the
 * request finishes, and restores the snapshots if it fails.
 */
export const useToggleWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, ToggleWishlistInput, ToggleWishlistContext>({
    mutationFn: ({ listingId, isWishlisted }) =>
      isWishlisted ? postWishlistItem(listingId) : deleteWishlistItem(listingId),

    onMutate: async ({ listingId, isWishlisted }) => {
      const detailKey = queryKeys.listings.detail(listingId);
      const cancelledListingsRefetch =
        queryClient.isFetching({ queryKey: queryKeys.listings.all }) > 0;

      await Promise.all([
        queryClient.cancelQueries({ queryKey: queryKeys.listings.lists() }),
        queryClient.cancelQueries({ queryKey: detailKey }),
        queryClient.cancelQueries({ queryKey: queryKeys.wishlist.all }),
      ]);

      const snapshots = [
        ...queryClient.getQueriesData({ queryKey: queryKeys.listings.lists() }),
        ...queryClient.getQueriesData({ queryKey: detailKey }),
        ...queryClient.getQueriesData({ queryKey: queryKeys.wishlist.all }),
      ];

      queryClient.setQueriesData<ListingPages>({ queryKey: queryKeys.listings.lists() }, data =>
        updatePages(data, page => ({
          ...page,
          items: page.items.map(item =>
            item.id === listingId ? { ...item, isWishlisted } : item,
          ),
        })),
      );
      queryClient.setQueryData<ListingDetail>(detailKey, data =>
        data ? { ...data, isWishlisted } : data,
      );
      if (!isWishlisted) {
        queryClient.setQueriesData<ListingPages>({ queryKey: queryKeys.wishlist.all }, data => {
          const isSaved = data?.pages.some(page => page.items.some(item => item.id === listingId));
          return isSaved
            ? updatePages(data, page => ({
                ...page,
                items: page.items.filter(item => item.id !== listingId),
                total: page.total - 1,
              }))
            : data;
        });
      }

      return { snapshots, cancelledListingsRefetch };
    },

    onError: (_error, _input, context) => {
      context?.snapshots.forEach(([key, data]) => queryClient.setQueryData(key, data));
    },

    onSettled: (_data, _error, _input, context) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all });
      if (context?.cancelledListingsRefetch) {
        void queryClient.invalidateQueries({ queryKey: queryKeys.listings.all });
      }
    },
  });
};
