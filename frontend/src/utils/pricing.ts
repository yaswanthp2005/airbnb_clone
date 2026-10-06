import { differenceInCalendarDays } from "date-fns";

import { SERVICE_FEE_RATE } from "@/constants";
import { fromDateParam } from "@/utils/dateParam";

export type PriceBreakdown = {
  nights: number;
  nightlyPrice: number;
  lodgingTotal: number;
  cleaningFee: number;
  serviceFee: number;
  total: number;
};

type PriceInput = {
  nightlyPrice: number;
  cleaningFee: number;
  /** `yyyy-MM-dd` */
  checkIn?: string;
  /** `yyyy-MM-dd` */
  checkOut?: string;
};

/** Nights between two `yyyy-MM-dd` dates; 0 when either is missing or the range is empty. */
export const countNights = (checkIn?: string, checkOut?: string): number => {
  const start = fromDateParam(checkIn);
  const end = fromDateParam(checkOut);
  if (!start || !end) {
    return 0;
  }
  return Math.max(differenceInCalendarDays(end, start), 0);
};

/** nights × nightly price + cleaning fee + service fee (SERVICE_FEE_RATE of that subtotal). */
export const calculatePriceBreakdown = ({
  nightlyPrice,
  cleaningFee,
  checkIn,
  checkOut,
}: PriceInput): PriceBreakdown | null => {
  const nights = countNights(checkIn, checkOut);
  if (nights === 0) {
    return null;
  }
  const lodgingTotal = nights * nightlyPrice;
  const serviceFee = Math.round((lodgingTotal + cleaningFee) * SERVICE_FEE_RATE);

  return {
    nights,
    nightlyPrice,
    lodgingTotal,
    cleaningFee,
    serviceFee,
    total: lodgingTotal + cleaningFee + serviceFee,
  };
};
