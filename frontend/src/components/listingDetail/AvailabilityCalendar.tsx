"use client";

import { addMonths, startOfToday } from "date-fns";

import RangeCalendar from "@/components/common/RangeCalendar";
import { CALENDAR_MAX_MONTHS_AHEAD, CALENDAR_MONTHS } from "@/components/search/constants";
import { fromDateParam } from "@/utils/dateParam";

import { disabledStayDays, nextStayDates, type StayDates } from "./utils";

type AvailabilityCalendarProps = StayDates & {
  bookedDates: string[];
  bookedNights: Set<string>;
  onChange: (dates: StayDates) => void;
  className?: string;
  monthsClassName?: string;
};

const AvailabilityCalendar = ({
  checkIn,
  checkOut,
  bookedDates,
  bookedNights,
  onChange,
  className,
  monthsClassName,
}: AvailabilityCalendarProps) => {
  const today = startOfToday();
  const from = fromDateParam(checkIn);

  return (
    <RangeCalendar
      numberOfMonths={CALENDAR_MONTHS}
      selected={from ? { from, to: fromDateParam(checkOut) } : undefined}
      onSelect={(_range, day) => onChange(nextStayDates({ checkIn, checkOut }, day, bookedNights))}
      disabled={disabledStayDays({ checkIn, checkOut }, bookedDates, bookedNights, today)}
      startMonth={today}
      endMonth={addMonths(today, CALENDAR_MAX_MONTHS_AHEAD)}
      defaultMonth={from ?? today}
      className={className}
      monthsClassName={monthsClassName}
    />
  );
};

export default AvailabilityCalendar;
