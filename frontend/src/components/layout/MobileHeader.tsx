import { Suspense } from "react";

import PageContainer from "@/components/layout/PageContainer";
import MobileSearch from "@/components/search/MobileSearch";
import { cn } from "@/lib/utils";

import Logo from "./Navbar/Logo";

type MobileHeaderProps = {
  isExplore: boolean;
};

/** Phone header: home and search results get the search pill; other pages get a slim logo bar. */
const MobileHeader = ({ isExplore }: MobileHeaderProps) => (
  <div className={cn("md:hidden", !isExplore && "border-b border-hairline")}>
    {isExplore ? (
      <div className="px-6 pb-1 pt-4">
        <Suspense fallback={<div className="h-[50px] rounded-full bg-surface-muted" />}>
          <MobileSearch variant="pill" />
        </Suspense>
      </div>
    ) : (
      <PageContainer>
        <div className="flex h-16 items-center justify-between">
          <Logo />
          <Suspense fallback={<div className="size-10" />}>
            <MobileSearch variant="icon" />
          </Suspense>
        </div>
      </PageContainer>
    )}
  </div>
);

export default MobileHeader;
