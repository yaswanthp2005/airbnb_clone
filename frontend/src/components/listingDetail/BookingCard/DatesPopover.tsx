import { t } from "@/common/i18n";

import AvailabilityCalendar from "../AvailabilityCalendar";
import { stayHeading, type StayDates } from "../utils";
import DateFields from "./DateFields";

type DatesPopoverProps = StayDates & {
  city: string;
  bookedDates: string[];
  bookedNights: Set<string>;
  onChange: (dates: StayDates) => void;
  onClose: () => void;
};

const DatesPopover = ({ city, onClose, ...calendarProps }: DatesPopoverProps) => {
  const { title, subtitle } = stayHeading(calendarProps, city);

  return (
    <div
      role="dialog"
      aria-label={t("listingDetail.booking.selectDates")}
      className="absolute -right-4 -top-4 z-30 w-[680px] max-w-[calc(100vw-3rem)] rounded-3xl bg-white px-8 pb-6 pt-8 shadow-menu"
    >
      <div className="flex items-start justify-between gap-6">
        <div>
          <h3 className="text-[22px] font-semibold text-ink">{title}</h3>
          <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>
        </div>
        <DateFields
          checkIn={calendarProps.checkIn}
          checkOut={calendarProps.checkOut}
          activeField={calendarProps.checkIn && !calendarProps.checkOut ? "checkOut" : "checkIn"}
          className="hidden w-[290px] shrink-0 rounded-lg border border-input sm:grid"
        />
      </div>
      <div className="mt-6">
        <AvailabilityCalendar
          {...calendarProps}
          className="[--cell-size:--spacing(10)] md:[--cell-size:--spacing(10.5)]"
          monthsClassName="gap-8 md:flex-row"
        />
      </div>
      <div className="mt-4 flex items-center justify-end gap-4">
        <button
          type="button"
          disabled={!calendarProps.checkIn}
          onClick={() => calendarProps.onChange({})}
          className="rounded-lg px-2 py-1 text-sm font-semibold text-ink underline underline-offset-2 hover:bg-surface-muted disabled:cursor-not-allowed disabled:text-ink-muted disabled:no-underline"
        >
          {t("listingDetail.availability.clearDates")}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-black"
        >
          {t("listingDetail.close")}
        </button>
      </div>
    </div>
  );
};

export default DatesPopover;
