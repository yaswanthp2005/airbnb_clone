import { STORAGE_KEYS } from "@/constants";
import { getStorageItem, setStorageItem } from "@/utils/storage";

type Listener = () => void;

export type StoredFlag = {
  get: () => boolean;
  /** Persists the flag and notifies this tab; other tabs hear the `storage` event. */
  set: (isOn: boolean) => void;
  subscribe: (listener: Listener) => () => void;
};

/** A boolean UI preference in localStorage that components can subscribe to. */
export const createStoredFlag = (key: string): StoredFlag => {
  const listeners = new Set<Listener>();

  return {
    get: () => getStorageItem<boolean>(key) === true,
    set: isOn => {
      setStorageItem(key, isOn ? true : null);
      listeners.forEach(listener => listener());
    },
    subscribe: listener => {
      const handleStorage = (event: StorageEvent) => {
        if (event.key === null || event.key === key) {
          listener();
        }
      };
      listeners.add(listener);
      window.addEventListener("storage", handleStorage);
      return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", handleStorage);
      };
    },
  };
};

export const hostModeFlag = createStoredFlag(STORAGE_KEYS.hostMode);
