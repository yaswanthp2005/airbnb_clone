"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";

import {
  getMe,
  postLogin,
  postRegister,
  type LoginPayload,
  type RegisterPayload,
} from "@/api/auth";
import { queryKeys } from "@/constants/queryKeys";
import { getAuthToken } from "@/utils/storage";
import { clearAuthSession, persistAuthSession } from "@/utils/authSession";

/**
 * Account data never goes stale on its own, so it must not outlive the account: a 401 clears the
 * token but not the cache, and the next login may be someone else.
 */
const removeAccountQueries = (queryClient: QueryClient) => {
  queryClient.removeQueries({ queryKey: queryKeys.bookings.all });
  queryClient.removeQueries({ queryKey: queryKeys.wishlist.all });
  queryClient.removeQueries({ queryKey: queryKeys.host.all });
};

/** Listing cards and details carry the viewer's `isWishlisted`. */
const invalidateViewerListingData = (queryClient: QueryClient) => {
  void queryClient.invalidateQueries({ queryKey: queryKeys.listings.lists() });
  void queryClient.invalidateQueries({ queryKey: queryKeys.listings.details() });
};

export const useMe = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.auth.session(),
    queryFn: getMe,
    enabled: enabled && Boolean(getAuthToken()),
    retry: false,
  });

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => postLogin(payload),
    onSuccess: session => {
      persistAuthSession(session.accessToken, session.user);
      removeAccountQueries(queryClient);
      queryClient.setQueryData(queryKeys.auth.session(), session.user);
      invalidateViewerListingData(queryClient);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => postRegister(payload),
    onSuccess: session => {
      persistAuthSession(session.accessToken, session.user);
      removeAccountQueries(queryClient);
      queryClient.setQueryData(queryKeys.auth.session(), session.user);
      invalidateViewerListingData(queryClient);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      clearAuthSession();
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: queryKeys.auth.all });
      removeAccountQueries(queryClient);
      invalidateViewerListingData(queryClient);
    },
  });
};
