"use client";

import { memo, useMemo } from "react";
import { divIcon } from "leaflet";
import { Marker, Popup } from "react-leaflet";

import { t } from "@/common/i18n";
import ListingCard from "@/components/listings/ListingCard";
import type { ListingSummary } from "@/types/listing";
import { formatPrice } from "@/utils/formatPrice";

import { HIGHLIGHTED_PIN_Z_INDEX, POPUP_WIDTH } from "./constants";

type PricePinProps = {
  listing: ListingSummary;
  href: string;
  isHighlighted: boolean;
  onSelect: (listingId: number | null) => void;
};

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, char => `&#${char.charCodeAt(0)};`);

/** Rupee price pill; memoised so hovering one card only re-renders two pins. */
const PricePin = ({ listing, href, isHighlighted, onSelect }: PricePinProps) => {
  const price = formatPrice(listing.pricePerNight);
  const icon = useMemo(
    () =>
      divIcon({
        className: "",
        iconSize: [0, 0],
        html: `<span class="price-pin${isHighlighted ? " price-pin--active" : ""}" data-listing-id="${listing.id}">${escapeHtml(price)}</span>`,
      }),
    [isHighlighted, listing.id, price],
  );

  return (
    <Marker
      position={[listing.latitude, listing.longitude]}
      icon={icon}
      zIndexOffset={isHighlighted ? HIGHLIGHTED_PIN_Z_INDEX : 0}
      keyboard
      title={t("listings.map.pinLabel", { price, title: listing.title })}
      eventHandlers={{
        popupopen: () => onSelect(listing.id),
        popupclose: () => onSelect(null),
      }}
    >
      <Popup className="listing-map-popup" closeButton={false} minWidth={POPUP_WIDTH} maxWidth={POPUP_WIDTH}>
        <ListingCard listing={listing} href={href} bodyClassName="px-3 pb-3" />
      </Popup>
    </Marker>
  );
};

export default memo(PricePin);
