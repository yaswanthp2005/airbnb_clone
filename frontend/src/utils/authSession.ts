import type { AuthUser } from "@/types/auth";
import { STORAGE_KEYS } from "@/constants";
import { hostModeFlag } from "@/utils/storedFlag";
import { clearAuthStorage, setStorageItem } from "@/utils/storage";

export const persistAuthSession = (
  token: string,
  user: AuthUser,
): void => {
  setStorageItem(STORAGE_KEYS.authToken, token);
  setStorageItem(STORAGE_KEYS.authUserId, user.id);
  setStorageItem(STORAGE_KEYS.authUserName, user.name);
  setStorageItem(STORAGE_KEYS.authEmail, user.email);
};

export const clearAuthSession = (): void => {
  clearAuthStorage();
  hostModeFlag.set(false);
};
