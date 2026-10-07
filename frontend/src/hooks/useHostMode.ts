"use client";

import { hostModeFlag } from "@/utils/storedFlag";

import { useStoredFlag } from "./useStoredFlag";

/** Every user starts as a guest. */
export const useHostMode = () => useStoredFlag(hostModeFlag);
