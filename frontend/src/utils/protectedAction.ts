import type { AuthMode } from "@/types/auth";

type ProtectedActionOptions = {
  isAuthenticated: boolean;
  openAuthModal: (mode?: AuthMode, onAuthenticated?: () => void) => void;
  mode?: AuthMode;
};

export const runProtectedAction = (
  action: () => void,
  { isAuthenticated, openAuthModal, mode = "login" }: ProtectedActionOptions,
): void => {
  if (!isAuthenticated) {
    openAuthModal(mode, action);
    return;
  }
  action();
};
