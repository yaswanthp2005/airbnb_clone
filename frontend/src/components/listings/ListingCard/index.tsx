"use client";

import Link from "next/link";
import { Star } from "lucide-react";

import { t } from "@/common/i18n";
import { listingRoute } from "@/constants/routes";
import { cn } from "@/lib/utils";
import type { ListingSummary } from "@/types/listing";
import { formatPrice } from "@/utils/formatPrice";

import { LISTING_LINK_TARGET_PROPS } from "../constants";
import GuestFavouriteBadge from "./GuestFavouriteBadge";
import PhotoCarousel from "./PhotoCarousel";
import WishlistButton from "./WishlistButton";

type ListingCardProps = {
  listing: ListingSummary;
  isEager?: boolean;
  /** Defaults to the plain listing route. */
  href?: string;
  /** Extra classes for the text below the photos (e.g. padding inside a map popup). */
  bodyClassName?: string;
};

const RATING_DECIMALS = 2;

const ListingCard = ({ listing, isEager = false, href, bodyClassName }: ListingCardProps) => {
  const location = t("listings.card.location", {
    city: listing.city,
    state: listing.state,
  });
  const subtitle = t(
    listing.bedrooms === 1 ? "listings.card.subtitleOne" : "listings.card.subtitleOther",
    { propertyType: listing.propertyType, bedrooms: listing.bedrooms },
  );
  const hasReviews = listing.reviewCount > 0;
  const rating = listing.ratingAvg.toFixed(RATING_DECIMALS);

  const cardHref = href ?? listingRoute(listing.id);

  return (
    <article data-listing-id={listing.id} className="group relative flex flex-col gap-3">
      <Link
        href={cardHref}
        {...LISTING_LINK_TARGET_PROPS}
        aria-label={listing.title}
        className="absolute inset-0 z-10 rounded-xl"
      />

      <div className="relative">
        <PhotoCarousel photos={listing.photos} alt={listing.title} href={cardHref} isEager={isEager} />
        {listing.isGuestFavourite ? <GuestFavouriteBadge /> : null}
        <WishlistButton listingId={listing.id} isWishlisted={listing.isWishlisted} />
      </div>

      <div className={cn("flex flex-col text-[15px] leading-5", bodyClassName)}>
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate font-semibold text-ink">{location}</h3>
          <span className="flex shrink-0 items-center gap-1 text-ink">
            <Star className="size-3 fill-ink" aria-hidden="true" />
            <span aria-hidden={hasReviews}>
              {hasReviews ? rating : t("listings.card.new")}
            </span>
            {hasReviews ? (
              <span className="sr-only">
                {t("listings.card.ratingLabel", { rating, count: listing.reviewCount })}
              </span>
            ) : null}
          </span>
        </div>
        <p className="truncate text-ink-muted">{subtitle}</p>
        <p className="mt-1.5 text-ink">
          <span className="font-semibold">{formatPrice(listing.pricePerNight)}</span>{" "}
          {t("listings.card.perNight")}
        </p>
      </div>
    </article>
  );
};

export default ListingCard;
