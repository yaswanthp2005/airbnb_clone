"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import CategoryBar from "@/components/layout/CategoryBar";
import MobileHeader from "@/components/layout/MobileHeader";
import Navbar from "@/components/layout/Navbar";
import HostNavbar from "@/components/layout/Navbar/HostNavbar";
import type { SearchSection } from "@/components/search/constants";
import {
  BOOK_ROUTE_PREFIX,
  BOOKING_ROUTE_PREFIX,
  HOSTING_ROUTE_PREFIX,
  LISTING_ROUTE_PREFIX,
  routes,
} from "@/constants/routes";
import { useScrollCollapse } from "@/hooks/useScrollCollapse";
import { cn } from "@/lib/utils";

const SCROLL_INTENT_EVENTS = ["wheel", "touchmove"] as const;
/** Live header height, for sticky content below it (e.g. the explore map). */
const HEADER_HEIGHT_CSS_VAR = "--app-header-height";
const NARROW_ROUTE_PREFIXES = [LISTING_ROUTE_PREFIX, BOOK_ROUTE_PREFIX, BOOKING_ROUTE_PREFIX];

const AppHeader = () => {
  const pathname = usePathname();
  const isCollapsed = useScrollCollapse();
  const isHome = pathname === routes.home;
  const isNarrowPage = NARROW_ROUTE_PREFIXES.some(prefix => pathname.startsWith(prefix));
  const isListingPage = pathname.startsWith(LISTING_ROUTE_PREFIX);
  const isHostingPage =
    pathname === HOSTING_ROUTE_PREFIX || pathname.startsWith(`${HOSTING_ROUTE_PREFIX}/`);
  const headerRef = useRef<HTMLElement>(null);
  const [activeSearchSection, setActiveSearchSection] = useState<SearchSection | null>(null);
  const [isSearchForcedOpen, setIsSearchForcedOpen] = useState(false);

  const isExpanded = (isHome && !isCollapsed) || isSearchForcedOpen;

  const handleActiveSearchSectionChange = useCallback((section: SearchSection | null) => {
    setActiveSearchSection(section);
    if (section === null) {
      setIsSearchForcedOpen(false);
    }
  }, []);

  const openSearch = (section: SearchSection) => {
    setIsSearchForcedOpen(true);
    setActiveSearchSection(section);
  };

  useEffect(() => {
    const header = headerRef.current;
    if (!header) {
      return;
    }
    const root = document.documentElement;
    const observer = new ResizeObserver(() =>
      root.style.setProperty(HEADER_HEIGHT_CSS_VAR, `${header.offsetHeight}px`),
    );
    observer.observe(header);
    return () => observer.disconnect();
  }, [isHostingPage]);

  // Scroll *intent* (not `scroll`) so the header's own height change can't close it.
  useEffect(() => {
    if (activeSearchSection === null) {
      return;
    }
    const handleScrollIntent = (event: Event) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        handleActiveSearchSectionChange(null);
      }
    };
    SCROLL_INTENT_EVENTS.forEach(type =>
      window.addEventListener(type, handleScrollIntent, { passive: true }),
    );
    return () =>
      SCROLL_INTENT_EVENTS.forEach(type =>
        window.removeEventListener(type, handleScrollIntent),
      );
  }, [activeSearchSection, handleActiveSearchSectionChange]);

  if (isHostingPage) {
    return (
      <header ref={headerRef} className="sticky top-0 z-40 border-b border-hairline bg-surface">
        <HostNavbar />
      </header>
    );
  }

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "sticky top-0 z-40 bg-surface transition-shadow",
          isHome && isCollapsed && "shadow-header",
          // On phones the listing page overlays its own back/share/save on the photos.
          isListingPage && "max-md:hidden",
        )}
      >
        <MobileHeader isHome={isHome} />
        <div className="hidden border-b border-hairline md:block">
          <Navbar
            isExpanded={isExpanded}
            activeSearchSection={isExpanded ? activeSearchSection : null}
            onActiveSearchSectionChange={handleActiveSearchSectionChange}
            onOpenSearch={openSearch}
            containerWidth={isNarrowPage ? "narrow" : "default"}
          />
        </div>
        {isHome ? (
          <Suspense fallback={<div className="h-[78px]" />}>
            <CategoryBar />
          </Suspense>
        ) : null}
      </header>
      {isSearchForcedOpen ? (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-30 bg-scrim/25 animate-in fade-in-0"
        />
      ) : null}
    </>
  );
};

export default AppHeader;
