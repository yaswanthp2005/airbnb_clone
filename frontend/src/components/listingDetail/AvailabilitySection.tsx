"use client";

import { t } from "@/common/i18n";

import AvailabilityCalendar from "./AvailabilityCalendar";
import { SECTION_IDS } from "./constants";
import { stayHeading, type StayDates } from "./utils";

type AvailabilitySectionProps = StayDates & {
  city: string;
  bookedDates: string[];
  bookedNights: Set<string>;
  onChange: (dates: StayDates) => void;
};

const AvailabilitySection = ({ city, ...calendarProps }: AvailabilitySectionProps) => {
  const { title, subtitle } = stayHeading(calendarProps, city);

  return (
    <section id={SECTION_IDS.availability} className="py-12">
      <h2 className="text-[22px] font-semibold text-ink">{title}</h2>
      <p className="mt-2 text-sm text-ink-muted">{subtitle}</p>
      <div className="mt-6">
        <AvailabilityCalendar
          {...calendarProps}
          className="[--cell-size:--spacing(10)] md:[--cell-size:--spacing(10)] xl:[--cell-size:--spacing(10.5)]"
          monthsClassName="gap-8 xl:flex-row"
        />
      </div>
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          disabled={!calendarProps.checkIn}
          onClick={() => calendarProps.onChange({})}
          className="rounded-lg px-2 py-1 text-sm font-semibold text-ink underline underline-offset-2 transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:text-ink-muted disabled:no-underline"
        >
          {t("listingDetail.availability.clearDates")}
        </button>
      </div>
    </section>
  );
};

export default AvailabilitySection;
