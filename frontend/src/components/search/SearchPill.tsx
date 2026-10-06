"use client";

import { Search } from "lucide-react";

import { t } from "@/common/i18n";
import { useListingFilters } from "@/components/listings/hooks/useListingFilters";
import { cn } from "@/lib/utils";

import type { SearchSection } from "./constants";
import { draftFromFilters, formatDateRange, formatGuestSummary } from "./utils";

type SearchPillProps = {
  onSectionClick: (section: SearchSection) => void;
};

const Divider = () => <span aria-hidden="true" className="h-6 w-px shrink-0 bg-hairline" />;

const SEGMENT_TEXT_CLASS_NAME = "max-w-40 truncate text-sm font-semibold text-ink";

const SearchPill = ({ onSectionClick }: SearchPillProps) => {
  const { filters } = useListingFilters();
  const draft = draftFromFilters(filters);
  const location = draft.location || undefined;
  const dates = formatDateRange(draft.checkIn, draft.checkOut);
  const guests = formatGuestSummary(draft);

  return (
    <div
      role="search"
      className="flex h-12 max-w-full items-center rounded-full border border-hairline bg-white shadow-pill transition-shadow hover:shadow-pill-hover"
    >
      <button
        type="button"
        onClick={() => onSectionClick("where")}
        className={cn(SEGMENT_TEXT_CLASS_NAME, "pl-6 pr-4")}
      >
        {location ?? t("search.anywhere")}
      </button>
      <Divider />
      <button
        type="button"
        onClick={() => onSectionClick("when")}
        className={cn(SEGMENT_TEXT_CLASS_NAME, "px-4")}
      >
        {dates ?? t("search.anyWeek")}
      </button>
      <Divider />
      <button
        type="button"
        onClick={() => onSectionClick("who")}
        className="flex min-w-0 items-center gap-3 pl-4 pr-2 text-sm"
      >
        <span className={cn("max-w-40 truncate", guests ? "font-semibold text-ink" : "text-ink-muted")}>
          {guests ?? t("search.addGuests")}
        </span>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand text-white">
          <Search className="size-3.5" strokeWidth={3} aria-hidden="true" />
          <span className="sr-only">{t("search.search")}</span>
        </span>
      </button>
    </div>
  );
};

export default SearchPill;
