"use client";

import { useState } from "react";

import { t } from "@/common/i18n";
import { cn } from "@/lib/utils";
import type { Amenity } from "@/types/listing";

import {
  AMENITIES_PREVIEW_COUNT,
  AMENITY_ICONS,
  FALLBACK_AMENITY_ICON,
  SECTION_IDS,
} from "./constants";
import DetailModal from "./DetailModal";
import { pluralize } from "./utils";

type AmenitiesSectionProps = {
  amenities: Amenity[];
};

const AmenityItem = ({ amenity, className }: { amenity: Amenity; className?: string }) => {
  const Icon = AMENITY_ICONS[amenity.icon ?? ""] ?? FALLBACK_AMENITY_ICON;
  return (
    <li className={cn("flex items-center gap-4 text-base text-ink", className)}>
      <Icon className="size-6 shrink-0" strokeWidth={1.5} aria-hidden="true" />
      {amenity.name}
    </li>
  );
};

const AmenitiesSection = ({ amenities }: AmenitiesSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const title = t("listingDetail.amenities.title");

  if (amenities.length === 0) {
    return null;
  }

  return (
    <section id={SECTION_IDS.amenities} className="border-b border-hairline py-12">
      <h2 className="mb-6 text-[22px] font-semibold text-ink">{title}</h2>
      <ul className="grid gap-y-4 sm:grid-cols-2 sm:gap-x-8">
        {amenities.slice(0, AMENITIES_PREVIEW_COUNT).map(amenity => (
          <AmenityItem key={amenity.id} amenity={amenity} />
        ))}
      </ul>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mt-8 rounded-lg border border-ink px-6 py-3 text-base font-semibold text-ink transition-colors hover:bg-surface-muted"
      >
        {pluralize(amenities.length, "listingDetail.amenities.showAll")}
      </button>

      <DetailModal open={isOpen} onOpenChange={setIsOpen} title={title}>
        <ul>
          {amenities.map(amenity => (
            <AmenityItem
              key={amenity.id}
              amenity={amenity}
              className="border-b border-hairline py-6 last:border-b-0"
            />
          ))}
        </ul>
      </DetailModal>
    </section>
  );
};

export default AmenitiesSection;
