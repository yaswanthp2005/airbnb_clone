"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { MapPin, Search } from "lucide-react";

import { t } from "@/common/i18n";
import { SEARCH_DEBOUNCE_MS } from "@/constants";
import { useDismiss } from "@/hooks/useDismiss";
import { cn } from "@/lib/utils";
import { useLocationSuggestions } from "@/queries/listings";
import { debounce } from "@/utils/debounce";

import { POPULAR_DESTINATIONS, type GuestKey, type SearchSection } from "../constants";
import {
  formatDateRange,
  formatGuestSummary,
  updateGuestCount,
  type SearchDraft,
} from "../utils";
import { Segment, SegmentDivider, SegmentText } from "./Segment";
import WhenPanel from "./WhenPanel";
import WherePanel, { type WhereOption } from "./WherePanel";
import WhoPanel from "./WhoPanel";

type SearchFormProps = {
  initialDraft: SearchDraft;
  activeSection: SearchSection | null;
  onActiveSectionChange: (section: SearchSection | null) => void;
  onSubmit: (draft: SearchDraft) => void;
};

const SUGGESTION_TINT_CLASS_NAME = "bg-surface-strong text-ink";

const SearchForm = ({
  initialDraft,
  activeSection,
  onActiveSectionChange,
  onSubmit,
}: SearchFormProps) => {
  const [draft, setDraft] = useState(initialDraft);
  const [locationQuery, setLocationQuery] = useState(initialDraft.location.trim());
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const idPrefix = useId();
  const listboxId = `${idPrefix}-where-listbox`;
  const optionId = (index: number) => `${idPrefix}-where-option-${index}`;

  const debouncedSetLocationQuery = useMemo(
    () => debounce((value: string) => setLocationQuery(value.trim()), SEARCH_DEBOUNCE_MS),
    [],
  );

  const isWhereActive = activeSection === "where";
  const { data: suggestions = [], isFetching: isFetchingSuggestions } =
    useLocationSuggestions(locationQuery, isWhereActive);

  const typedLocation = draft.location.trim();
  const showPopular = typedLocation === "";
  const hasSettledNoMatches =
    locationQuery === typedLocation && !isFetchingSuggestions && suggestions.length === 0;
  const whereOptions: WhereOption[] = showPopular
    ? POPULAR_DESTINATIONS.map(destination => ({
        key: `popular-${destination.city}`,
        city: destination.city,
        title: destination.city,
        subtitle: t(destination.descriptionKey),
        icon: destination.icon,
        tintClassName: destination.tintClassName,
      }))
    : suggestions.map(suggestion => ({
        key: `${suggestion.city}-${suggestion.state}`,
        city: suggestion.city,
        title: t("search.suggestionTitle", { city: suggestion.city, state: suggestion.state }),
        subtitle: t(
          suggestion.listingCount === 1 ? "search.staysCountOne" : "search.staysCountOther",
          { count: suggestion.listingCount },
        ),
        icon: MapPin,
        tintClassName: SUGGESTION_TINT_CLASS_NAME,
      }));

  useDismiss(formRef, activeSection !== null, () => onActiveSectionChange(null));

  useEffect(() => {
    if (isWhereActive) {
      inputRef.current?.focus();
    }
  }, [isWhereActive]);

  const updateDraft = (patch: Partial<SearchDraft>) =>
    setDraft(current => ({ ...current, ...patch }));

  const setLocation = (value: string) => {
    updateDraft({ location: value });
    setHighlightedIndex(-1);
    debouncedSetLocationQuery(value);
  };

  const selectLocation = (option: WhereOption) => {
    updateDraft({ location: option.city });
    setLocationQuery(option.city);
    setHighlightedIndex(-1);
    onActiveSectionChange("when");
  };

  const handleLocationKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const count = whereOptions.length;
    if (event.key === "ArrowDown" && count > 0) {
      event.preventDefault();
      setHighlightedIndex(index => (index + 1) % count);
    } else if (event.key === "ArrowUp" && count > 0) {
      event.preventDefault();
      setHighlightedIndex(index => (index <= 0 ? count - 1 : index - 1));
    } else if (event.key === "Enter" && whereOptions[highlightedIndex]) {
      event.preventDefault();
      selectLocation(whereOptions[highlightedIndex]);
    }
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
        isAnyActive ? "bg-surface-strong" : "bg-white",
      )}
    >
      <Segment
        isActive={isWhereActive}
        isAnyActive={isAnyActive}
        className="flex-1 md:flex-[1.2]"
        canClear={draft.location.length > 0}
        onClear={() => {
          setLocation("");
          setLocationQuery("");
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
            onKeyDown={handleLocationKeyDown}
            placeholder={t("search.searchDestinations")}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={isWhereActive}
            aria-controls={listboxId}
            aria-activedescendant={
              highlightedIndex >= 0 ? optionId(highlightedIndex) : undefined
            }
            autoComplete="off"
            className="w-full truncate bg-transparent text-sm font-medium text-ink outline-none placeholder:font-normal placeholder:text-ink-muted"
          />
        </label>
      </Segment>

      <SegmentDivider isHidden={activeSection === "where" || activeSection === "when"} />

      <Segment
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
            "mr-2 flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-brand text-white transition-all hover:bg-brand-dark",
            isAnyActive ? "w-12 md:w-auto md:px-5" : "w-12",
          )}
        >
          <Search className="size-4" strokeWidth={3} aria-hidden="true" />
          <span className={cn("text-base font-semibold", isAnyActive ? "sr-only md:not-sr-only" : "sr-only")}>
            {t("search.search")}
          </span>
        </button>
      </Segment>

      {isWhereActive && (whereOptions.length > 0 || hasSettledNoMatches) ? (
        <WherePanel
          listboxId={listboxId}
          optionId={optionId}
          heading={showPopular ? t("search.suggestedDestinations") : undefined}
          options={whereOptions}
          highlightedIndex={highlightedIndex}
          emptyMessage={
            hasSettledNoMatches ? t("search.noMatches", { query: typedLocation }) : undefined
          }
          onSelect={selectLocation}
          onHighlight={setHighlightedIndex}
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
