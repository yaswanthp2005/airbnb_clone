import Link from "next/link";
import { Sparkles, type LucideIcon } from "lucide-react";

import { t } from "@/common/i18n";
import PageContainer from "@/components/layout/PageContainer";
import { routes } from "@/constants/routes";

type ComingSoonProps = {
  title?: string;
  description?: string;
  icon?: LucideIcon;
};

const ComingSoon = ({
  title = t("comingSoon.title"),
  description = t("comingSoon.description"),
  icon: Icon = Sparkles,
}: ComingSoonProps) => (
  <PageContainer className="flex flex-1 items-center justify-center py-24">
    <div className="flex max-w-md flex-col items-center text-center">
      <span className="mb-6 flex size-16 items-center justify-center rounded-full bg-surface-muted text-brand">
        <Icon className="size-8" strokeWidth={1.5} aria-hidden="true" />
      </span>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
        {t("comingSoon.title")}
      </p>
      <h1 className="mb-3 text-[32px] font-semibold leading-tight text-ink">{title}</h1>
      <p className="mb-8 text-base text-ink-muted">{description}</p>
      <Link
        href={routes.home}
        className="rounded-lg bg-ink px-6 py-3.5 text-base font-semibold text-on-ink transition-colors hover:bg-ink-strong"
      >
        {t("comingSoon.backHome")}
      </Link>
    </div>
  </PageContainer>
);

export default ComingSoon;
