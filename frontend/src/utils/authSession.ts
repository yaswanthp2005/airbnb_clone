import type { AuthUser } from "@/types/auth";
import { STORAGE_KEYS } from "@/constants";
import { hostModeFlag } from "@/utils/storedFlag";
import {
  clearAuthStorage,
  getStorageItem,
  setStorageItem,
} from "@/utils/storage";

export const persistAuthSession = (
  token: string,
  user: AuthUser,
): void => {
  setStorageItem(STORAGE_KEYS.authToken, token);
  setStorageItem(STORAGE_KEYS.authUserId, user.id);
  setStorageItem(STORAGE_KEYS.authUserName, user.name);
  setStorageItem(STORAGE_KEYS.authEmail, user.email);
};

export const readStoredAuthUser = (): AuthUser | null => {
  const id = getStorageItem<number>(STORAGE_KEYS.authUserId);
  const name = getStorageItem<string>(STORAGE_KEYS.authUserName);
  const email = getStorageItem<string>(STORAGE_KEYS.authEmail);

  if (id === null || !name || !email) {
    return null;
  }

  return { id, name, email };
};

export const clearAuthSession = (): void => {
  clearAuthStorage();
  hostModeFlag.set(false);
};
