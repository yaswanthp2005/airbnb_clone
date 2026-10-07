import {
  ArrowUpDown,
  Bath,
  Car,
  Check,
  Cigarette,
  Coffee,
  Droplets,
  Dumbbell,
  Flame,
  FlameKindling,
  Flower2,
  Laptop,
  Mountain,
  PawPrint,
  Shirt,
  Snowflake,
  Tv,
  Umbrella,
  Utensils,
  Waves,
  Wifi,
  type LucideIcon,
} from "lucide-react";

/** Amenity `icon` keys from the API → lucide icons. */
export const AMENITY_ICONS: Record<string, LucideIcon> = {
  wifi: Wifi,
  utensils: Utensils,
  car: Car,
  snowflake: Snowflake,
  shirt: Shirt,
  laptop: Laptop,
  tv: Tv,
  waves: Waves,
  bath: Bath,
  flame: Flame,
  coffee: Coffee,
  dumbbell: Dumbbell,
  "arrow-up-down": ArrowUpDown,
  water: Droplets,
  mountain: Mountain,
  "flame-kindling": FlameKindling,
  "paw-print": PawPrint,
  cigarette: Cigarette,
  umbrella: Umbrella,
  "flower-2": Flower2,
};

export const FALLBACK_AMENITY_ICON = Check;

export const AMENITIES_PREVIEW_COUNT = 10;

/** The 1 large + 4 small photo mosaic. */
export const PHOTO_GRID_COUNT = 5;

export const RATING_DECIMALS = 2;
export const HOST_RATING_DECIMALS = 2;
export const STAR_COUNT = 5;

export const FIELD_DATE_FORMAT = "dd/MM/yyyy";
export const LONG_DATE_FORMAT = "d MMM yyyy";
export const REVIEW_DATE_FORMAT = "MMMM yyyy";

export const PHOTO_GRID_SIZES = "(min-width: 768px) 50vw, 100vw";
export const PHOTO_GRID_SMALL_SIZES = "(min-width: 768px) 25vw, 1px";
export const GALLERY_PHOTO_SIZES = "(min-width: 768px) 768px, 100vw";
export const MOBILE_PHOTO_SIZES = "100vw";

/** Round icon buttons floating over photos (mobile carousel). */
export const PHOTO_OVERLAY_BUTTON_CLASS_NAME =
  "flex size-9 items-center justify-center rounded-full bg-surface-raised text-ink shadow-pill transition-transform active:scale-95";

export const LOCATION_MAP_ZOOM = 13;
/** Approximate area shown instead of the exact address (revealed after booking). */
export const LOCATION_RADIUS_METERS = 1200;

/** Content + booking card columns from `md` (tablet: fixed-width card); phones get the bottom bar. */
export const DETAIL_COLUMNS_CLASS_NAME =
  "md:grid md:grid-cols-[minmax(0,1fr)_18rem] md:gap-x-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-x-16 xl:gap-x-24";

export const SECTION_IDS = {
  photos: "photos",
  amenities: "amenities",
  availability: "availability",
  reviews: "reviews",
  location: "location",
} as const;

export const galleryPhotoId = (index: number) => `gallery-photo-${index}`;
