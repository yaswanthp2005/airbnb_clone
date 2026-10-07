"use client";

import { useTheme } from "next-themes";

import { THEMES, type Theme } from "@/constants/theme";

import { useIsHydrated } from "./useIsHydrated";

const isTheme = (value: string | undefined): value is Theme =>
  THEMES.some(theme => theme === value);

/** The saved preference is only known in the browser, so it's `undefined` until hydration. */
export const useThemePreference = () => {
  const { theme, setTheme } = useTheme();
  const isHydrated = useIsHydrated();

  return {
    theme: isHydrated && isTheme(theme) ? theme : undefined,
    setTheme: (next: Theme) => setTheme(next),
  };
};
