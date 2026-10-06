"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** `false` on the server and during hydration, `true` afterwards. */
export const useIsHydrated = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
