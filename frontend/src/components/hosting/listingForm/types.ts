import type { LISTING_FORM_STEPS } from "./constants";

export type ListingFormStep = (typeof LISTING_FORM_STEPS)[number];

export type BasicsKey = "maxGuests" | "bedrooms" | "beds" | "bathrooms";

/** Text inputs stay strings while editing; `formValuesToInput` converts them. */
export type ListingFormValues = {
  propertyType: string;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: string;
  longitude: string;
  amenities: number[];
  photos: string[];
  title: string;
  description: string;
  pricePerNight: string;
  cleaningFee: string;
} & Record<BasicsKey, number>;

export type ListingFormErrors = Partial<Record<keyof ListingFormValues, string>>;

export type StepProps = {
  values: ListingFormValues;
  errors: ListingFormErrors;
  onChange: (patch: Partial<ListingFormValues>) => void;
};
