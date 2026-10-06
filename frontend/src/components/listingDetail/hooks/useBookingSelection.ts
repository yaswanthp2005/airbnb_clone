"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { filtersFromSearchParams } from "@/components/listings/utils";
import {
  MAX_INFANTS,
  MAX_PETS,
  type GuestCounts,
  type GuestKey,
} from "@/components/search/constants";
import { updateGuestCount } from "@/components/search/utils";
import { LISTING_FILTER_PARAMS } from "@/constants";

import type { StayDates } from "../utils";

export type BookingSelection = GuestCounts & StayDates;

const MIN_ADULTS = 1;

const clampGuests = (counts: GuestCounts, maxGuests: number): GuestCounts => {
  const adults = Math.min(Math.max(counts.adults, MIN_ADULTS), maxGuests);
  return {
    adults,
    children: Math.min(counts.children, maxGuests - adults),
    infants: Math.min(counts.infants, MAX_INFANTS),
    pets: Math.min(counts.pets, MAX_PETS),
  };
};

const setOrDelete = (params: URLSearchParams, key: string, value?: string | number) => {
  if (value) {
    params.set(key, String(value));
  } else {
    params.delete(key);
  }
};

/**
 * Dates + guests for the booking card, seeded from (and mirrored to) the URL so a
 * search carries over and the page stays shareable. `replaceState` avoids a server round trip.
 */
export const useBookingSelection = (maxGuests: number) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [selection, setSelection] = useState<BookingSelection>(() => {
    const filters = filtersFromSearchParams(searchParams);
    return {
      checkIn: filters.checkIn,
      checkOut: filters.checkOut,
      ...clampGuests(
        {
          adults: filters.adults ?? 0,
          children: filters.children ?? 0,
          infants: filters.infants ?? 0,
          pets: filters.pets ?? 0,
        },
        maxGuests,
      ),
    };
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hasStay = Boolean(selection.checkIn && selection.checkOut);
    setOrDelete(params, LISTING_FILTER_PARAMS.checkIn, hasStay ? selection.checkIn : undefined);
    setOrDelete(params, LISTING_FILTER_PARAMS.checkOut, hasStay ? selection.checkOut : undefined);
    setOrDelete(params, LISTING_FILTER_PARAMS.adults, selection.adults);
    setOrDelete(params, LISTING_FILTER_PARAMS.children, selection.children);
    setOrDelete(params, LISTING_FILTER_PARAMS.infants, selection.infants);
    setOrDelete(params, LISTING_FILTER_PARAMS.pets, selection.pets);

    const query = params.toString();
    if (query !== window.location.search.replace(/^\?/, "")) {
      window.history.replaceState(null, "", query ? `${pathname}?${query}` : pathname);
    }
  }, [selection, pathname]);

  const setDates = useCallback(
    (dates: StayDates) =>
      setSelection(current => ({ ...current, checkIn: dates.checkIn, checkOut: dates.checkOut })),
    [],
  );

  const setGuests = useCallback(
    (counts: GuestCounts) =>
      setSelection(current => ({ ...current, ...clampGuests(counts, maxGuests) })),
    [maxGuests],
  );

  const changeGuests = useCallback(
    (key: GuestKey, delta: number) =>
      setSelection(current => ({
        ...current,
        ...updateGuestCount(current, key, delta, { maxGuests, minAdults: MIN_ADULTS }),
      })),
    [maxGuests],
  );

  return {
    selection,
    setDates,
    setGuests,
    changeGuests,
    guestLimits: { maxGuests, minAdults: MIN_ADULTS },
  };
};
