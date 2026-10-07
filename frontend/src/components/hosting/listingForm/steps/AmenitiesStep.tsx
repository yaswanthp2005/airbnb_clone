import { AMENITY_ICONS, FALLBACK_AMENITY_ICON } from "@/components/listingDetail/constants";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Amenity } from "@/types/listing";

import { OPTION_GRID_CLASS_NAME, OPTION_SKELETON_COUNT } from "../constants";
import type { StepProps } from "../types";

type AmenitiesStepProps = StepProps & {
  amenities?: Amenity[];
};

const AmenitiesStep = ({ values, onChange, amenities }: AmenitiesStepProps) => {
  if (!amenities) {
    return (
      <div className={OPTION_GRID_CLASS_NAME} aria-busy="true">
        {Array.from({ length: OPTION_SKELETON_COUNT }, (_, index) => (
          <Skeleton key={index} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  const toggle = (amenityId: number) =>
    onChange({
      amenities: values.amenities.includes(amenityId)
        ? values.amenities.filter(id => id !== amenityId)
        : [...values.amenities, amenityId],
    });

  return (
    <div className={OPTION_GRID_CLASS_NAME}>
      {amenities.map(amenity => {
        const Icon = AMENITY_ICONS[amenity.icon ?? ""] ?? FALLBACK_AMENITY_ICON;
        const isSelected = values.amenities.includes(amenity.id);
        return (
          <button
            key={amenity.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => toggle(amenity.id)}
            className={cn(
              "flex h-24 flex-col items-start justify-between rounded-xl border p-4 text-left transition-colors",
              isSelected
                ? "border-ink bg-surface-muted ring-1 ring-ink"
                : "border-hairline hover:border-ink",
            )}
          >
            <Icon className="size-7 text-ink" strokeWidth={1.5} aria-hidden="true" />
            <span className="text-base font-medium text-ink">{amenity.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default AmenitiesStep;
