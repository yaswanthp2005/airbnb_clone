import type { BookingTab } from "@/types/booking";

export const TRIP_TABS: BookingTab[] = ["upcoming", "past", "cancelled"];
export const DEFAULT_TRIP_TAB: BookingTab = "upcoming";

export const TRIP_PHOTO_SIZES = "(min-width: 1280px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw";
export const TRIP_SKELETON_COUNT = 3;

/** Mirrors `backend/app/schemas/review.py`. */
export const REVIEW_COMMENT_MIN_LENGTH = 10;
export const REVIEW_COMMENT_MAX_LENGTH = 1000;
export const REVIEW_RATINGS = [1, 2, 3, 4, 5] as const;
