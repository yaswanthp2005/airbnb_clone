import { format } from "date-fns";

import { t } from "@/common/i18n";
import type { Booking } from "@/types/booking";
import { fromDateParam } from "@/utils/dateParam";
import type { PriceBreakdown } from "@/utils/pricing";

import {
  CARD_NUMBER_GROUP_SIZE,
  CARD_NUMBER_MAX_DIGITS,
  CARD_NUMBER_MIN_DIGITS,
  CVV_MAX_DIGITS,
  CVV_MIN_DIGITS,
  DEFAULT_COUNTRY,
  EXPIRY_CENTURY,
  EXPIRY_DIGITS,
  INDIA_PIN_CODE_DIGITS,
  MONTHS_IN_YEAR,
  POSTAL_CODE_MAX_LENGTH,
  TRIP_DATE_FORMAT,
} from "./constants";

export type CardDetails = {
  cardNumber: string;
  expiry: string;
  cvv: string;
  postalCode: string;
  country: string;
};

export type CardField = keyof CardDetails;
export type CardErrors = Partial<Record<CardField, string>>;

export const EMPTY_CARD: CardDetails = {
  cardNumber: "",
  expiry: "",
  cvv: "",
  postalCode: "",
  country: DEFAULT_COUNTRY,
};

const digitsOnly = (value: string) => value.replace(/\D/g, "");

const CARD_GROUP_PATTERN = new RegExp(`(\\d{${CARD_NUMBER_GROUP_SIZE}})(?=\\d)`, "g");

/** Keeps digits only and groups them like a card: `4242 4242 4242 4242`. */
export const formatCardNumber = (value: string) =>
  digitsOnly(value).slice(0, CARD_NUMBER_MAX_DIGITS).replace(CARD_GROUP_PATTERN, "$1 ");

/** `MM/YY` while typing. */
export const formatExpiry = (value: string) => {
  const digits = digitsOnly(value).slice(0, EXPIRY_DIGITS);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

export const formatCvv = (value: string) => digitsOnly(value).slice(0, CVV_MAX_DIGITS);

export const formatPostalCode = (value: string, country: string) =>
  country === DEFAULT_COUNTRY
    ? digitsOnly(value).slice(0, INDIA_PIN_CODE_DIGITS)
    : value.slice(0, POSTAL_CODE_MAX_LENGTH);

const passesLuhn = (digits: string) => {
  let sum = 0;
  for (let index = 0; index < digits.length; index += 1) {
    let digit = Number(digits[digits.length - 1 - index]);
    if (index % 2 === 1) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
  }
  return sum % 10 === 0;
};

const isExpiryInFuture = (expiry: string, today: Date) => {
  const match = /^(\d{2})\/(\d{2})$/.exec(expiry);
  if (!match) {
    return false;
  }
  const month = Number(match[1]);
  const year = EXPIRY_CENTURY + Number(match[2]);
  if (month < 1 || month > MONTHS_IN_YEAR) {
    return false;
  }
  const currentYear = today.getFullYear();
  return year > currentYear || (year === currentYear && month >= today.getMonth() + 1);
};

const POSTAL_CODE_PATTERN = new RegExp(`^[A-Za-z0-9 -]{3,${POSTAL_CODE_MAX_LENGTH}}$`);

/** Client-side only: the mock card is never sent to the API. */
export const validateCard = (card: CardDetails, today: Date): CardErrors => {
  const errors: CardErrors = {};
  const cardDigits = digitsOnly(card.cardNumber);

  if (!cardDigits) {
    errors.cardNumber = t("checkout.payment.errors.cardNumberRequired");
  } else if (
    cardDigits.length < CARD_NUMBER_MIN_DIGITS ||
    cardDigits.length > CARD_NUMBER_MAX_DIGITS ||
    !passesLuhn(cardDigits)
  ) {
    errors.cardNumber = t("checkout.payment.errors.cardNumberInvalid");
  }

  if (!card.expiry) {
    errors.expiry = t("checkout.payment.errors.expiryRequired");
  } else if (!isExpiryInFuture(card.expiry, today)) {
    errors.expiry = t("checkout.payment.errors.expiryInvalid");
  }

  if (card.cvv.length < CVV_MIN_DIGITS || card.cvv.length > CVV_MAX_DIGITS) {
    errors.cvv = t("checkout.payment.errors.cvvInvalid");
  }

  const postalCode = card.postalCode.trim();
  const isIndia = card.country === DEFAULT_COUNTRY;
  const postalCodeValid = isIndia
    ? new RegExp(`^\\d{${INDIA_PIN_CODE_DIGITS}}$`).test(postalCode)
    : POSTAL_CODE_PATTERN.test(postalCode);
  if (!postalCodeValid) {
    errors.postalCode = t(
      isIndia ? "checkout.payment.errors.pinCodeInvalid" : "checkout.payment.errors.postalCodeInvalid",
    );
  }

  return errors;
};

export const formatTripDate = (value: string) => {
  const date = fromDateParam(value);
  return date ? format(date, TRIP_DATE_FORMAT) : value;
};

/** Rebuilds the breakdown from the prices the server stored on the booking. */
export const bookingBreakdown = (booking: Booking): PriceBreakdown => ({
  nights: booking.nights,
  nightlyPrice: booking.nightlyPrice,
  lodgingTotal: booking.totalPrice - booking.cleaningFee - booking.serviceFee,
  cleaningFee: booking.cleaningFee,
  serviceFee: booking.serviceFee,
  total: booking.totalPrice,
});
