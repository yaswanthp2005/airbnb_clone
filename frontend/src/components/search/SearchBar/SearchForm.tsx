"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Search } from "lucide-react";

import { t } from "@/common/i18n";
import { useDismiss } from "@/hooks/useDismiss";
import { cn } from "@/lib/utils";

import { SEARCH_HIGHLIGHT_DURATION_CLASS_NAME, type GuestKey, type SearchSection } from "../constants";
import { useSlidingHighlight } from "../hooks/useSlidingHighlight";
import { useWhereOptions } from "../hooks/useWhereOptions";
import {
  formatDateRange,
  formatGuestSummary,
  updateGuestCount,
  type SearchDraft,
} from "../utils";
import { Segment, SegmentDivider, SegmentText } from "./Segment";
import WhenPanel from "./WhenPanel";
import type { WhereOption } from "./WhereOptionList";
import WherePanel from "./WherePanel";
import WhoPanel from "./WhoPanel";

type SearchFormProps = {
  initialDraft: SearchDraft;
  activeSection: SearchSection | null;
  onActiveSectionChange: (section: SearchSection | null) => void;
  onSubmit: (draft: SearchDraft) => void;
};

const SearchForm = ({
  initialDraft,
  activeSection,
  onActiveSectionChange,
  onSubmit,
}: SearchFormProps) => {
  const [draft, setDraft] = useState(initialDraft);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const idPrefix = useId();
  const listboxId = `${idPrefix}-where-listbox`;
  const optionId = (index: number) => `${idPrefix}-where-option-${index}`;

  const isWhereActive = activeSection === "where";
  const where = useWhereOptions(draft.location, isWhereActive);
  const highlight = useSlidingHighlight(activeSection);

  useDismiss(formRef, activeSection !== null, () => onActiveSectionChange(null));

  useEffect(() => {
    if (isWhereActive) {
      // The bar lives in the sticky header and may still be animating open; scrolling it
      // "into view" would jump the page to the top.
      inputRef.current?.focus({ preventScroll: true });
    }
  }, [isWhereActive]);

  const updateDraft = (patch: Partial<SearchDraft>) =>
    setDraft(current => ({ ...current, ...patch }));

  const setLocation = (value: string) => {
    updateDraft({ location: value });
    where.queueQuery(value);
  };

  const selectLocation = (option: WhereOption) => {
    updateDraft({ location: option.city });
    where.setQuery(option.city);
    onActiveSectionChange("when");
  };

  const handleDatesChange = (dates: { checkIn?: string; checkOut?: string }) => {
    updateDraft(dates);
    if (dates.checkIn && dates.checkOut) {
      onActiveSectionChange("who");
    }
  };

  const handleGuestChange = (key: GuestKey, delta: number) =>
    setDraft(current => ({ ...current, ...updateGuestCount(current, key, delta) }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onActiveSectionChange(null);
    onSubmit(draft);
  };

  const toggleSection = (section: SearchSection) =>
    onActiveSectionChange(activeSection === section ? null : section);

  const isAnyActive = activeSection !== null;
  const dateRange = formatDateRange(draft.checkIn, draft.checkOut);
  const guestSummary = formatGuestSummary(draft);

  return (
    <form
      ref={formRef}
      role="search"
      onSubmit={handleSubmit}
      className={cn(
        "relative flex h-16 w-[850px] max-w-full items-center rounded-full border border-hairline shadow-pill transition-colors",
        isAnyActive ? "bg-surface-strong" : "bg-surface",
      )}
    >
      <span
        aria-hidden="true"
        style={{ width: highlight.box.width, transform: `translateX(${highlight.box.left}px)` }}
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 rounded-full bg-surface-raised shadow-card ease-out motion-reduce:transition-none",
          SEARCH_HIGHLIGHT_DURATION_CLASS_NAME,
          highlight.box.canSlide ? "transition-[transform,width,opacity]" : "transition-opacity",
          highlight.box.isVisible ? "opacity-100" : "opacity-0",
        )}
      />
      <Segment
        ref={highlight.register("where")}
        isActive={isWhereActive}
        isAnyActive={isAnyActive}
        className="flex-1 md:flex-[1.2]"
        canClear={draft.location.length > 0}
        onClear={() => {
          updateDraft({ location: "" });
          where.setQuery("");
          inputRef.current?.focus();
        }}
      >
        <label className="flex h-full w-full cursor-pointer flex-col justify-center px-4 md:pl-8 md:pr-10">
          <span className="text-xs font-semibold text-ink">{t("search.where")}</span>
          <input
            ref={inputRef}
            value={draft.location}
            onChange={event => setLocation(event.target.value)}
            onFocus={() => onActiveSectionChange("where")}
            onKeyDown={event => where.handleKeyDown(event, selectLocation)}
            placeholder={t("search.searchDestinations")}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={isWhereActive}
            aria-controls={listboxId}
            aria-activedescendant={
              where.highlightedIndex >= 0 ? optionId(where.highlightedIndex) : undefined
            }
            autoComplete="off"
            className="w-full truncate bg-transparent text-sm font-medium text-ink outline-none placeholder:font-normal placeholder:text-ink-muted"
          />
        </label>
      </Segment>

      <SegmentDivider isHidden={activeSection === "where" || activeSection === "when"} />

      <Segment
        ref={highlight.register("when")}
        isActive={activeSection === "when"}
        isAnyActive={isAnyActive}
        className="flex-1"
        canClear={Boolean(draft.checkIn)}
        onClear={() => updateDraft({ checkIn: undefined, checkOut: undefined })}
      >
        <button
          type="button"
          aria-expanded={activeSection === "when"}
          onClick={() => toggleSection("when")}
          className="flex h-full w-full items-center px-4 md:pl-8 md:pr-10"
        >
          <SegmentText
            label={t("search.when")}
            value={dateRange}
            placeholder={t("search.addDates")}
          />
        </button>
      </Segment>

      <SegmentDivider isHidden={activeSection === "when" || activeSection === "who"} />

      <Segment
        ref={highlight.register("who")}
        isActive={activeSection === "who"}
        isAnyActive={isAnyActive}
        className="flex-[1.4] md:flex-1"
      >
        <button
          type="button"
          aria-expanded={activeSection === "who"}
          onClick={() => toggleSection("who")}
          className="flex h-full min-w-0 flex-1 items-center pl-4 pr-2 md:pl-8"
        >
          <SegmentText
            label={t("search.who")}
            value={guestSummary}
            placeholder={t("search.addGuests")}
          />
        </button>
        <button
          type="submit"
          className={cn(
            "mr-2 flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-brand text-on-brand transition-all hover:bg-brand-dark",
            isAnyActive ? "w-12 md:w-auto md:px-5" : "w-12",
          )}
        >
          <Search className="size-4" strokeWidth={3} aria-hidden="true" />
          <span className={cn("text-base font-semibold", isAnyActive ? "sr-only md:not-sr-only" : "sr-only")}>
            {t("search.search")}
          </span>
        </button>
      </Segment>

      {isWhereActive && (where.options.length > 0 || where.emptyMessage) ? (
        <WherePanel
          listboxId={listboxId}
          optionId={optionId}
          heading={where.heading}
          options={where.options}
          highlightedIndex={where.highlightedIndex}
          emptyMessage={where.emptyMessage}
          onSelect={selectLocation}
          onHighlight={where.setHighlightedIndex}
        />
      ) : null}
      {activeSection === "when" ? (
        <WhenPanel
          checkIn={draft.checkIn}
          checkOut={draft.checkOut}
          onChange={handleDatesChange}
        />
      ) : null}
      {activeSection === "who" ? (
        <WhoPanel counts={draft} onChange={handleGuestChange} />
      ) : null}
    </form>
  );
};

export default SearchForm;
