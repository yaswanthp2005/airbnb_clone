import { MutationCache, QueryClient } from "@tanstack/react-query";

/** Unused cache entries are dropped after this, even though they never go stale. */
const QUERY_GC_TIME_MS = 30 * 60 * 1000;

const QUERY_SYNC_CHANNEL = "airbnb-query-sync";
const QUERY_SYNC_MESSAGE = "mutated";

/**
 * Cached data is reused until a mutation invalidates it (or the page reloads). Queries whose
 * data other people change (booked dates, the host dashboard) set a short `staleTime`.
 */
const makeQueryClient = (onMutationSuccess?: () => void) =>
  new QueryClient({
    mutationCache: new MutationCache({ onSuccess: () => onMutationSuccess?.() }),
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

/**
 * Listings open in new tabs, and each tab has its own cache: a save, booking or login in one tab
 * tells the others to refetch, since their data would otherwise never go stale.
 */
const makeBrowserQueryClient = () => {
  if (typeof BroadcastChannel === "undefined") {
    return makeQueryClient();
  }
  const channel = new BroadcastChannel(QUERY_SYNC_CHANNEL);
  const client = makeQueryClient(() => channel.postMessage(QUERY_SYNC_MESSAGE));
  channel.onmessage = ({ data }) => {
    if (data === QUERY_SYNC_MESSAGE) {
      void client.invalidateQueries();
    }
  };
  return client;
};

export const getQueryClient = (): QueryClient => {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }

  if (!browserQueryClient) {
    browserQueryClient = makeBrowserQueryClient();
  }

  return browserQueryClient;
};
