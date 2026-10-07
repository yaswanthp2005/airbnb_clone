"use client";

import { useCallback, useEffect } from "react";

import { useAuth } from "@/hooks/useAuth";

/** Opens the login modal when the session is loaded and the user is signed out. */
export const useAuthGate = () => {
  const { isAuthenticated, isBootstrapping, openAuthModal } = useAuth();

  useEffect(() => {
    if (!isBootstrapping && !isAuthenticated) {
      openAuthModal("login");
    }
  }, [isAuthenticated, isBootstrapping, openAuthModal]);

  return { isAuthenticated, isBootstrapping };
};

export const useRequireAuth = () => {
  const { isAuthenticated, openAuthModal } = useAuth();

  return useCallback(
    (action: () => void) => {
      if (!isAuthenticated) {
        openAuthModal("login", action);
        return;
      }
      action();
    },
    [isAuthenticated, openAuthModal],
  );
};
