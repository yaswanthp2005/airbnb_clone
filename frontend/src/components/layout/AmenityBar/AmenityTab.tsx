import { AMENITY_ICONS, FALLBACK_AMENITY_ICON } from "@/components/listingDetail/constants";
import { cn } from "@/lib/utils";
import type { Amenity } from "@/types/listing";

type AmenityTabProps = {
  amenity: Amenity;
  isActive: boolean;
  onToggle: (amenityId: number) => void;
};

const AmenityTab = ({ amenity, isActive, onToggle }: AmenityTabProps) => {
  const Icon = AMENITY_ICONS[amenity.icon ?? ""] ?? FALLBACK_AMENITY_ICON;

  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={() => onToggle(amenity.id)}
      className={cn(
        "group flex shrink-0 flex-col items-center gap-2 border-b-2 pb-2.5 pt-1 transition-colors",
        isActive
          ? "border-ink text-ink"
          : "border-transparent text-ink-muted hover:border-hairline hover:text-ink",
      )}
    >
      <Icon
        className={cn("size-6", !isActive && "opacity-70 group-hover:opacity-100")}
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <span className="whitespace-nowrap text-xs font-semibold">{amenity.name}</span>
    </button>
  );
};

export default AmenityTab;
