import type { HostBookingTab } from "@/types/host";

export const HOSTING_TABS = ["listings", "reservations"] as const;
export type HostingTab = (typeof HOSTING_TABS)[number];
export const DEFAULT_HOSTING_TAB: HostingTab = "listings";
/** `/hosting?tab=reservations` keeps the tab across refreshes and back navigation. */
export const HOSTING_TAB_PARAM = "tab";

export const RESERVATION_TABS: HostBookingTab[] = ["upcoming", "past", "cancelled"];
export const DEFAULT_RESERVATION_TAB: HostBookingTab = "upcoming";

export const HOST_LISTING_PHOTO_SIZES =
  "(min-width: 1280px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw";
export const HOST_LISTING_GRID_CLASS_NAME = "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
export const RESERVATION_GRID_CLASS_NAME = "md:grid-cols-[1.2fr_1.6fr_1fr_9rem]";
export const RESERVATION_THUMBNAIL_SIZES = "56px";
export const HOST_SKELETON_COUNT = 4;
export const RESERVATION_SKELETON_COUNT = 3;
