"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";

import AuthProvider from "@/components/auth/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import { STORAGE_KEYS } from "@/constants";
import { DEFAULT_THEME } from "@/constants/theme";
import { getQueryClient } from "@/utils/queryClient";

type ProvidersProps = {
  children: React.ReactNode;
};

const Providers = ({ children }: ProvidersProps) => {
  const queryClient = getQueryClient();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={DEFAULT_THEME}
      enableSystem
      disableTransitionOnChange
      storageKey={STORAGE_KEYS.theme}
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {children}
          <Toaster richColors closeButton position="top-center" />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default Providers;
