"use client";

import { useState } from "react";
import { startOfToday } from "date-fns";

import { t } from "@/common/i18n";
import AvailabilityCalendar from "@/components/listingDetail/AvailabilityCalendar";
import DetailModal from "@/components/listingDetail/DetailModal";
import { isStayBookable, stayHeading, type StayDates } from "@/components/listingDetail/utils";

type EditDatesModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dates: StayDates;
  city: string;
  bookedDates: string[];
  bookedNights: Set<string>;
  onSave: (dates: StayDates) => void;
};

/** Edits a draft so closing without saving keeps the trip's current dates. */
const EditDatesModal = ({
  open,
  onOpenChange,
  dates,
  city,
  bookedDates,
  bookedNights,
  onSave,
}: EditDatesModalProps) => {
  const [draft, setDraft] = useState<StayDates>(dates);
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setDraft(dates);
    }
  }

  const { title, subtitle } = stayHeading(draft, city);
  const canSave = isStayBookable(draft, bookedNights, startOfToday());

  return (
    <DetailModal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      footer={
        <>
          <button
            type="button"
            disabled={!draft.checkIn}
            onClick={() => setDraft({})}
            className="rounded-lg px-2 py-1 text-sm font-semibold text-ink underline underline-offset-2 hover:bg-surface-muted disabled:cursor-not-allowed disabled:text-ink-muted disabled:no-underline"
          >
            {t("listingDetail.availability.clearDates")}
          </button>
          <button
            type="button"
            disabled={!canSave}
            onClick={() => {
              onSave(draft);
              onOpenChange(false);
            }}
            className="rounded-lg bg-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t("common.save")}
          </button>
        </>
      }
    >
      <p className="-mt-4 mb-6 text-sm text-ink-muted">{subtitle}</p>
      <AvailabilityCalendar
        {...draft}
        bookedDates={bookedDates}
        bookedNights={bookedNights}
        onChange={setDraft}
        className="[--cell-size:--spacing(10)] md:[--cell-size:--spacing(10.5)]"
        monthsClassName="gap-8 md:flex-row"
      />
    </DetailModal>
  );
};

export default EditDatesModal;
