"use client";

import { useRouter } from "next/navigation";

import { t } from "@/common/i18n";
import PageContainer from "@/components/layout/PageContainer";
import { routes } from "@/constants/routes";
import { setHostMode } from "@/utils/hostMode";

import Logo from "./Logo";
import UserMenu from "./UserMenu";

const HostNavbar = () => {
  const router = useRouter();

  const switchToTraveling = () => {
    setHostMode(false);
    router.push(routes.home);
  };

  return (
    <PageContainer>
      <div className="flex h-20 items-center justify-between gap-4">
        <Logo href={routes.hosting} />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={switchToTraveling}
            className="rounded-full px-4 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface-muted"
          >
            {t("nav.switchToTraveling")}
          </button>
          <UserMenu />
        </div>
      </div>
    </PageContainer>
  );
};

export default HostNavbar;
