"use client";

import { addMonths, isSameDay, startOfToday } from "date-fns";
import type { ComponentProps } from "react";
import type { DateRange } from "react-day-picker";

import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { fromDateParam, toDateParam } from "@/utils/dateParam";

import { CALENDAR_MAX_MONTHS_AHEAD, CALENDAR_MONTHS } from "../constants";

type WhenPanelProps = {
  checkIn?: string;
  checkOut?: string;
  onChange: (dates: { checkIn?: string; checkOut?: string }) => void;
};

const DayButton = (props: ComponentProps<typeof CalendarDayButton>) => (
  <CalendarDayButton
    {...props}
    className="rounded-full text-sm font-semibold enabled:hover:border enabled:hover:border-ink data-[range-end=true]:rounded-full data-[range-end=true]:bg-ink data-[range-middle=true]:bg-surface-muted data-[range-start=true]:rounded-full data-[range-start=true]:bg-ink data-[selected-single=true]:bg-ink"
  />
);

const WhenPanel = ({ checkIn, checkOut, onChange }: WhenPanelProps) => {
  const today = startOfToday();
  const selected: DateRange | undefined = checkIn
    ? { from: fromDateParam(checkIn), to: fromDateParam(checkOut) }
    : undefined;

  const handleSelect = (range: DateRange | undefined) => {
    const from = range?.from;
    const to = range?.to && from && !isSameDay(range.to, from) ? range.to : undefined;
    onChange({
      checkIn: from ? toDateParam(from) : undefined,
      checkOut: to ? toDateParam(to) : undefined,
    });
  };

  return (
    <div className="absolute left-1/2 top-full z-50 mt-3 flex w-full -translate-x-1/2 justify-center rounded-[32px] bg-white px-8 py-8 shadow-menu">
      <Calendar
        mode="range"
        numberOfMonths={CALENDAR_MONTHS}
        selected={selected}
        onSelect={handleSelect}
        resetOnSelect
        disabled={{ before: today }}
        startMonth={today}
        endMonth={addMonths(today, CALENDAR_MAX_MONTHS_AHEAD)}
        defaultMonth={selected?.from ?? today}
        showOutsideDays={false}
        className="p-0 [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)]"
        classNames={{
          months: "relative flex flex-col gap-12 md:flex-row",
          month_caption: "flex h-(--cell-size) w-full items-center justify-center",
          caption_label: "text-base font-semibold text-ink",
          weekday: "flex-1 text-xs font-semibold text-ink-muted select-none",
          today: "underline underline-offset-4",
          range_start:
            "relative isolate z-0 rounded-l-full bg-surface-muted after:absolute after:inset-y-0 after:right-0 after:w-4 after:bg-surface-muted",
          range_end:
            "relative isolate z-0 rounded-r-full bg-surface-muted after:absolute after:inset-y-0 after:left-0 after:w-4 after:bg-surface-muted",
          disabled: "text-hairline line-through",
        }}
        components={{ DayButton }}
      />
    </div>
  );
};

export default WhenPanel;
