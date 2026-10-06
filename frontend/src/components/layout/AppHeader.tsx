"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";

import CategoryBar from "@/components/layout/CategoryBar";
import Navbar from "@/components/layout/Navbar";
import { routes } from "@/constants/routes";
import { useScrollCollapse } from "@/hooks/useScrollCollapse";
import { cn } from "@/lib/utils";

const AppHeader = () => {
  const pathname = usePathname();
  const isCollapsed = useScrollCollapse();
  const isHome = pathname === routes.home;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-white transition-shadow",
        isHome && isCollapsed && "shadow-[0_1px_12px_rgba(0,0,0,0.08)]",
      )}
    >
      <div className="border-b border-hairline">
        <Navbar isExpanded={isHome && !isCollapsed} />
      </div>
      {isHome ? (
        <Suspense fallback={<div className="h-[78px]" />}>
          <CategoryBar />
        </Suspense>
      ) : null}
    </header>
  );
};

export default AppHeader;
