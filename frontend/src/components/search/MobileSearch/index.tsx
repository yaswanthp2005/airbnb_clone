"use client";

import { useState } from "react";
import { Search } from "lucide-react";

import { t } from "@/common/i18n";
import { useListingFilters } from "@/components/listings/hooks/useListingFilters";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import { draftFromFilters, draftToFilters, formatDateRange, formatGuestSummary, type SearchDraft } from "../utils";
import MobileSearchSheet from "./MobileSearchSheet";

type MobileSearchProps = {
  /** `pill`: full-width summary (explore page); `icon`: compact button for other pages. */
  variant: "pill" | "icon";
};

const MobileSearch = ({ variant }: MobileSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { filters, setFilters } = useListingFilters();
  const draft = draftFromFilters(filters);
  const location = draft.location.trim();
  const dates = formatDateRange(draft.checkIn, draft.checkOut);
  const guests = formatGuestSummary(draft);
  const hasSearch = Boolean(location || dates || guests);

  const handleSubmit = (nextDraft: SearchDraft) => {
    setFilters({ ...filters, ...draftToFilters(nextDraft) }, { scrollToTop: true });
    setIsOpen(false);
  };

  return (
    <>
      {variant === "pill" ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex w-full items-center justify-center gap-3 rounded-full border border-hairline bg-surface px-5 py-3 text-ink shadow-pill"
        >
          <Search className="size-4 shrink-0" strokeWidth={2.5} aria-hidden="true" />
          {hasSearch ? (
            <span className="flex min-w-0 flex-col text-left">
              <span className="truncate text-sm font-semibold">{location || t("search.anywhere")}</span>
              <span className="truncate text-xs text-ink-muted">
                {t("search.mobile.summary", {
                  dates: dates ?? t("search.anyWeek"),
                  guests: guests ?? t("search.addGuests"),
                })}
              </span>
            </span>
          ) : (
            <span className="text-sm font-semibold">{t("search.mobile.startSearch")}</span>
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label={t("search.mobile.startSearch")}
          className="flex size-10 items-center justify-center rounded-full border border-hairline bg-surface text-ink shadow-pill"
        >
          <Search className="size-4" strokeWidth={2.5} aria-hidden="true" />
        </button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          showCloseButton={false}
          className="left-0 top-0 flex h-dvh w-screen max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none bg-surface-muted p-0 pt-[env(safe-area-inset-top)] ring-0 sm:max-w-none data-open:zoom-in-100 data-open:slide-in-from-bottom-8 data-closed:zoom-out-100"
        >
          <MobileSearchSheet initialDraft={draft} onSubmit={handleSubmit} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MobileSearch;
