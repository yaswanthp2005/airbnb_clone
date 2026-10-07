import { t } from "@/common/i18n";
import { cn } from "@/lib/utils";

import { BEDROOM_OPTIONS } from "./constants";

type BedroomsFilterProps = {
  value?: number;
  onChange: (bedrooms?: number) => void;
};

const LAST_BEDROOM_OPTION = BEDROOM_OPTIONS[BEDROOM_OPTIONS.length - 1];

const BedroomsFilter = ({ value, onChange }: BedroomsFilterProps) => {
  const options: { label: string; value?: number }[] = [
    { label: t("listings.filters.any"), value: undefined },
    ...BEDROOM_OPTIONS.map(option => ({
      label:
        option === LAST_BEDROOM_OPTION
          ? t("listings.filters.orMore", { count: option })
          : String(option),
      value: option,
    })),
  ];

  return (
    <div
      role="radiogroup"
      aria-label={t("listings.filters.bedrooms")}
      className="flex flex-wrap gap-2"
    >
      {options.map(option => {
        const isSelected = option.value === value;

        return (
          <button
            key={option.label}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(option.value)}
            className={cn(
              "h-10 min-w-16 rounded-full border px-5 text-sm transition-colors",
              isSelected
                ? "border-ink bg-ink text-on-ink"
                : "border-hairline text-ink hover:border-ink",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default BedroomsFilter;
