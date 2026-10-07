"use client";

import { useRef, useState } from "react";
import { ChevronDown, Star } from "lucide-react";

import { t } from "@/common/i18n";
import type { GuestCounts, GuestKey } from "@/components/search/constants";
import GuestSteppers from "@/components/search/GuestSteppers";
import { formatGuestSummary, type GuestBoundsOptions } from "@/components/search/utils";
import { useDismiss } from "@/hooks/useDismiss";
import { cn } from "@/lib/utils";
import type { ListingDetail } from "@/types/listing";
import { formatPrice } from "@/utils/formatPrice";
import type { PriceBreakdown } from "@/utils/pricing";

import { RATING_DECIMALS, SECTION_IDS } from "../constants";
import { pluralize, type StayDates } from "../utils";
import DateFields from "./DateFields";
import DatesPopover from "./DatesPopover";
import PriceBreakdownList from "./PriceBreakdownList";
import ReserveButton from "./ReserveButton";

type OpenPanel = "dates" | "guests" | null;

type BookingCardProps = {
  listing: ListingDetail;
  dates: StayDates;
  guests: GuestCounts;
  guestLimits: GuestBoundsOptions;
  bookedDates: string[];
  bookedNights: Set<string>;
  breakdown: PriceBreakdown | null;
  isBookable: boolean;
  onDatesChange: (dates: StayDates) => void;
  onGuestsChange: (key: GuestKey, delta: number) => void;
  onReserve: () => void;
};

const BookingCard = ({
  listing,
  dates,
  guests,
  guestLimits,
  bookedDates,
  bookedNights,
  breakdown,
  isBookable,
  onDatesChange,
  onGuestsChange,
  onReserve,
}: BookingCardProps) => {
  const [openPanel, setOpenPanel] = useState<OpenPanel>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  useDismiss(cardRef, openPanel !== null, () => setOpenPanel(null));

  const togglePanel = (panel: Exclude<OpenPanel, null>) =>
    setOpenPanel(current => (current === panel ? null : panel));

  const handleDatesChange = (next: StayDates) => {
    onDatesChange(next);
    if (next.checkIn && next.checkOut) {
      setOpenPanel(null);
    }
  };

  const hasCompleteDates = Boolean(dates.checkIn && dates.checkOut);
  const hasReviews = listing.reviewCount > 0;

  return (
    <div ref={cardRef} className="relative rounded-xl border border-hairline bg-surface-raised p-6 shadow-card">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-ink">
          <span className="text-[22px] font-semibold">{formatPrice(listing.pricePerNight)}</span>{" "}
          <span className="text-base">{t("listingDetail.booking.perNight")}</span>
        </p>
        {hasReviews ? (
          <p className="flex items-center gap-1 text-sm text-ink">
            <Star className="size-3 fill-ink" aria-hidden="true" />
            <span className="font-semibold">{listing.ratingAvg.toFixed(RATING_DECIMALS)}</span>
            <span aria-hidden="true">·</span>
            <a
              href={`#${SECTION_IDS.reviews}`}
              className="text-ink-muted underline underline-offset-2"
            >
              {pluralize(listing.reviewCount, "listingDetail.overview.reviews")}
            </a>
          </p>
        ) : null}
      </div>

      <div className="relative mt-6 rounded-lg border border-input">
        <DateFields
          checkIn={dates.checkIn}
          checkOut={dates.checkOut}
          activeField={openPanel === "dates" ? (dates.checkIn && !dates.checkOut ? "checkOut" : "checkIn") : null}
          onFieldClick={() => togglePanel("dates")}
        />
        <button
          type="button"
          onClick={() => togglePanel("guests")}
          aria-expanded={openPanel === "guests"}
          className={cn(
            "flex w-full items-center justify-between rounded-b-lg border-t border-input px-3 py-2.5 text-left",
            openPanel === "guests" && "rounded-lg ring-2 ring-ink",
          )}
        >
          <span className="min-w-0">
            <span className="block text-[10px] font-extrabold uppercase tracking-wide text-ink">
              {t("listingDetail.booking.guests")}
            </span>
            <span className="block truncate text-sm text-ink">{formatGuestSummary(guests)}</span>
          </span>
          <ChevronDown
            className={cn("size-5 shrink-0 transition-transform", openPanel === "guests" && "rotate-180")}
            aria-hidden="true"
          />
        </button>

        {openPanel === "guests" ? (
          <div className="absolute inset-x-0 top-full z-20 mt-1 rounded-lg bg-surface-raised px-4 pb-4 shadow-menu">
            <GuestSteppers
              counts={guests}
              onChange={onGuestsChange}
              bounds={guestLimits}
              rowClassName="border-b-0 py-4"
            />
            <p className="mt-2 text-xs text-ink-muted">
              {t("listingDetail.booking.maxGuestsNote", { count: listing.maxGuests })}
            </p>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setOpenPanel(null)}
                className="rounded-lg px-2 py-1 text-base font-semibold text-ink underline underline-offset-2 hover:bg-surface-muted"
              >
                {t("listingDetail.close")}
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {openPanel === "dates" ? (
        <DatesPopover
          {...dates}
          city={listing.city}
          bookedDates={bookedDates}
          bookedNights={bookedNights}
          onChange={handleDatesChange}
          onClose={() => setOpenPanel(null)}
        />
      ) : null}

      {hasCompleteDates && !isBookable ? (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {t("listingDetail.booking.datesUnavailable")}
        </p>
      ) : null}

      <ReserveButton disabled={!isBookable} onClick={onReserve} className="mt-4 w-full" />

      {breakdown && isBookable ? (
        <>
          <p className="mt-4 text-center text-sm text-ink">
            {t("listingDetail.booking.notChargedYet")}
          </p>
          <PriceBreakdownList breakdown={breakdown} />
        </>
      ) : null}
    </div>
  );
};

export default BookingCard;
