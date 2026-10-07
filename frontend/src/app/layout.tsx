import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import en from "@/common/i18n/en.json";
import Providers from "@/app/providers";
import AppHeader from "@/components/layout/AppHeader";
import Footer from "@/components/layout/Footer";
import MobileTabBar from "@/components/layout/MobileTabBar";
import { THEME_BROWSER_COLORS } from "@/constants/theme";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: en.common.appName,
  description: en.common.appName,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: THEME_BROWSER_COLORS.light },
    { media: "(prefers-color-scheme: dark)", color: THEME_BROWSER_COLORS.dark },
  ],
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col text-ink">
        <Providers>
          <AppHeader />
          <main className="flex flex-1 flex-col">{children}</main>
          <Footer />
          <MobileTabBar />
        </Providers>
      </body>
    </html>
  );
}
