import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";

export const THEMES = ["light", "dark", "system"] as const;
export type Theme = (typeof THEMES)[number];

export const DEFAULT_THEME: Theme = "system";

export type ThemeOption = {
  value: Theme;
  labelKey: string;
  icon: LucideIcon;
};

export const THEME_OPTIONS: ThemeOption[] = [
  { value: "light", labelKey: "theme.light", icon: Sun },
  { value: "dark", labelKey: "theme.dark", icon: Moon },
  { value: "system", labelKey: "theme.system", icon: Monitor },
];

/** Browser chrome colour (`<meta name="theme-color">`); mirrors `--surface` in globals.css. */
export const THEME_BROWSER_COLORS = {
  light: "#ffffff",
  dark: "#121212",
} as const;
