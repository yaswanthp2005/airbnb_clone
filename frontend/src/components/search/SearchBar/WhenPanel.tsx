"use client";

import { addMonths, startOfToday } from "date-fns";

import RangeCalendar from "@/components/common/RangeCalendar";

import { CALENDAR_MAX_MONTHS_AHEAD, CALENDAR_MONTHS } from "../constants";
import { datesToRange, rangeToDates, type StayDateParams } from "../utils";

type WhenPanelProps = StayDateParams & {
  onChange: (dates: StayDateParams) => void;
};

const WhenPanel = ({ checkIn, checkOut, onChange }: WhenPanelProps) => {
  const today = startOfToday();
  const selected = datesToRange({ checkIn, checkOut });

  return (
    <div className="absolute left-1/2 top-full z-50 mt-3 flex w-full -translate-x-1/2 justify-center rounded-[32px] bg-surface-raised px-8 py-8 shadow-menu">
      <RangeCalendar
        numberOfMonths={CALENDAR_MONTHS}
        selected={selected}
        onSelect={range => onChange(rangeToDates(range))}
        disabled={{ before: today }}
        startMonth={today}
        endMonth={addMonths(today, CALENDAR_MAX_MONTHS_AHEAD)}
        defaultMonth={selected?.from ?? today}
      />
    </div>
  );
};

export default WhenPanel;
