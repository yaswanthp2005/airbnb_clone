import {
  Landmark,
  MountainSnow,
  Sailboat,
  Sunrise,
  TreePalm,
  Waves,
  type LucideIcon,
} from "lucide-react";

export type SearchSection = "where" | "when" | "who";

export type GuestKey = "adults" | "children" | "infants" | "pets";

export type GuestCounts = Record<GuestKey, number>;

export type GuestField = {
  key: GuestKey;
  labelKey: string;
  descriptionKey: string;
};

export const GUEST_FIELDS: GuestField[] = [
  { key: "adults", labelKey: "search.guests.adults", descriptionKey: "search.guests.adultsDescription" },
  { key: "children", labelKey: "search.guests.children", descriptionKey: "search.guests.childrenDescription" },
  { key: "infants", labelKey: "search.guests.infants", descriptionKey: "search.guests.infantsDescription" },
  { key: "pets", labelKey: "search.guests.pets", descriptionKey: "search.guests.petsDescription" },
];

/** Adults + children; infants and pets have their own caps. */
/** Matches backend `MAX_LISTING_GUESTS` (listing capacity and search guest filter). */
export const MAX_GUESTS = 16;
export const MAX_INFANTS = 5;
export const MAX_PETS = 5;

export const EMPTY_GUEST_COUNTS: GuestCounts = {
  adults: 0,
  children: 0,
  infants: 0,
  pets: 0,
};

export const SEARCH_PILL_ICON_SIZE_PX = 32;
/** How long the white highlight takes to slide between Where, When and Who. */
export const SEARCH_HIGHLIGHT_DURATION_CLASS_NAME = "duration-300";

export const CALENDAR_MONTHS = 2;
export const CALENDAR_MAX_MONTHS_AHEAD = 12;

export type PopularDestination = {
  city: string;
  descriptionKey: string;
  icon: LucideIcon;
  tintClassName: string;
};

export const POPULAR_DESTINATIONS: PopularDestination[] = [
  { city: "Goa", descriptionKey: "search.popular.goa", icon: TreePalm, tintClassName: "bg-tint-emerald/12 text-tint-emerald" },
  { city: "Jaipur", descriptionKey: "search.popular.jaipur", icon: Landmark, tintClassName: "bg-tint-rose/12 text-tint-rose" },
  { city: "Manali", descriptionKey: "search.popular.manali", icon: MountainSnow, tintClassName: "bg-tint-sky/12 text-tint-sky" },
  { city: "Udaipur", descriptionKey: "search.popular.udaipur", icon: Sailboat, tintClassName: "bg-tint-indigo/12 text-tint-indigo" },
  { city: "Kochi", descriptionKey: "search.popular.kochi", icon: Waves, tintClassName: "bg-tint-teal/12 text-tint-teal" },
  { city: "Rishikesh", descriptionKey: "search.popular.rishikesh", icon: Sunrise, tintClassName: "bg-tint-amber/12 text-tint-amber" },
];
