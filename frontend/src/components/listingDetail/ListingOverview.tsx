import { Star } from "lucide-react";

import { t } from "@/common/i18n";
import type { ListingDetail } from "@/types/listing";

import { RATING_DECIMALS, SECTION_IDS } from "./constants";
import { pluralize } from "./utils";

type ListingOverviewProps = {
  listing: ListingDetail;
};

const ListingOverview = ({ listing }: ListingOverviewProps) => {
  const details = [
    pluralize(listing.maxGuests, "listingDetail.overview.guests"),
    pluralize(listing.bedrooms, "listingDetail.overview.bedrooms"),
    pluralize(listing.beds, "listingDetail.overview.beds"),
    pluralize(listing.bathrooms, "listingDetail.overview.baths"),
  ];
  const hasReviews = listing.reviewCount > 0;

  return (
    <section className="pb-8">
      <h2 className="text-[22px] font-semibold leading-7 text-ink">
        {t("listingDetail.overview.heading", {
          propertyType: listing.propertyType.toLowerCase(),
          city: listing.city,
          country: listing.country,
        })}
      </h2>
      <p className="mt-1 text-base text-ink">{details.join(" · ")}</p>
      <p className="mt-2 flex items-center gap-1 text-base font-semibold text-ink">
        <Star className="size-3.5 fill-ink" aria-hidden="true" />
        {hasReviews ? (
          <>
            <span>{listing.ratingAvg.toFixed(RATING_DECIMALS)}</span>
            <span aria-hidden="true">·</span>
            <a href={`#${SECTION_IDS.reviews}`} className="underline underline-offset-2">
              {pluralize(listing.reviewCount, "listingDetail.overview.reviews")}
            </a>
          </>
        ) : (
          <span>{t("listingDetail.overview.new")}</span>
        )}
      </p>
    </section>
  );
};

export default ListingOverview;
