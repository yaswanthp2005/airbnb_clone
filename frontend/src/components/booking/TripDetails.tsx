"use client";

import { useState } from "react";

import { t } from "@/common/i18n";
import type { GuestCounts } from "@/components/search/constants";
import { formatDateRange, formatGuestSummary, type GuestBoundsOptions } from "@/components/search/utils";
import type { StayDates } from "@/components/listingDetail/utils";

import EditDatesModal from "./EditDatesModal";
import EditGuestsModal from "./EditGuestsModal";

type TripDetailsProps = {
  dates: StayDates;
  guests: GuestCounts;
  guestLimits: GuestBoundsOptions;
  city: string;
  bookedDates: string[];
  bookedNights: Set<string>;
  datesError?: string;
  onDatesChange: (dates: StayDates) => void;
  onGuestsChange: (guests: GuestCounts) => void;
};

type TripRowProps = {
  label: string;
  value: string;
  error?: string;
  editLabel: string;
  onEdit: () => void;
};

const TripRow = ({ label, value, error, editLabel, onEdit }: TripRowProps) => (
  <div className="flex items-start justify-between gap-4">
    <div className="min-w-0">
      <h3 className="text-base font-semibold text-ink">{label}</h3>
      <p className="mt-1 text-base text-ink">{value}</p>
      {error ? (
        <p role="alert" className="mt-1 text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
    <button
      type="button"
      onClick={onEdit}
      aria-label={editLabel}
      className="shrink-0 rounded-lg px-2 py-1 text-base font-semibold text-ink underline underline-offset-2 hover:bg-surface-muted"
    >
      {t("checkout.trip.edit")}
    </button>
  </div>
);

const TripDetails = ({
  dates,
  guests,
  guestLimits,
  city,
  bookedDates,
  bookedNights,
  datesError,
  onDatesChange,
  onGuestsChange,
}: TripDetailsProps) => {
  const [openModal, setOpenModal] = useState<"dates" | "guests" | null>(null);
  const closeModal = (open: boolean) => {
    if (!open) {
      setOpenModal(null);
    }
  };

  return (
    <section aria-labelledby="your-trip-heading">
      <h2 id="your-trip-heading" className="text-[22px] font-semibold text-ink">
        {t("checkout.trip.title")}
      </h2>
      <div className="mt-6 flex flex-col gap-6">
        <TripRow
          label={t("checkout.trip.dates")}
          value={formatDateRange(dates.checkIn, dates.checkOut) ?? t("checkout.trip.addDates")}
          error={datesError}
          editLabel={t("checkout.trip.editDates")}
          onEdit={() => setOpenModal("dates")}
        />
        <TripRow
          label={t("checkout.trip.guests")}
          value={formatGuestSummary(guests) ?? t("checkout.trip.addGuests")}
          editLabel={t("checkout.trip.editGuests")}
          onEdit={() => setOpenModal("guests")}
        />
      </div>

      <EditDatesModal
        open={openModal === "dates"}
        onOpenChange={closeModal}
        dates={dates}
        city={city}
        bookedDates={bookedDates}
        bookedNights={bookedNights}
        onSave={onDatesChange}
      />
      <EditGuestsModal
        open={openModal === "guests"}
        onOpenChange={closeModal}
        guests={guests}
        guestLimits={guestLimits}
        onSave={onGuestsChange}
      />
    </section>
  );
};

export default TripDetails;
