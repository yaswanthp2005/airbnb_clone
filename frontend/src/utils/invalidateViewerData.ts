import type { QueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/constants/queryKeys";

export type ViewerDataScope = {
  listings?: boolean;
  bookings?: boolean;
  wishlist?: boolean;
  host?: boolean;
};

/** After data that affects signed-in views (trips, wishlists, ratings, host dashboard). */
export const invalidateViewerData = (
  queryClient: QueryClient,
  scope: ViewerDataScope = {
    listings: true,
    bookings: true,
    wishlist: true,
    host: true,
  },
) => {
  if (scope.listings) {
    void queryClient.invalidateQueries({ queryKey: queryKeys.listings.all });
  }
  if (scope.bookings) {
    void queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
  }
  if (scope.wishlist) {
    void queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all });
  }
  if (scope.host) {
    void queryClient.invalidateQueries({ queryKey: queryKeys.host.all });
  }
};
