export const CARD_NUMBER_MIN_DIGITS = 13;
export const CARD_NUMBER_MAX_DIGITS = 19;
export const CARD_NUMBER_GROUP_SIZE = 4;
export const CVV_MIN_DIGITS = 3;
export const CVV_MAX_DIGITS = 4;
/** `MMYY` */
export const EXPIRY_DIGITS = 4;
export const EXPIRY_CENTURY = 2000;
export const MONTHS_IN_YEAR = 12;
export const INDIA_PIN_CODE_DIGITS = 6;
export const POSTAL_CODE_MAX_LENGTH = 10;

/** Passes the Luhn check; shown as a hint because payment is mocked. */
export const DEMO_CARD_NUMBER = "4242 4242 4242 4242";

export const DEFAULT_COUNTRY = "IN";
/** Labels live under `checkout.payment.countries.<code>`. */
export const COUNTRY_CODES = ["IN", "AE", "GB", "SG", "US"] as const;

export const TRIP_DATE_FORMAT = "EEE, d MMM yyyy";
export const CHECKOUT_PHOTO_SIZES = "128px";
export const CONFIRMATION_PHOTO_SIZES = "(min-width: 768px) 320px, 100vw";
