"use client";

import { useMemo, useState, type KeyboardEvent } from "react";
import { MapPin } from "lucide-react";

import { t } from "@/common/i18n";
import { SEARCH_DEBOUNCE_MS } from "@/constants";
import { useLocationSuggestions } from "@/queries/listings";
import { debounce } from "@/utils/debounce";

import { POPULAR_DESTINATIONS } from "../constants";
import type { WhereOption } from "../SearchBar/WhereOptionList";

const SUGGESTION_TINT_CLASS_NAME = "bg-surface-strong text-ink";

/**
 * "Where" suggestions for a typed location: popular destinations while empty, otherwise
 * debounced matches from the API. Shared by the desktop bar and the mobile sheet.
 */
export const useWhereOptions = (location: string, isEnabled: boolean) => {
  const [locationQuery, setLocationQuery] = useState(location.trim());
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const debouncedSetLocationQuery = useMemo(
    () => debounce((value: string) => setLocationQuery(value.trim()), SEARCH_DEBOUNCE_MS),
    [],
  );

  const { data: suggestions = [], isFetching } = useLocationSuggestions(locationQuery, isEnabled);

  const typedLocation = location.trim();
  const showPopular = typedLocation === "";
  const hasSettledNoMatches =
    locationQuery === typedLocation && !isFetching && suggestions.length === 0;

  const options: WhereOption[] = showPopular
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

  /** Arrow keys move the highlight; Enter picks it. */
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, onSelect: (option: WhereOption) => void) => {
    const count = options.length;
    if (event.key === "ArrowDown" && count > 0) {
      event.preventDefault();
      setHighlightedIndex(index => (index + 1) % count);
    } else if (event.key === "ArrowUp" && count > 0) {
      event.preventDefault();
      setHighlightedIndex(index => (index <= 0 ? count - 1 : index - 1));
    } else if (event.key === "Enter" && options[highlightedIndex]) {
      event.preventDefault();
      onSelect(options[highlightedIndex]);
    }
  };

  return {
    options,
    highlightedIndex,
    setHighlightedIndex,
    handleKeyDown,
    heading: showPopular ? t("search.suggestedDestinations") : undefined,
    emptyMessage: hasSettledNoMatches ? t("search.noMatches", { query: typedLocation }) : undefined,
    /** Call on every keystroke; the API query follows after the debounce. */
    queueQuery: (value: string) => {
      setHighlightedIndex(-1);
      debouncedSetLocationQuery(value);
    },
    /** Jump straight to a value (picked option, cleared input) without waiting. */
    setQuery: (value: string) => {
      setHighlightedIndex(-1);
      setLocationQuery(value.trim());
    },
  };
};
