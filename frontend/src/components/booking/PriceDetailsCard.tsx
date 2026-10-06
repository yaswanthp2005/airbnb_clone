import Image from "next/image";
import { Star } from "lucide-react";

import { t } from "@/common/i18n";
import PriceBreakdownList from "@/components/listingDetail/BookingCard/PriceBreakdownList";
import { RATING_DECIMALS } from "@/components/listingDetail/constants";
import { pluralize } from "@/components/listingDetail/utils";
import type { ListingDetail } from "@/types/listing";
import type { PriceBreakdown } from "@/utils/pricing";

import { CHECKOUT_PHOTO_SIZES } from "./constants";

type PriceDetailsCardProps = {
  listing: ListingDetail;
  breakdown: PriceBreakdown | null;
};

const PriceDetailsCard = ({ listing, breakdown }: PriceDetailsCardProps) => (
  <div className="rounded-xl border border-hairline bg-white p-6">
    <div className="flex gap-4 border-b border-hairline pb-6">
      <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
        {listing.photos[0] ? (
          <Image src={listing.photos[0]} alt={listing.title} fill sizes={CHECKOUT_PHOTO_SIZES} loading="eager" className="object-cover" />
        ) : null}
      </div>
      <div className="flex min-w-0 flex-col justify-between">
        <div>
          <p className="text-xs text-ink-muted">{listing.propertyType}</p>
          <p className="line-clamp-2 text-sm font-medium text-ink">{listing.title}</p>
        </div>
        {listing.reviewCount > 0 ? (
          <p className="flex items-center gap-1 text-xs text-ink">
            <Star className="size-3 fill-ink" aria-hidden="true" />
            <span className="font-semibold">{listing.ratingAvg.toFixed(RATING_DECIMALS)}</span>
            <span className="text-ink-muted">
              ({pluralize(listing.reviewCount, "listingDetail.overview.reviews")})
            </span>
          </p>
        ) : null}
      </div>
    </div>

    <h2 className="mt-6 text-[22px] font-semibold text-ink">{t("checkout.priceDetails")}</h2>
    {breakdown ? (
      <PriceBreakdownList breakdown={breakdown} totalLabel={t("checkout.totalInr")} className="mt-4" />
    ) : (
      <p className="mt-4 text-base text-ink-muted">{t("listingDetail.booking.addDatesForPrices")}</p>
    )}
  </div>
);

export default PriceDetailsCard;
