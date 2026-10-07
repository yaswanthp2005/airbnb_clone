"use client";

import { useSyncExternalStore } from "react";

import { getHostMode, subscribeHostMode } from "@/utils/hostMode";

/** Every user starts as a guest; `false` on the server and during hydration. */
export const useHostMode = () =>
  useSyncExternalStore(subscribeHostMode, getHostMode, () => false);
