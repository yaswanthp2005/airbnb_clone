"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import AuthModal from "@/components/auth/AuthModal";
import { useIsHydrated } from "@/hooks/useIsHydrated";
import {
  useLogin,
  useLogout,
  useMe,
  useRegister,
} from "@/queries/auth";
import type { AuthMode, AuthUser } from "@/types/auth";
import { setUnauthorizedListener } from "@/utils/authEvents";
import { clearAuthSession } from "@/utils/authSession";
import { getAuthToken } from "@/utils/storage";

type LoginInput = { email: string; password: string };
type RegisterInput = { name: string; email: string; password: string };

export type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  authModalOpen: boolean;
  authMode: AuthMode;
  isSubmitting: boolean;
  /** `onAuthenticated` runs once the user logs in or signs up; dismissing the modal drops it. */
  openAuthModal: (mode?: AuthMode, onAuthenticated?: () => void) => void;
  closeAuthModal: () => void;
  setAuthMode: (mode: AuthMode) => void;
  login: (payload: LoginInput) => Promise<void>;
  register: (payload: RegisterInput) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [tokenVersion, setTokenVersion] = useState(0);
  const pendingActionRef = useRef<(() => void) | null>(null);
  const isHydrated = useIsHydrated();

  const hasToken = useMemo(() => {
    void tokenVersion;
    return Boolean(getAuthToken());
  }, [tokenVersion]);

  const {
    data: user,
    isLoading: isMeLoading,
    isError: isMeError,
  } = useMe(hasToken);

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  useEffect(() => {
    if (isMeError && hasToken) {
      clearAuthSession();
    }
  }, [hasToken, isMeError]);

  useEffect(() => {
    setUnauthorizedListener(() => {
      pendingActionRef.current = null;
      setAuthMode("login");
      setAuthModalOpen(true);
      setTokenVersion(version => version + 1);
    });

    return () => setUnauthorizedListener(null);
  }, []);

  const openAuthModal = useCallback(
    (mode: AuthMode = "login", onAuthenticated?: () => void) => {
      pendingActionRef.current = onAuthenticated ?? null;
      setAuthMode(mode);
      setAuthModalOpen(true);
    },
    [],
  );

  const closeAuthModal = useCallback(() => {
    pendingActionRef.current = null;
    setAuthModalOpen(false);
  }, []);

  const completeAuthentication = useCallback(() => {
    const pendingAction = pendingActionRef.current;
    setTokenVersion(version => version + 1);
    closeAuthModal();
    pendingAction?.();
  }, [closeAuthModal]);

  const login = useCallback(
    async (payload: LoginInput) => {
      await loginMutation.mutateAsync(payload);
      completeAuthentication();
    },
    [completeAuthentication, loginMutation],
  );

  const register = useCallback(
    async (payload: RegisterInput) => {
      await registerMutation.mutateAsync(payload);
      completeAuthentication();
    },
    [completeAuthentication, registerMutation],
  );

  const logout = useCallback(() => {
    logoutMutation.mutate();
    setTokenVersion(version => version + 1);
    closeAuthModal();
  }, [closeAuthModal, logoutMutation]);

  // The token lives in localStorage, so the server (and hydration) can't know the session yet.
  const isBootstrapping = !isHydrated || (hasToken && isMeLoading && !user);
  const isAuthenticated = hasToken && Boolean(user) && !isMeError;

  const value = useMemo<AuthContextValue>(
    () => ({
      user: user ?? null,
      isAuthenticated,
      isBootstrapping,
      authModalOpen,
      authMode,
      isSubmitting: loginMutation.isPending || registerMutation.isPending,
      openAuthModal,
      closeAuthModal,
      setAuthMode,
      login,
      register,
      logout,
    }),
    [
      authModalOpen,
      authMode,
      closeAuthModal,
      isAuthenticated,
      isBootstrapping,
      login,
      loginMutation.isPending,
      logout,
      openAuthModal,
      register,
      registerMutation.isPending,
      user,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthModal />
    </AuthContext.Provider>
  );
};

export default AuthProvider;
