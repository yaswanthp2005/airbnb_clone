import { STORAGE_KEYS } from "@/constants";
import { getStorageItem, setStorageItem } from "@/utils/storage";

type Listener = () => void;

const listeners = new Set<Listener>();

export const getHostMode = (): boolean => getStorageItem<boolean>(STORAGE_KEYS.hostMode) === true;

/** Persists the mode and notifies this tab; other tabs hear the `storage` event. */
export const setHostMode = (isHostMode: boolean): void => {
  setStorageItem(STORAGE_KEYS.hostMode, isHostMode ? true : null);
  listeners.forEach(listener => listener());
};

export const subscribeHostMode = (listener: Listener): (() => void) => {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === STORAGE_KEYS.hostMode) {
      listener();
    }
  };
  listeners.add(listener);
  window.addEventListener("storage", handleStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
};
