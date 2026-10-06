"use client";

import { useState } from "react";

import { t } from "@/common/i18n";
import { Checkbox } from "@/components/ui/checkbox";
import type { Amenity } from "@/types/listing";

import { AMENITIES_COLLAPSED_COUNT } from "./constants";

type AmenitiesFilterProps = {
  amenities: Amenity[];
  selected: number[];
  onToggle: (amenityId: number) => void;
};

const AmenitiesFilter = ({ amenities, selected, onToggle }: AmenitiesFilterProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleAmenities = isExpanded
    ? amenities
    : amenities.slice(0, AMENITIES_COLLAPSED_COUNT);
  const canExpand = amenities.length > AMENITIES_COLLAPSED_COUNT;

  return (
    <div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        {visibleAmenities.map(amenity => (
          <label
            key={amenity.id}
            className="flex cursor-pointer items-center gap-4 text-base text-ink"
          >
            <Checkbox
              checked={selected.includes(amenity.id)}
              onCheckedChange={() => onToggle(amenity.id)}
              className="size-6 rounded-md border-ink-muted data-checked:border-ink data-checked:bg-ink data-checked:text-white"
            />
            {amenity.name}
          </label>
        ))}
      </div>
      {canExpand ? (
        <button
          type="button"
          onClick={() => setIsExpanded(current => !current)}
          className="mt-6 text-base font-semibold text-ink underline underline-offset-2"
        >
          {t(isExpanded ? "listings.filters.showLess" : "listings.filters.showMore")}
        </button>
      ) : null}
    </div>
  );
};

export default AmenitiesFilter;
