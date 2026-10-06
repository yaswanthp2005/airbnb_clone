import { cn } from "@/lib/utils";

type PropertyTypeFilterProps = {
  options: string[];
  selected: string[];
  onToggle: (propertyType: string) => void;
};

const PropertyTypeFilter = ({ options, selected, onToggle }: PropertyTypeFilterProps) => (
  <div className="flex flex-wrap gap-3">
    {options.map(option => {
      const isSelected = selected.includes(option);

      return (
        <button
          key={option}
          type="button"
          aria-pressed={isSelected}
          onClick={() => onToggle(option)}
          className={cn(
            "rounded-full border px-5 py-2.5 text-sm text-ink transition-colors",
            isSelected
              ? "border-ink bg-surface-muted ring-1 ring-ink"
              : "border-hairline hover:border-ink",
          )}
        >
          {option}
        </button>
      );
    })}
  </div>
);

export default PropertyTypeFilter;
