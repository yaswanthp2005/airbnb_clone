import { format, isValid, parse } from "date-fns";

import { DATE_PARAM_FORMAT } from "@/constants";

export const toDateParam = (date: Date): string => format(date, DATE_PARAM_FORMAT);

export const fromDateParam = (value?: string | null): Date | undefined => {
  if (!value) {
    return undefined;
  }
  const date = parse(value, DATE_PARAM_FORMAT, new Date());
  return isValid(date) && toDateParam(date) === value ? date : undefined;
};
