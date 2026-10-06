import { addDays, format, isSameMonth } from "date-fns";

import { t } from "@/common/i18n";
import type { ListingFilters } from "@/types/listing";
import { fromDateParam, toDateParam } from "@/utils/dateParam";

import {
  EMPTY_GUEST_COUNTS,
  MAX_GUESTS,
  MAX_INFANTS,
  MAX_PETS,
  type GuestCounts,
  type GuestKey,
} from "./constants";

export type SearchDraft = GuestCounts & {
  location: string;
  checkIn?: string;
  checkOut?: string;
};

const DAY_FORMAT = "d";
const DAY_MONTH_FORMAT = "d MMM";

export const draftFromFilters = (filters: ListingFilters): SearchDraft => ({
  location: filters.location ?? "",
  checkIn: filters.checkIn,
  checkOut: filters.checkOut,
  adults: filters.adults ?? EMPTY_GUEST_COUNTS.adults,
  children: filters.children ?? EMPTY_GUEST_COUNTS.children,
  infants: filters.infants ?? EMPTY_GUEST_COUNTS.infants,
  pets: filters.pets ?? EMPTY_GUEST_COUNTS.pets,
});

/** Every search key is present so spreading this over existing filters clears removed values. */
export const draftToFilters = (draft: SearchDraft) => {
  const checkInDate = fromDateParam(draft.checkIn);
  const checkOut =
    draft.checkOut ?? (checkInDate ? toDateParam(addDays(checkInDate, 1)) : undefined);

  return {
    location: draft.location.trim() || undefined,
    checkIn: checkInDate ? draft.checkIn : undefined,
    checkOut: checkInDate ? checkOut : undefined,
    adults: draft.adults || undefined,
    children: draft.children || undefined,
    infants: draft.infants || undefined,
    pets: draft.pets || undefined,
  } satisfies Partial<ListingFilters>;
};

export const totalGuests = ({ adults, children }: Pick<GuestCounts, "adults" | "children">) =>
  adults + children;

export const formatDateRange = (checkIn?: string, checkOut?: string): string | undefined => {
  const start = fromDateParam(checkIn);
  if (!start) {
    return undefined;
  }
  const end = fromDateParam(checkOut);
  if (!end) {
    return format(start, DAY_MONTH_FORMAT);
  }
  return isSameMonth(start, end)
    ? `${format(start, DAY_FORMAT)}–${format(end, DAY_MONTH_FORMAT)}`
    : `${format(start, DAY_MONTH_FORMAT)} – ${format(end, DAY_MONTH_FORMAT)}`;
};

const pluralize = (count: number, key: string) =>
  t(count === 1 ? `${key}One` : `${key}Other`, { count });

export const formatGuestSummary = (counts: GuestCounts): string | undefined => {
  const guests = totalGuests(counts);
  if (guests === 0) {
    return undefined;
  }
  return [
    pluralize(guests, "search.summary.guests"),
    counts.infants ? pluralize(counts.infants, "search.summary.infants") : null,
    counts.pets ? pluralize(counts.pets, "search.summary.pets") : null,
  ]
    .filter(Boolean)
    .join(", ");
};

/** Children, infants and pets need an accompanying adult, so adults can't drop below one while they're present. */
export const guestBounds = (counts: GuestCounts, key: GuestKey) => {
  const hasDependants = counts.children + counts.infants + counts.pets > 0;
  const guestsLeft = MAX_GUESTS - totalGuests(counts);
  const seatForAutoAdult = counts.adults === 0 ? 1 : 0;

  switch (key) {
    case "adults":
      return { min: hasDependants ? 1 : 0, max: counts.adults + guestsLeft };
    case "children":
      return { min: 0, max: counts.children + guestsLeft - seatForAutoAdult };
    case "infants":
      return { min: 0, max: MAX_INFANTS };
    case "pets":
      return { min: 0, max: MAX_PETS };
  }
};

export const updateGuestCount = (
  counts: GuestCounts,
  key: GuestKey,
  delta: number,
): GuestCounts => {
  const { min, max } = guestBounds(counts, key);
  const next = { ...counts, [key]: Math.min(Math.max(counts[key] + delta, min), max) };
  if (key !== "adults" && next[key] > 0 && next.adults === 0) {
    next.adults = 1;
  }
  return next;
};
