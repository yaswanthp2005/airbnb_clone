"use client";

import { useId, useState } from "react";
import { addMonths, startOfToday } from "date-fns";
import { Search, X } from "lucide-react";

import { t } from "@/common/i18n";
import RangeCalendar from "@/components/common/RangeCalendar";
import { DialogClose, DialogTitle } from "@/components/ui/dialog";

import {
  CALENDAR_MAX_MONTHS_AHEAD,
  EMPTY_GUEST_COUNTS,
  type GuestKey,
  type SearchSection,
} from "../constants";
import GuestSteppers from "../GuestSteppers";
import SearchCard from "./SearchCard";
import { useWhereOptions } from "../hooks/useWhereOptions";
import WhereOptionList, { type WhereOption } from "../SearchBar/WhereOptionList";
import {
  datesToRange,
  formatDateRange,
  formatGuestSummary,
  rangeToDates,
  updateGuestCount,
  type SearchDraft,
  type StayDateParams,
} from "../utils";

type MobileSearchSheetProps = {
  initialDraft: SearchDraft;
  onSubmit: (draft: SearchDraft) => void;
};

const EMPTY_DRAFT: SearchDraft = { location: "", ...EMPTY_GUEST_COUNTS };

const hasAnyValue = (draft: SearchDraft) =>
  Boolean(draft.location.trim() || draft.checkIn || formatGuestSummary(draft));

/** Full-screen Where → When → Who flow; mounted fresh (new draft) each time the sheet opens. */
const MobileSearchSheet = ({ initialDraft, onSubmit }: MobileSearchSheetProps) => {
  const [draft, setDraft] = useState(initialDraft);
  const [section, setSection] = useState<SearchSection>("where");
  const where = useWhereOptions(draft.location, section === "where");
  const idPrefix = useId();
  const listboxId = `${idPrefix}-where-listbox`;
  const optionId = (index: number) => `${idPrefix}-where-option-${index}`;
  const today = startOfToday();

  const updateDraft = (patch: Partial<SearchDraft>) =>
    setDraft(current => ({ ...current, ...patch }));

  const selectLocation = (option: WhereOption) => {
    updateDraft({ location: option.city });
    where.setQuery(option.city);
    setSection("when");
  };

  const handleDatesChange = (dates: StayDateParams) => {
    updateDraft(dates);
    if (dates.checkIn && dates.checkOut) {
      setSection("who");
    }
  };

  const handleGuestChange = (key: GuestKey, delta: number) =>
    setDraft(current => ({ ...current, ...updateGuestCount(current, key, delta) }));

  const clearAll = () => {
    setDraft(EMPTY_DRAFT);
    where.setQuery("");
    setSection("where");
  };

  return (
    <>
      <header className="relative flex h-16 shrink-0 items-center justify-center px-4">
        <DialogClose
          aria-label={t("search.mobile.close")}
          className="absolute left-4 flex size-9 items-center justify-center rounded-full border border-hairline bg-surface-raised text-ink"
        >
          <X className="size-4" strokeWidth={2.5} aria-hidden="true" />
        </DialogClose>
        <DialogTitle className="border-b-2 border-ink pb-1 text-base font-semibold text-ink">
          {t("nav.stays")}
        </DialogTitle>
      </header>

      <form
        id={`${idPrefix}-form`}
        role="search"
        onSubmit={event => {
          event.preventDefault();
          onSubmit(draft);
        }}
        className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 pb-6"
      >
        <SearchCard
          isActive={section === "where"}
          label={t("search.where")}
          value={draft.location.trim() || t("search.mobile.flexible")}
          title={t("search.mobile.whereTo")}
          onActivate={() => setSection("where")}
        >
          <label className="relative mt-4 block">
            <span className="sr-only">{t("search.where")}</span>
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink"
              strokeWidth={2.5}
              aria-hidden="true"
            />
            <input
              value={draft.location}
              onChange={event => {
                updateDraft({ location: event.target.value });
                where.queueQuery(event.target.value);
              }}
              onKeyDown={event => where.handleKeyDown(event, selectLocation)}
              placeholder={t("search.searchDestinations")}
              role="combobox"
              aria-autocomplete="list"
              aria-expanded
              aria-controls={listboxId}
              aria-activedescendant={
                where.highlightedIndex >= 0 ? optionId(where.highlightedIndex) : undefined
              }
              autoComplete="off"
              enterKeyHint="search"
              className="h-14 w-full rounded-xl border border-hairline bg-surface pl-11 pr-4 text-sm font-semibold text-ink outline-none placeholder:font-normal placeholder:text-ink-muted focus:border-ink"
            />
          </label>
          <div className="-mx-5 mt-4">
            <WhereOptionList
              listboxId={listboxId}
              optionId={optionId}
              heading={where.heading}
              options={where.options}
              highlightedIndex={where.highlightedIndex}
              emptyMessage={where.emptyMessage}
              onSelect={selectLocation}
              onHighlight={where.setHighlightedIndex}
              insetClassName="px-5"
            />
          </div>
        </SearchCard>

        <SearchCard
          isActive={section === "when"}
          label={t("search.when")}
          value={formatDateRange(draft.checkIn, draft.checkOut) ?? t("search.addDates")}
          title={t("search.mobile.whenTrip")}
          onActivate={() => setSection("when")}
        >
          <div className="mt-4 flex justify-center">
            <RangeCalendar
              numberOfMonths={1}
              monthsClassName=""
              selected={datesToRange(draft)}
              onSelect={range => handleDatesChange(rangeToDates(range))}
              disabled={{ before: today }}
              startMonth={today}
              endMonth={addMonths(today, CALENDAR_MAX_MONTHS_AHEAD)}
              defaultMonth={datesToRange(draft)?.from ?? today}
            />
          </div>
        </SearchCard>

        <SearchCard
          isActive={section === "who"}
          label={t("search.who")}
          value={formatGuestSummary(draft) ?? t("search.addGuests")}
          title={t("search.mobile.whoComing")}
          onActivate={() => setSection("who")}
        >
          <div className="mt-2">
            <GuestSteppers counts={draft} onChange={handleGuestChange} rowClassName="py-5" />
          </div>
        </SearchCard>
      </form>

      <footer className="flex shrink-0 items-center justify-between border-t border-hairline bg-surface px-6 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={clearAll}
          disabled={!hasAnyValue(draft)}
          className="text-base font-semibold text-ink underline underline-offset-2 disabled:text-ink-muted disabled:no-underline"
        >
          {t("search.mobile.clearAll")}
        </button>
        <button
          type="submit"
          form={`${idPrefix}-form`}
          className="flex items-center gap-2 rounded-lg bg-brand px-6 py-3.5 text-base font-semibold text-on-brand transition-colors hover:bg-brand-dark"
        >
          <Search className="size-4" strokeWidth={3} aria-hidden="true" />
          {t("search.search")}
        </button>
      </footer>
    </>
  );
};

export default MobileSearchSheet;
