import { Star } from "lucide-react";

import { t } from "@/common/i18n";
import type { ListingHost } from "@/types/listing";

import { HOST_RATING_DECIMALS } from "./constants";
import UserAvatar from "./UserAvatar";
import { firstName, pluralize, yearsSince } from "./utils";

type MeetHostProps = {
  host: ListingHost;
};

const Stat = ({ value, label }: { value: React.ReactNode; label: string }) => (
  <div className="flex flex-col-reverse py-3 first:pt-0 last:pb-0">
    <dt className="text-[10px] font-semibold text-ink">{label}</dt>
    <dd className="flex items-center gap-1 text-[22px] font-bold leading-6 text-ink">{value}</dd>
  </div>
);

const MeetHost = ({ host }: MeetHostProps) => (
  <section className="border-t border-hairline py-12">
    <h2 className="text-[22px] font-semibold text-ink">{t("listingDetail.host.meetYourHost")}</h2>
    <div className="mt-8 grid gap-10 md:grid-cols-[minmax(0,380px)_minmax(0,1fr)] md:items-center md:gap-16">
      <div className="grid grid-cols-[1fr_auto] items-center gap-6 rounded-3xl bg-white px-6 py-8 shadow-card">
        <div className="flex flex-col items-center text-center">
          <UserAvatar name={host.name} avatarUrl={host.avatarUrl} className="size-24" />
          <p className="mt-3 text-[28px] font-bold leading-8 text-ink">{firstName(host.name)}</p>
          <p className="text-sm font-semibold text-ink">{t("listingDetail.host.host")}</p>
        </div>
        <dl className="flex w-28 flex-col divide-y divide-hairline">
          <Stat value={host.reviewCount} label={t("listingDetail.host.reviews")} />
          <Stat
            value={
              <>
                {host.ratingAvg.toFixed(HOST_RATING_DECIMALS)}
                <Star className="size-3 fill-ink" aria-hidden="true" />
              </>
            }
            label={t("listingDetail.host.rating")}
          />
          <Stat value={yearsSince(host.joinedAt)} label={t("listingDetail.host.yearsHosting")} />
        </dl>
      </div>
      <div className="flex flex-col gap-3">
        {host.bio ? <p className="text-base leading-6 text-ink">{host.bio}</p> : null}
        <p className="text-sm text-ink-muted">
          {pluralize(host.listingCount, "listingDetail.host.listings")}
        </p>
      </div>
    </div>
  </section>
);

export default MeetHost;
