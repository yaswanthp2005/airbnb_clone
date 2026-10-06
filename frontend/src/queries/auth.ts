"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
      queryClient.setQueryData(queryKeys.auth.session(), session.user);
      queryClient.invalidateQueries({ queryKey: queryKeys.listings.all });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => postRegister(payload),
    onSuccess: session => {
      persistAuthSession(session.accessToken, session.user);
      queryClient.setQueryData(queryKeys.auth.session(), session.user);
      queryClient.invalidateQueries({ queryKey: queryKeys.listings.all });
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
      queryClient.invalidateQueries({ queryKey: queryKeys.listings.all });
    },
  });
};
