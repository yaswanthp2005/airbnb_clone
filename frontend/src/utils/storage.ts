import { STORAGE_KEYS } from "@/constants";

export const getStorageItem = <T>(key: string): T | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) {
      return null;
    }
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export const setStorageItem = (key: string, value: unknown): void => {
  if (typeof window === "undefined") {
    return;
  }

  if (value === null || value === undefined) {
    window.localStorage.removeItem(key);
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
};

const removeStorageItem = (key: string): void => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(key);
};

export const getAuthToken = (): string | null =>
  getStorageItem<string>(STORAGE_KEYS.authToken);

export const clearAuthStorage = (): void => {
  removeStorageItem(STORAGE_KEYS.authToken);
  removeStorageItem(STORAGE_KEYS.authUserId);
  removeStorageItem(STORAGE_KEYS.authUserName);
  removeStorageItem(STORAGE_KEYS.authEmail);
};
