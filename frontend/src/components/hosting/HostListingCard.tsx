import Link from "next/link";
import { ExternalLink, Pencil, Star, Trash2 } from "lucide-react";

import { t } from "@/common/i18n";
import RemoteImage from "@/components/common/RemoteImage";
import { RATING_DECIMALS } from "@/components/listingDetail/constants";
import { pluralize } from "@/components/listingDetail/utils";
import { hostingEditListingRoute, listingRoute } from "@/constants/routes";
import type { HostListing } from "@/types/host";
import { formatPrice } from "@/utils/formatPrice";

import { HOST_LISTING_PHOTO_SIZES } from "./constants";

type HostListingCardProps = {
  listing: HostListing;
  onDelete: (listing: HostListing) => void;
  isEager?: boolean;
};

const actionClassName =
  "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-ink transition-colors hover:bg-surface-muted";

const HostListingCard = ({ listing, onDelete, isEager = false }: HostListingCardProps) => {
  const coverPhoto = listing.photos[0];
  const editHref = hostingEditListingRoute(listing.id);

  return (
    <article
      data-listing-id={listing.id}
      className="flex w-full flex-col overflow-hidden rounded-xl border border-hairline bg-surface-raised shadow-card-soft"
    >
      <Link href={editHref} className="group block" aria-label={t("hosting.listings.editLabel", { title: listing.title })}>
        <div className="relative aspect-[3/2] w-full overflow-hidden bg-surface-muted">
          {coverPhoto ? (
            <RemoteImage
              src={coverPhoto}
              alt={t("hosting.listings.photoAlt", { title: listing.title })}
              fill
              sizes={HOST_LISTING_PHOTO_SIZES}
              loading={isEager ? "eager" : "lazy"}
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : null}
          <span className="absolute left-3 top-3 rounded-full bg-surface px-3 py-1 text-xs font-semibold text-ink shadow-sm">
            {listing.propertyType}
          </span>
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-base font-semibold text-ink">{listing.title}</h3>
          <span className="flex shrink-0 items-center gap-1 text-sm text-ink">
            {listing.reviewCount > 0 ? (
              <>
                <Star className="size-3 fill-current" aria-hidden="true" />
                {listing.ratingAvg.toFixed(RATING_DECIMALS)}
              </>
            ) : (
              t("hosting.listings.newBadge")
            )}
          </span>
        </div>
        <p className="text-sm text-ink-muted">
          {listing.city}, {listing.state}
        </p>
        <p className="text-sm text-ink">
          <span className="font-semibold">
            {t("hosting.listings.perNight", { price: formatPrice(listing.pricePerNight) })}
          </span>
        </p>
        <p className="text-sm text-ink-muted">
          {listing.upcomingBookingCount > 0
            ? pluralize(listing.upcomingBookingCount, "hosting.listings.upcoming")
            : t("hosting.listings.noUpcoming")}
        </p>
      </div>
      <div className="flex items-center gap-1 border-t border-hairline px-2 py-2">
        <Link href={editHref} className={actionClassName}>
          <Pencil className="size-3.5" aria-hidden="true" />
          {t("hosting.listings.edit")}
        </Link>
        <Link
          href={listingRoute(listing.slug)}
          aria-label={t("hosting.listings.viewLabel", { title: listing.title })}
          className={actionClassName}
        >
          <ExternalLink className="size-3.5" aria-hidden="true" />
          {t("hosting.listings.view")}
        </Link>
        <button
          type="button"
          onClick={() => onDelete(listing)}
          aria-label={t("hosting.listings.deleteLabel", { title: listing.title })}
          className={`${actionClassName} ml-auto text-brand`}
        >
          <Trash2 className="size-3.5" aria-hidden="true" />
          {t("hosting.listings.delete")}
        </button>
      </div>
    </article>
  );
};

export default HostListingCard;
