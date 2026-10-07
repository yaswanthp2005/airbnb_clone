"use client";

import { useEffect } from "react";

import { inter } from "@/app/fonts";
import { t } from "@/common/i18n";
import ErrorFallback, { type ErrorBoundaryProps } from "@/components/common/ErrorFallback";
import { STORAGE_KEYS } from "@/constants";

import "./globals.css";

const DARK_SCHEME_QUERY = "(prefers-color-scheme: dark)";

/** Replaces the root layout (and its ThemeProvider), so it applies the saved theme itself. */
export default function GlobalError(props: ErrorBoundaryProps) {
  useEffect(() => {
    let saved: string | null = null;
    try {
      // next-themes stores a raw string, not JSON, so `getStorageItem` can't read it.
      saved = window.localStorage.getItem(STORAGE_KEYS.theme);
    } catch {
      // Storage blocked (privacy mode): fall back to the OS scheme.
    }
    const isDark = saved === "dark" || (saved !== "light" && window.matchMedia(DARK_SCHEME_QUERY).matches);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="flex min-h-screen flex-col bg-surface text-ink">
        <title>{t("errorPage.title")}</title>
        <ErrorFallback {...props} />
      </body>
    </html>
  );
}
