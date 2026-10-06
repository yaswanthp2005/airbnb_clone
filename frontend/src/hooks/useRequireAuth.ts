"use client";

import { useCallback } from "react";

import { useAuth } from "@/hooks/useAuth";

export const useRequireAuth = () => {
  const { isAuthenticated, openAuthModal } = useAuth();

  return useCallback(
    (action: () => void) => {
      if (!isAuthenticated) {
        openAuthModal("login");
        return;
      }
      action();
    },
    [isAuthenticated, openAuthModal],
  );
};
