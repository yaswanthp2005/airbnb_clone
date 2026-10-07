"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { t } from "@/common/i18n";
import PageContainer from "@/components/layout/PageContainer";
import type { SearchSection } from "@/components/search/constants";
import SearchBar from "@/components/search/SearchBar";
import SearchPill from "@/components/search/SearchPill";
import { routes } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { cn } from "@/lib/utils";

import { HEADER_MORPH_TRANSITION_CLASS_NAME } from "./constants";
import Logo from "./Logo";
import HeaderTabs from "./HeaderTabs";
import UserMenu from "./UserMenu";

type NavbarProps = {
  isExpanded: boolean;
  activeSearchSection: SearchSection | null;
  onActiveSearchSectionChange: (section: SearchSection | null) => void;
  onOpenSearch: (section: SearchSection) => void;
  containerWidth?: "default" | "narrow";
};

const roundHoverClass =
  "rounded-full text-sm font-semibold text-ink transition-colors hover:bg-surface-muted";

const Navbar = ({
  isExpanded,
  activeSearchSection,
  onActiveSearchSectionChange,
  onOpenSearch,
  containerWidth,
}: NavbarProps) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const requireAuth = useRequireAuth();

  return (
    <PageContainer width={containerWidth}>
      <div className="grid h-20 grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="flex items-center">
          <Logo />
        </div>

        <div className="grid min-w-0 place-items-center">
          <div
            inert={!isExpanded}
            className={cn(
              "[grid-area:1/1] transition-[opacity,scale]",
              HEADER_MORPH_TRANSITION_CLASS_NAME,
              !isExpanded && "pointer-events-none scale-50 opacity-0",
            )}
          >
            <HeaderTabs />
          </div>
          {/* translate-y = distance between the h-20 row's centre and the h-16 bar's centre below it. */}
          <div
            inert={isExpanded}
            className={cn(
              "[grid-area:1/1] max-w-full transition-[opacity,translate,scale]",
              HEADER_MORPH_TRANSITION_CLASS_NAME,
              isExpanded && "pointer-events-none translate-y-18 scale-x-200 scale-y-133 opacity-0",
            )}
          >
            <Suspense fallback={<div className="h-12 w-80" />}>
              <SearchPill onSectionClick={onOpenSearch} />
            </Suspense>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          {isAuthenticated ? (
            <Link href={routes.hosting} className={`${roundHoverClass} hidden whitespace-nowrap px-4 py-3 lg:inline-flex`}>
              {t("nav.switchToHosting")}
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => requireAuth(() => router.push(routes.hosting))}
              className={`${roundHoverClass} hidden whitespace-nowrap px-4 py-3 lg:inline-flex`}
            >
              {t("nav.becomeHost")}
            </button>
          )}
          <UserMenu />
        </div>
      </div>

      <div
        className={cn(
          "grid transition-[grid-template-rows]",
          HEADER_MORPH_TRANSITION_CLASS_NAME,
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        {/* No overflow-hidden: it would clip the search panels that drop below the bar. */}
        {/* The collapsed bar still overflows below the header, so the whole subtree must ignore clicks. */}
        <div
          inert={!isExpanded}
          className={cn("min-h-0 min-w-0", !isExpanded && "pointer-events-none")}
        >
          <div className="pb-5">
            <div
              className={cn(
                "flex justify-center transition-[opacity,translate,scale]",
                HEADER_MORPH_TRANSITION_CLASS_NAME,
                !isExpanded && "-translate-y-18 scale-x-45 scale-y-75 opacity-0",
              )}
            >
              <Suspense fallback={<div className="h-16 w-[850px] max-w-full" />}>
                {/* Remount per open so each expand starts from the URL's values, as before. */}
                <SearchBar
                  key={String(isExpanded)}
                  activeSection={activeSearchSection}
                  onActiveSectionChange={onActiveSearchSectionChange}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Navbar;
