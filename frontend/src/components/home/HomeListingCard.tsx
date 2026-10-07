"use client";

import Link from "next/link";
import { Star } from "lucide-react";

import { t } from "@/common/i18n";
import RemoteImage from "@/components/common/RemoteImage";
import { LISTING_LINK_TARGET_PROPS } from "@/components/listings/constants";
import GuestFavouriteBadge from "@/components/listings/ListingCard/GuestFavouriteBadge";
import WishlistButton from "@/components/listings/ListingCard/WishlistButton";
import { listingRoute } from "@/constants/routes";
import { cn } from "@/lib/utils";
import type { ListingSummary } from "@/types/listing";
import { formatPrice } from "@/utils/formatPrice";

import { HOME_CARD_IMAGE_SIZES, HOME_CARD_WIDTH_CLASS_NAME, RATING_FORMAT } from "./constants";

type HomeListingCardProps = {
  listing: ListingSummary;
};

const HomeListingCard = ({ listing }: HomeListingCardProps) => {
  const title = t("home.card.title", { propertyType: listing.propertyType, city: listing.city });
  const hasReviews = listing.reviewCount > 0;
  const rating = listing.ratingAvg.toLocaleString("en-IN", RATING_FORMAT);
  const [photo] = listing.photos;

  return (
    <article
      data-listing-id={listing.id}
      className={cn("relative flex shrink-0 snap-start flex-col gap-2", HOME_CARD_WIDTH_CLASS_NAME)}
    >
      <Link
        href={listingRoute(listing.slug)}
        {...LISTING_LINK_TARGET_PROPS}
        aria-label={title}
        className="group flex flex-col gap-2"
      >
        <div className="relative aspect-[20/19] overflow-hidden rounded-2xl bg-surface-muted">
          {photo ? (
            <RemoteImage
              src={photo}
              alt={title}
              fill
              sizes={HOME_CARD_IMAGE_SIZES}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : null}
        </div>
        <div className="flex flex-col text-xs leading-snug sm:text-[13px]">
          <span className="truncate font-semibold text-ink">{title}</span>
          <span className="truncate text-ink-muted">
            {t("home.card.priceForOneNight", { price: formatPrice(listing.pricePerNight) })}
            {" · "}
            <Star className="mb-0.5 inline size-2.5 fill-ink-muted" aria-hidden="true" />{" "}
            {hasReviews ? rating : t("listings.card.new")}
          </span>
        </div>
      </Link>
      {listing.isGuestFavourite ? <GuestFavouriteBadge /> : null}
      <WishlistButton listingId={listing.id} isWishlisted={listing.isWishlisted} />
    </article>
  );
};

export default HomeListingCard;
