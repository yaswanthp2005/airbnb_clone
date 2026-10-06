import type { Metadata } from "next";
import { Inter } from "next/font/google";

import en from "@/common/i18n/en.json";
import Providers from "@/app/providers";
import AppHeader from "@/components/layout/AppHeader";
import Footer from "@/components/layout/Footer";

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
        </Providers>
      </body>
    </html>
  );
}
