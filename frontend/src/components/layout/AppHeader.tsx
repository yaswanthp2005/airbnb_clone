"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import CategoryBar from "@/components/layout/CategoryBar";
import Navbar from "@/components/layout/Navbar";
import type { SearchSection } from "@/components/search/constants";
import { routes } from "@/constants/routes";
import { useScrollCollapse } from "@/hooks/useScrollCollapse";
import { cn } from "@/lib/utils";

const SCROLL_INTENT_EVENTS = ["wheel", "touchmove"] as const;

const AppHeader = () => {
  const pathname = usePathname();
  const isCollapsed = useScrollCollapse();
  const isHome = pathname === routes.home;
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

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "sticky top-0 z-40 bg-white transition-shadow",
          isHome && isCollapsed && "shadow-[0_1px_12px_rgba(0,0,0,0.08)]",
        )}
      >
        <div className="border-b border-hairline">
          <Navbar
            isExpanded={isExpanded}
            activeSearchSection={isExpanded ? activeSearchSection : null}
            onActiveSearchSectionChange={handleActiveSearchSectionChange}
            onOpenSearch={openSearch}
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
          className="fixed inset-0 z-30 bg-black/25 animate-in fade-in-0"
        />
      ) : null}
    </>
  );
};

export default AppHeader;
