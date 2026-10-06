"use client";

import { addMonths, isSameDay, startOfToday } from "date-fns";
import type { DateRange } from "react-day-picker";

import RangeCalendar from "@/components/common/RangeCalendar";
import { fromDateParam, toDateParam } from "@/utils/dateParam";

import { CALENDAR_MAX_MONTHS_AHEAD, CALENDAR_MONTHS } from "../constants";

type WhenPanelProps = {
  checkIn?: string;
  checkOut?: string;
  onChange: (dates: { checkIn?: string; checkOut?: string }) => void;
};

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
      <RangeCalendar
        numberOfMonths={CALENDAR_MONTHS}
        selected={selected}
        onSelect={handleSelect}
        disabled={{ before: today }}
        startMonth={today}
        endMonth={addMonths(today, CALENDAR_MAX_MONTHS_AHEAD)}
        defaultMonth={selected?.from ?? today}
      />
    </div>
  );
};

export default WhenPanel;
