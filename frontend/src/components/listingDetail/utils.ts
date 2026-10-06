import { addDays, differenceInYears, format, isBefore, parseISO } from "date-fns";
import type { Matcher } from "react-day-picker";

import { t } from "@/common/i18n";
import { countNights } from "@/utils/pricing";
import { fromDateParam, toDateParam } from "@/utils/dateParam";

import { FIELD_DATE_FORMAT, LONG_DATE_FORMAT } from "./constants";

export type StayDates = {
  /** `yyyy-MM-dd` */
  checkIn?: string;
  /** `yyyy-MM-dd` */
  checkOut?: string;
};

export const pluralize = (count: number, key: string) =>
  t(count === 1 ? `${key}One` : `${key}Other`, { count });

export const yearsSince = (isoDate: string) => differenceInYears(new Date(), parseISO(isoDate));

export const firstName = (name: string) => name.split(" ")[0];

export const yearsHostingLabel = (joinedAt: string) => {
  const years = yearsSince(joinedAt);
  return years > 0
    ? pluralize(years, "listingDetail.host.yearsHosting")
    : t("listingDetail.host.newHost");
};

export const formatFieldDate = (value?: string) => {
  const date = fromDateParam(value);
  return date ? format(date, FIELD_DATE_FORMAT) : undefined;
};

const formatLongDate = (value: string) => {
  const date = fromDateParam(value);
  return date ? format(date, LONG_DATE_FORMAT) : value;
};

/** A stay occupies every night from check-in up to (not including) checkout. */
const isStayFree = (checkIn: string, checkOut: string, bookedNights: Set<string>) => {
  const end = fromDateParam(checkOut);
  for (let night = fromDateParam(checkIn); night && end && isBefore(night, end); night = addDays(night, 1)) {
    if (bookedNights.has(toDateParam(night))) {
      return false;
    }
  }
  return true;
};

export const isStayBookable = (
  { checkIn, checkOut }: StayDates,
  bookedNights: Set<string>,
  today: Date,
) => {
  const start = fromDateParam(checkIn);
  if (!checkIn || !checkOut || !start || countNights(checkIn, checkOut) === 0) {
    return false;
  }
  return !isBefore(start, today) && isStayFree(checkIn, checkOut, bookedNights);
};

/**
 * Airbnb-style picking: the first click sets check-in, the next later click sets checkout
 * if no booked night sits in between; anything else restarts from the clicked day.
 */
export const nextStayDates = (
  current: StayDates,
  day: Date,
  bookedNights: Set<string>,
): StayDates => {
  const clicked = toDateParam(day);
  if (!current.checkIn || current.checkOut || clicked <= current.checkIn) {
    return { checkIn: clicked };
  }
  return isStayFree(current.checkIn, clicked, bookedNights)
    ? { checkIn: current.checkIn, checkOut: clicked }
    : { checkIn: clicked };
};

/**
 * Booked nights can't start a stay. While picking checkout, the first booked night after
 * check-in is still selectable (you can leave the morning someone else arrives).
 */
export const disabledStayDays = (
  { checkIn, checkOut }: StayDates,
  bookedDates: string[],
  bookedNights: Set<string>,
  today: Date,
): Matcher[] => {
  const isBooked = (date: Date) => bookedNights.has(toDateParam(date));
  const checkInDate = fromDateParam(checkIn);

  if (!checkIn || !checkInDate || checkOut) {
    return [{ before: today }, (date: Date) => isBooked(date) && toDateParam(date) !== checkOut];
  }

  const lastPossibleCheckOut = fromDateParam(bookedDates.find(night => night > checkIn));
  return [
    { before: today },
    (date: Date) => isBefore(date, checkInDate) && isBooked(date),
    ...(lastPossibleCheckOut ? [{ after: lastPossibleCheckOut }] : []),
  ];
};

export const stayHeading = ({ checkIn, checkOut }: StayDates, city: string) => {
  const nights = countNights(checkIn, checkOut);
  if (checkIn && checkOut && nights > 0) {
    return {
      title: t("listingDetail.availability.nightsIn", {
        nights: pluralize(nights, "listingDetail.availability.nights"),
        city,
      }),
      subtitle: t("listingDetail.availability.dateRange", {
        start: formatLongDate(checkIn),
        end: formatLongDate(checkOut),
      }),
    };
  }
  if (checkIn) {
    return {
      title: t("listingDetail.availability.selectCheckOut"),
      subtitle: t("listingDetail.availability.minimumStay"),
    };
  }
  return {
    title: t("listingDetail.availability.selectCheckIn"),
    subtitle: t("listingDetail.availability.addDatesHint"),
  };
};
