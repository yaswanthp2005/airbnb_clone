import type { BookingTab } from "@/types/booking";

export const TRIP_TABS: BookingTab[] = ["upcoming", "past", "cancelled"];
export const DEFAULT_TRIP_TAB: BookingTab = "upcoming";

export const TRIP_PHOTO_SIZES = "(min-width: 1280px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw";
export const TRIP_SKELETON_COUNT = 3;
