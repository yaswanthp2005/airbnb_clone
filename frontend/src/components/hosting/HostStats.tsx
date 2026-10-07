"use client";

import { CalendarCheck, House, IndianRupee, Star, type LucideIcon } from "lucide-react";

import { t } from "@/common/i18n";
import { RATING_DECIMALS } from "@/components/listingDetail/constants";
import { pluralize } from "@/components/listingDetail/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useHostStats } from "@/queries/host";
import { formatPrice } from "@/utils/formatPrice";

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
};

const StatCard = ({ icon: Icon, label, value, hint }: StatCardProps) => (
  <div className="flex flex-col gap-2 rounded-xl border border-hairline bg-surface p-5">
    <div className="flex items-center gap-2 text-sm text-ink-muted">
      <Icon className="size-4" aria-hidden="true" />
      <span>{label}</span>
    </div>
    <p className="text-2xl font-semibold text-ink">{value}</p>
    {hint ? <p className="text-xs text-ink-muted">{hint}</p> : null}
  </div>
);

const STAT_COUNT = 4;

const HostStats = () => {
  const { data: stats, isPending, isError } = useHostStats();

  if (isError) {
    return null;
  }

  if (isPending) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-busy="true">
        {Array.from({ length: STAT_COUNT }, (_, index) => (
          <Skeleton key={index} className="h-[118px] rounded-xl" />
        ))}
      </div>
    );
  }

  const hasReviews = stats.reviewCount > 0;

  return (
    <section aria-label={t("hosting.stats.label")} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard icon={House} label={t("hosting.stats.listings")} value={String(stats.listingCount)} />
      <StatCard
        icon={CalendarCheck}
        label={t("hosting.stats.upcomingReservations")}
        value={String(stats.upcomingReservations)}
      />
      <StatCard
        icon={IndianRupee}
        label={t("hosting.stats.earnings")}
        value={formatPrice(stats.totalEarnings)}
        hint={t("hosting.stats.earningsHint")}
      />
      <StatCard
        icon={Star}
        label={t("hosting.stats.rating")}
        value={hasReviews ? stats.ratingAvg.toFixed(RATING_DECIMALS) : t("hosting.stats.noRating")}
        hint={
          hasReviews
            ? pluralize(stats.reviewCount, "hosting.stats.reviewCount")
            : t("hosting.stats.noReviews")
        }
      />
    </section>
  );
};

export default HostStats;
