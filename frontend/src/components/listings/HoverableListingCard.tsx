"use client";

import { memo } from "react";

import type { ListingSummary } from "@/types/listing";

import ListingCard from "./ListingCard";

type HoverableListingCardProps = {
  listing: ListingSummary;
  href: string;
  isEager: boolean;
  /** Stable setter; only passed while the map is open. */
  onHoverChange?: (listingId: number | null) => void;
};

/** Reports hover/focus so the map can highlight the pin; memoised so hovering doesn't re-render the grid. */
const HoverableListingCard = ({ listing, href, isEager, onHoverChange }: HoverableListingCardProps) => (
  <div
    onMouseEnter={onHoverChange && (() => onHoverChange(listing.id))}
    onMouseLeave={onHoverChange && (() => onHoverChange(null))}
    onFocus={onHoverChange && (() => onHoverChange(listing.id))}
    onBlur={onHoverChange && (() => onHoverChange(null))}
  >
    <ListingCard listing={listing} href={href} isEager={isEager} />
  </div>
);

export default memo(HoverableListingCard);
