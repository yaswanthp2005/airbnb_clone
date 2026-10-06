"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";

import { t } from "@/common/i18n";
import PageContainer from "@/components/layout/PageContainer";
import { routes } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { useRequireAuth } from "@/hooks/useRequireAuth";

import Logo from "./Logo";
import SearchPill from "./SearchPill";
import StaysTab from "./StaysTab";
import UserMenu from "./UserMenu";

type NavbarProps = {
  isExpanded: boolean;
};

const roundHoverClass =
  "rounded-full text-sm font-semibold text-ink transition-colors hover:bg-surface-muted";

const Navbar = ({ isExpanded }: NavbarProps) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const requireAuth = useRequireAuth();

  return (
    <PageContainer>
      <div className="grid h-20 grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="flex items-center">
          <Logo />
        </div>

        <div className="flex justify-center">
          {isExpanded ? <StaysTab /> : <SearchPill />}
        </div>

        <div className="flex items-center justify-end gap-1">
          {isAuthenticated ? (
            <Link href={routes.hosting} className={`${roundHoverClass} hidden px-4 py-3 md:inline-flex`}>
              {t("nav.switchToHosting")}
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => requireAuth(() => router.push(routes.hosting))}
              className={`${roundHoverClass} hidden px-4 py-3 md:inline-flex`}
            >
              {t("nav.hostYourHome")}
            </button>
          )}
          <button
            type="button"
            aria-label={t("nav.languageAndRegion")}
            className={`${roundHoverClass} mr-2 flex size-10 items-center justify-center`}
          >
            <Globe className="size-4" aria-hidden="true" />
          </button>
          <UserMenu />
        </div>
      </div>

      {isExpanded ? (
        <div className="flex justify-center pb-5">
          <SearchPill />
        </div>
      ) : null}
    </PageContainer>
  );
};

export default Navbar;
