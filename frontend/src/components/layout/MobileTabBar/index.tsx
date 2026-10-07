"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { t } from "@/common/i18n";
import { MOBILE_TAB_BAR_HIDE_AFTER_PX } from "@/constants";
import { routes } from "@/constants/routes";
import { useIsScrollingDown } from "@/hooks/useIsScrollingDown";
import { cn } from "@/lib/utils";

import { MOBILE_TABS, TAB_BAR_HIDDEN_PREFIXES } from "./constants";

const isTabActive = (pathname: string, route: string) =>
  route === routes.home ? pathname === route : pathname === route || pathname.startsWith(`${route}/`);

/** Phone-only bottom navigation; slides away while scrolling down, back on scroll up. */
const MobileTabBar = () => {
  const pathname = usePathname();
  const isScrollingDown = useIsScrollingDown(MOBILE_TAB_BAR_HIDE_AFTER_PX);

  if (TAB_BAR_HIDDEN_PREFIXES.some(prefix => pathname.startsWith(prefix))) {
    return null;
  }

  return (
    <>
      {/* Keeps the footer clear of the fixed bar. */}
      <div aria-hidden="true" className="h-[calc(4rem+env(safe-area-inset-bottom))] md:hidden" />
      <nav
        aria-label={t("mobileNav.label")}
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-surface pb-[env(safe-area-inset-bottom)] transition-transform duration-300 md:hidden",
          isScrollingDown && "translate-y-full",
        )}
      >
        <ul className="mx-auto grid h-16 max-w-md grid-cols-4">
          {MOBILE_TABS.map(({ key, labelKey, route, icon: Icon }) => {
            const isActive = isTabActive(pathname, route);
            return (
              <li key={key}>
                <Link
                  href={route}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex h-full flex-col items-center justify-center gap-1 text-[10px] font-semibold transition-colors",
                    isActive ? "text-brand" : "text-ink-muted hover:text-ink",
                  )}
                >
                  <Icon className="size-6" strokeWidth={isActive ? 2.25 : 1.75} aria-hidden="true" />
                  {t(labelKey)}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

export default MobileTabBar;
