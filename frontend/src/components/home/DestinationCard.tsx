import Link from "next/link";

import RemoteImage from "@/components/common/RemoteImage";
import { routes } from "@/constants/routes";
import { cn } from "@/lib/utils";
import type { Destination } from "@/types/destination";
import { buildUrl } from "@/utils/buildUrl";

import { DESTINATION_CARD_WIDTH_CLASS_NAME, DESTINATION_IMAGE_SIZES } from "./constants";

type DestinationCardProps = {
  destination: Destination;
  isEager?: boolean;
};

const DestinationCard = ({ destination, isEager = false }: DestinationCardProps) => (
  <Link
    href={buildUrl({ path: routes.search, query: { location: destination.city } })}
    className={cn("group flex shrink-0 snap-start flex-col gap-2", DESTINATION_CARD_WIDTH_CLASS_NAME)}
  >
    <div className="relative aspect-[20/19] overflow-hidden rounded-2xl bg-surface-muted">
      <RemoteImage
        src={destination.imageUrl}
        alt={destination.city}
        fill
        sizes={DESTINATION_IMAGE_SIZES}
        loading={isEager ? "eager" : "lazy"}
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
    <div className="flex flex-col leading-tight">
      <span className="truncate text-sm font-semibold text-ink">{destination.city}</span>
      <span className="line-clamp-2 text-xs text-ink-muted">{destination.tagline}</span>
    </div>
  </Link>
);

export default DestinationCard;
