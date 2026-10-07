"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { Heart, Star } from "lucide-react";

import { t } from "@/common/i18n";
import { listingRoute } from "@/constants/routes";
import { useWishlistToggle } from "@/hooks/useWishlistToggle";
import { cn } from "@/lib/utils";
import type { ListingSummary } from "@/types/listing";
import { formatPrice } from "@/utils/formatPrice";

import PhotoCarousel from "./PhotoCarousel";

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
  const toggleWishlist = useWishlistToggle();
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

  const handleWishlistClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    toggleWishlist(listing.id, listing.isWishlisted);
  };

  return (
    <article data-listing-id={listing.id} className="group relative flex flex-col gap-3">
      <Link
        href={href ?? listingRoute(listing.id)}
        aria-label={listing.title}
        className="absolute inset-0 z-10 rounded-xl"
      />

      <div className="relative">
        <PhotoCarousel photos={listing.photos} alt={listing.title} isEager={isEager} />
        <button
          type="button"
          onClick={handleWishlistClick}
          aria-pressed={listing.isWishlisted}
          aria-label={t(
            listing.isWishlisted
              ? "listings.card.removeFromWishlist"
              : "listings.card.saveToWishlist",
          )}
          className="absolute right-3 top-3 z-20 transition-transform hover:scale-110"
        >
          <Heart
            className={cn(
              "size-6 stroke-white stroke-2 drop-shadow-sm",
              listing.isWishlisted ? "fill-brand" : "fill-black/50",
            )}
            aria-hidden="true"
          />
        </button>
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
