"use client";

import { t } from "@/common/i18n";
import { LISTING_SORT_OPTIONS } from "@/components/listings/constants";
import type { ListingSort } from "@/types/listing";
import { cn } from "@/lib/utils";

type ListingsSortSelectProps = {
  value: ListingSort | undefined;
  onChange: (sort: ListingSort) => void;
  className?: string;
};

const ListingsSortSelect = ({ value, onChange, className }: ListingsSortSelectProps) => {
  const selected = value ?? "recommended";

  return (
    <label className={cn("relative mb-2 flex shrink-0 items-center", className)}>
      <span className="sr-only">{t("listings.sort.label")}</span>
      <select
        value={selected}
        onChange={event => onChange(event.target.value as ListingSort)}
        aria-label={t("listings.sort.label")}
        className="h-12 cursor-pointer appearance-none rounded-xl border border-hairline bg-surface pl-3 pr-9 text-xs font-semibold text-ink transition-colors hover:border-ink hover:bg-surface-muted focus-visible:border-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink"
      >
        {LISTING_SORT_OPTIONS.map(option => (
          <option key={option.value} value={option.value}>
            {t(option.labelKey)}
          </option>
        ))}
      </select>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 size-0 -translate-y-1/2 border-x-[5px] border-t-[6px] border-x-transparent border-t-ink"
      />
    </label>
  );
};

export default ListingsSortSelect;
