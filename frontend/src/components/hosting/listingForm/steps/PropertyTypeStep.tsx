import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import {
  FALLBACK_PROPERTY_TYPE_ICON,
  OPTION_GRID_CLASS_NAME,
  OPTION_SKELETON_COUNT,
  PROPERTY_TYPE_ICONS,
} from "../constants";
import { StepError } from "../FormField";
import type { StepProps } from "../types";

type PropertyTypeStepProps = StepProps & {
  propertyTypes?: string[];
};

const PropertyTypeStep = ({ values, errors, onChange, propertyTypes }: PropertyTypeStepProps) => {
  if (!propertyTypes) {
    return (
      <div className={OPTION_GRID_CLASS_NAME} aria-busy="true">
        {Array.from({ length: OPTION_SKELETON_COUNT }, (_, index) => (
          <Skeleton key={index} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div role="radiogroup" className={OPTION_GRID_CLASS_NAME}>
        {propertyTypes.map(type => {
          const Icon = PROPERTY_TYPE_ICONS[type] ?? FALLBACK_PROPERTY_TYPE_ICON;
          const isSelected = values.propertyType === type;
          return (
            <button
              key={type}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange({ propertyType: type })}
              className={cn(
                "flex h-24 flex-col items-start justify-between rounded-xl border p-4 text-left transition-colors",
                isSelected
                  ? "border-ink bg-surface-muted ring-1 ring-ink"
                  : "border-hairline hover:border-ink",
              )}
            >
              <Icon className="size-7 text-ink" strokeWidth={1.5} aria-hidden="true" />
              <span className="text-base font-medium text-ink">{type}</span>
            </button>
          );
        })}
      </div>
      <StepError id="propertyType-error" error={errors.propertyType} />
    </div>
  );
};

export default PropertyTypeStep;
