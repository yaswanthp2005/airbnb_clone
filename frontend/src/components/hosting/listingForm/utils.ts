import { t } from "@/common/i18n";
import type { HostListing, HostListingInput } from "@/types/host";
import { formatPrice } from "@/utils/formatPrice";

import {
  BASICS_FIELDS,
  COORDINATE_LIMITS,
  DEFAULT_COUNTRY,
  LISTING_LIMITS,
  PHOTO_URL_SCHEMES,
} from "./constants";
import type { ListingFormErrors, ListingFormStep, ListingFormValues } from "./types";

export const EMPTY_LISTING_FORM: ListingFormValues = {
  propertyType: "",
  address: "",
  city: "",
  state: "",
  country: DEFAULT_COUNTRY,
  latitude: "",
  longitude: "",
  maxGuests: 2,
  bedrooms: 1,
  beds: 1,
  bathrooms: 1,
  amenities: [],
  photos: [],
  title: "",
  description: "",
  pricePerNight: "",
  cleaningFee: "",
};

export const listingToFormValues = (listing: HostListing): ListingFormValues => ({
  propertyType: listing.propertyType,
  address: listing.address,
  city: listing.city,
  state: listing.state,
  country: listing.country,
  latitude: String(listing.latitude),
  longitude: String(listing.longitude),
  maxGuests: listing.maxGuests,
  bedrooms: listing.bedrooms,
  beds: listing.beds,
  bathrooms: listing.bathrooms,
  amenities: listing.amenities,
  photos: listing.photos,
  title: listing.title,
  description: listing.description,
  pricePerNight: String(listing.pricePerNight),
  cleaningFee: listing.cleaningFee ? String(listing.cleaningFee) : "",
});

const toNumberOrNull = (value: string): number | null =>
  value.trim() === "" ? null : Number(value);

export const formValuesToInput = (values: ListingFormValues): HostListingInput => ({
  propertyType: values.propertyType,
  address: values.address.trim(),
  city: values.city.trim(),
  state: values.state.trim(),
  country: values.country.trim(),
  latitude: toNumberOrNull(values.latitude),
  longitude: toNumberOrNull(values.longitude),
  maxGuests: values.maxGuests,
  bedrooms: values.bedrooms,
  beds: values.beds,
  bathrooms: values.bathrooms,
  amenities: values.amenities,
  photos: values.photos,
  title: values.title.trim(),
  description: values.description.trim(),
  pricePerNight: Number(values.pricePerNight),
  cleaningFee: toNumberOrNull(values.cleaningFee) ?? 0,
});

export const digitsOnly = (value: string, maxDigits: number) =>
  value.replace(/\D/g, "").slice(0, maxDigits);

const textError = (value: string, min: number): string | undefined => {
  const length = value.trim().length;
  if (length === 0) {
    return t("hosting.form.errors.required");
  }
  return length < min ? t("hosting.form.errors.tooShort", { min }) : undefined;
};

const coordinateError = (value: string, limit: number, key: string): string | undefined => {
  const number = Number(value);
  return Number.isFinite(number) && Math.abs(number) <= limit
    ? undefined
    : t(`hosting.form.errors.${key}`);
};

/** Error for a photo URL about to be added, or `null` when it can be added. */
export const photoUrlError = (url: string, photos: string[]): string | null => {
  if (photos.length >= LISTING_LIMITS.maxPhotos) {
    return t("hosting.form.errors.photoLimit", { max: LISTING_LIMITS.maxPhotos });
  }
  try {
    const parsed = new URL(url);
    if (!PHOTO_URL_SCHEMES.includes(parsed.protocol) || url.length > LISTING_LIMITS.photoUrlMax) {
      return t("hosting.form.errors.photoInvalid");
    }
  } catch {
    return t("hosting.form.errors.photoInvalid");
  }
  return photos.includes(url) ? t("hosting.form.errors.photoDuplicate") : null;
};

type StepContext = {
  brokenPhotos: string[];
};

const compact = (errors: ListingFormErrors): ListingFormErrors =>
  Object.fromEntries(Object.entries(errors).filter(([, message]) => message)) as ListingFormErrors;

export const validateStep = (
  step: ListingFormStep,
  values: ListingFormValues,
  { brokenPhotos }: StepContext,
): ListingFormErrors => {
  switch (step) {
    case "propertyType":
      return compact({
        propertyType: values.propertyType ? undefined : t("hosting.form.errors.propertyType"),
      });
    case "location": {
      const hasLatitude = values.latitude.trim() !== "";
      const hasLongitude = values.longitude.trim() !== "";
      const pairError =
        hasLatitude !== hasLongitude ? t("hosting.form.errors.coordinatesPair") : undefined;
      return compact({
        address: textError(values.address, LISTING_LIMITS.addressMin),
        city: textError(values.city, LISTING_LIMITS.placeMin),
        state: textError(values.state, LISTING_LIMITS.placeMin),
        country: textError(values.country, LISTING_LIMITS.placeMin),
        latitude:
          pairError ??
          (hasLatitude
            ? coordinateError(values.latitude, COORDINATE_LIMITS.latitude, "latitude")
            : undefined),
        longitude: hasLongitude
          ? coordinateError(values.longitude, COORDINATE_LIMITS.longitude, "longitude")
          : undefined,
      });
    }
    case "basics":
      return compact(
        Object.fromEntries(
          BASICS_FIELDS.map(({ key, min, max }) => [
            key,
            values[key] < min || values[key] > max ? t("hosting.form.errors.required") : undefined,
          ]),
        ),
      );
    case "amenities":
      return {};
    case "photos":
      if (values.photos.length === 0) {
        return { photos: t("hosting.form.errors.photosRequired") };
      }
      return values.photos.some(url => brokenPhotos.includes(url))
        ? { photos: t("hosting.form.errors.photoBroken") }
        : {};
    case "description":
      return compact({
        title: textError(values.title, LISTING_LIMITS.titleMin),
        description: textError(values.description, LISTING_LIMITS.descriptionMin),
      });
    case "price": {
      const price = Number(values.pricePerNight);
      const cleaningFee = Number(values.cleaningFee || 0);
      return compact({
        pricePerNight:
          price >= LISTING_LIMITS.priceMin && price <= LISTING_LIMITS.priceMax
            ? undefined
            : t("hosting.form.errors.priceRange", {
                min: formatPrice(LISTING_LIMITS.priceMin),
                max: formatPrice(LISTING_LIMITS.priceMax),
              }),
        cleaningFee:
          cleaningFee <= LISTING_LIMITS.cleaningFeeMax
            ? undefined
            : t("hosting.form.errors.cleaningFeeRange", {
                max: formatPrice(LISTING_LIMITS.cleaningFeeMax),
              }),
      });
    }
  }
};

export const hasErrors = (errors: ListingFormErrors) => Object.keys(errors).length > 0;
