"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import AuthModal from "@/components/auth/AuthModal";
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
  openAuthModal: (mode?: AuthMode) => void;
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
      setAuthMode("login");
      setAuthModalOpen(true);
      setTokenVersion(version => version + 1);
    });

    return () => setUnauthorizedListener(null);
  }, []);

  const openAuthModal = useCallback((mode: AuthMode = "login") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
  }, []);

  const login = useCallback(
    async (payload: LoginInput) => {
      await loginMutation.mutateAsync(payload);
      setTokenVersion(version => version + 1);
      closeAuthModal();
    },
    [closeAuthModal, loginMutation],
  );

  const register = useCallback(
    async (payload: RegisterInput) => {
      await registerMutation.mutateAsync(payload);
      setTokenVersion(version => version + 1);
      closeAuthModal();
    },
    [closeAuthModal, registerMutation],
  );

  const logout = useCallback(() => {
    logoutMutation.mutate();
    setTokenVersion(version => version + 1);
    closeAuthModal();
  }, [closeAuthModal, logoutMutation]);

  const isBootstrapping = hasToken && isMeLoading && !user;
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
