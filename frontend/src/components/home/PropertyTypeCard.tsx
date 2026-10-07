import Link from "next/link";
import { House } from "lucide-react";

import { t } from "@/common/i18n";
import RemoteImage from "@/components/common/RemoteImage";
import { routes } from "@/constants/routes";
import { cn } from "@/lib/utils";
import type { PropertyTypeSummary } from "@/types/listing";
import { buildUrl } from "@/utils/buildUrl";

import { HOME_CARD_IMAGE_SIZES, HOME_CARD_WIDTH_CLASS_NAME } from "./constants";

type PropertyTypeCardProps = {
  summary: PropertyTypeSummary;
};

const PropertyTypeCard = ({ summary }: PropertyTypeCardProps) => (
  <Link
    href={buildUrl({ path: routes.search, query: { propertyType: [summary.propertyType] } })}
    className={cn("group flex shrink-0 snap-start flex-col gap-2", HOME_CARD_WIDTH_CLASS_NAME)}
  >
    <div className="relative flex aspect-[20/19] items-center justify-center overflow-hidden rounded-2xl bg-surface-muted">
      {summary.coverPhoto ? (
        <RemoteImage
          src={summary.coverPhoto}
          alt={summary.propertyType}
          fill
          sizes={HOME_CARD_IMAGE_SIZES}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <House className="size-8 text-ink-muted" aria-hidden="true" />
      )}
    </div>
    <div className="flex flex-col text-[13px] leading-snug">
      <span className="truncate font-semibold text-ink">{summary.propertyType}</span>
      <span className="truncate text-ink-muted">
        {t(summary.listingCount === 1 ? "home.staysOne" : "home.staysOther", {
          count: summary.listingCount,
        })}
      </span>
    </div>
  </Link>
);

export default PropertyTypeCard;
