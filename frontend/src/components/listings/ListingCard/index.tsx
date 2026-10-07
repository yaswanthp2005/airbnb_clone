"use client";

import Link from "next/link";
import { Star } from "lucide-react";

import { t } from "@/common/i18n";
import RemoteImage from "@/components/common/RemoteImage";
import {
  HOME_ROW_CARD_IMAGE_SIZES,
  HOME_ROW_CARD_WIDTH_CLASS_NAME,
  HOME_ROW_RATING_FORMAT,
  LISTING_LINK_TARGET_PROPS,
} from "../constants";
import { listingRoute } from "@/constants/routes";
import { cn } from "@/lib/utils";
import type { ListingSummary } from "@/types/listing";
import { formatPrice } from "@/utils/formatPrice";

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
  /** Compact single-photo layout for home page horizontal rows. */
  variant?: "default" | "homeRow";
};

const RATING_DECIMALS = 2;

const ListingCard = ({
  listing,
  isEager = false,
  href,
  bodyClassName,
  variant = "default",
}: ListingCardProps) => {
  const cardHref = href ?? listingRoute(listing.slug);
  const hasReviews = listing.reviewCount > 0;

  if (variant === "homeRow") {
    const title = t("home.card.title", { propertyType: listing.propertyType, city: listing.city });
    const rating = listing.ratingAvg.toLocaleString("en-IN", HOME_ROW_RATING_FORMAT);
    const [photo] = listing.photos;

    return (
      <article
        data-listing-id={listing.id}
        className={cn(
          "relative flex shrink-0 snap-start flex-col gap-2",
          HOME_ROW_CARD_WIDTH_CLASS_NAME,
        )}
      >
        <Link
          href={cardHref}
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
                sizes={HOME_ROW_CARD_IMAGE_SIZES}
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
  }

  const location = t("listings.card.location", {
    city: listing.city,
    state: listing.state,
  });
  const subtitle = t(
    listing.bedrooms === 1 ? "listings.card.subtitleOne" : "listings.card.subtitleOther",
    { propertyType: listing.propertyType, bedrooms: listing.bedrooms },
  );
  const rating = listing.ratingAvg.toFixed(RATING_DECIMALS);

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
