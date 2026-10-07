import { CircleUserRound, Heart, Search, type LucideIcon } from "lucide-react";

import BeloIcon from "@/components/common/BeloIcon";
import {
  BOOK_ROUTE_PREFIX,
  HOSTING_ROUTE_PREFIX,
  LISTING_ROUTE_PREFIX,
  routes,
} from "@/constants/routes";

export type MobileTab = {
  key: string;
  labelKey: string;
  route: string;
  icon: LucideIcon | typeof BeloIcon;
};

export const MOBILE_TABS: MobileTab[] = [
  { key: "explore", labelKey: "mobileNav.explore", route: routes.home, icon: Search },
  { key: "wishlists", labelKey: "mobileNav.wishlists", route: routes.wishlists, icon: Heart },
  { key: "trips", labelKey: "mobileNav.trips", route: routes.trips, icon: BeloIcon },
  { key: "profile", labelKey: "mobileNav.profile", route: routes.profile, icon: CircleUserRound },
];

/** Pages with their own bottom bar (booking) or navigation (hosting) hide the tabs. */
export const TAB_BAR_HIDDEN_PREFIXES = [LISTING_ROUTE_PREFIX, BOOK_ROUTE_PREFIX, HOSTING_ROUTE_PREFIX];
