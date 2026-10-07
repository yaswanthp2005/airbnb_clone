import {
  Building2,
  Castle,
  House,
  Landmark,
  Sailboat,
  Tent,
  Tractor,
  TreePine,
  Trees,
  Umbrella,
  type LucideIcon,
} from "lucide-react";

import type { BasicsKey } from "./types";

export const LISTING_FORM_STEPS = [
  "propertyType",
  "location",
  "basics",
  "amenities",
  "photos",
  "description",
  "price",
] as const;

/** Mirrors the API limits in `backend/app/schemas/host.py`. */
export const LISTING_LIMITS = {
  titleMin: 5,
  titleMax: 100,
  descriptionMin: 20,
  descriptionMax: 5000,
  placeMin: 2,
  placeMax: 80,
  addressMin: 3,
  addressMax: 255,
  priceMin: 500,
  priceMax: 1_000_000,
  cleaningFeeMax: 100_000,
  maxPhotos: 20,
  photoUrlMax: 512,
} as const;

export const BASICS_FIELDS: { key: BasicsKey; labelKey: string; min: number; max: number }[] = [
  { key: "maxGuests", labelKey: "hosting.form.fields.maxGuests", min: 1, max: 16 },
  { key: "bedrooms", labelKey: "hosting.form.fields.bedrooms", min: 0, max: 50 },
  { key: "beds", labelKey: "hosting.form.fields.beds", min: 1, max: 50 },
  { key: "bathrooms", labelKey: "hosting.form.fields.bathrooms", min: 1, max: 50 },
];

export const DEFAULT_COUNTRY = "India";

/** Property types come from the API; unknown ones fall back to a house. */
export const PROPERTY_TYPE_ICONS: Record<string, LucideIcon> = {
  Villa: Castle,
  Apartment: Building2,
  Cabin: Trees,
  Houseboat: Sailboat,
  Treehouse: TreePine,
  Beachfront: Umbrella,
  Farmhouse: Tractor,
  "Heritage haveli": Landmark,
  Camping: Tent,
};
export const FALLBACK_PROPERTY_TYPE_ICON = House;

export const PHOTO_URL_SCHEMES = ["http:", "https:"];
export const PHOTO_PREVIEW_SIZES = "(min-width: 768px) 280px, 50vw";
export const PRICE_INPUT_MAX_DIGITS = 7;
export const COORDINATE_LIMITS = { latitude: 90, longitude: 180 } as const;
export const OPTION_SKELETON_COUNT = 9;
export const OPTION_GRID_CLASS_NAME = "grid grid-cols-2 gap-3 sm:grid-cols-3";
