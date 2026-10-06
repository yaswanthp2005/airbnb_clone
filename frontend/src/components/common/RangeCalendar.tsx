"use client";

import type { ComponentProps } from "react";
import type { DateRange, Matcher, OnSelectHandler } from "react-day-picker";

import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

type RangeCalendarProps = {
  selected?: DateRange;
  onSelect: OnSelectHandler<DateRange | undefined>;
  disabled?: Matcher | Matcher[];
  startMonth: Date;
  endMonth: Date;
  defaultMonth?: Date;
  numberOfMonths?: number;
  className?: string;
  /** Layout of the month grid; months sit side by side from `md` by default. */
  monthsClassName?: string;
};

const DayButton = (props: ComponentProps<typeof CalendarDayButton>) => (
  <CalendarDayButton
    {...props}
    className="rounded-full text-sm font-semibold enabled:hover:border enabled:hover:border-ink data-[range-end=true]:rounded-full data-[range-end=true]:bg-ink data-[range-middle=true]:bg-surface-muted data-[range-start=true]:rounded-full data-[range-start=true]:bg-ink data-[selected-single=true]:bg-ink"
  />
);

const RangeCalendar = ({
  className,
  monthsClassName = "md:flex-row",
  ...props
}: RangeCalendarProps) => (
  <Calendar
    mode="range"
    resetOnSelect
    showOutsideDays={false}
    {...props}
    className={cn("p-0 [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)]", className)}
    classNames={{
      months: cn("relative flex flex-col gap-12", monthsClassName),
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
);

export default RangeCalendar;
