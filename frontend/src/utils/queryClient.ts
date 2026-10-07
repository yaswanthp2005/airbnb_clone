import { QueryClient } from "@tanstack/react-query";

/** Unused cache entries are dropped after this, even though they never go stale. */
const QUERY_GC_TIME_MS = 30 * 60 * 1000;

/**
 * Cached data is reused until a mutation invalidates it (or the page reloads). Queries whose
 * data other people change (booked dates, the host dashboard) set a short `staleTime`.
 */
const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        gcTime: QUERY_GC_TIME_MS,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

let browserQueryClient: QueryClient | undefined;

export const getQueryClient = (): QueryClient => {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }

  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }

  return browserQueryClient;
};
