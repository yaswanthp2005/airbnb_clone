"use client";

import { useSyncExternalStore } from "react";

import type { StoredFlag } from "@/utils/storedFlag";

/** `false` on the server and during hydration, then the stored value. */
export const useStoredFlag = (flag: StoredFlag) =>
  useSyncExternalStore(flag.subscribe, flag.get, () => false);
