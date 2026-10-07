import Link from "next/link";
import { SearchX } from "lucide-react";

import { t } from "@/common/i18n";
import PageContainer from "@/components/layout/PageContainer";
import { routes } from "@/constants/routes";

const ListingUnavailable = () => (
  <PageContainer className="flex flex-1 items-center justify-center py-24">
    <div className="flex max-w-md flex-col items-center text-center">
      <span className="mb-6 flex size-16 items-center justify-center rounded-full bg-surface-muted text-brand">
        <SearchX className="size-8" strokeWidth={1.5} aria-hidden="true" />
      </span>
      <h1 className="mb-3 text-[32px] font-semibold leading-tight text-ink">
        {t("listingDetail.unavailable.title")}
      </h1>
      <p className="mb-8 text-base text-ink-muted">{t("listingDetail.unavailable.description")}</p>
      <Link
        href={routes.home}
        className="rounded-lg bg-ink px-6 py-3.5 text-base font-semibold text-on-ink transition-colors hover:bg-ink-strong"
      >
        {t("listingDetail.unavailable.backHome")}
      </Link>
    </div>
  </PageContainer>
);

export default ListingUnavailable;
