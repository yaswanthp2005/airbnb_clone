import { Balloon, ConciergeBell, Earth, House, type LucideIcon } from "lucide-react";

import { comingSoonRoute, routes } from "@/constants/routes";

export type HeaderTab = {
  key: string;
  labelKey: string;
  icon: LucideIcon;
  route: string;
};

/** Experiences and services aren't built yet; their tabs lead to "Coming soon". */
export const HEADER_TABS: HeaderTab[] = [
  { key: "all", labelKey: "nav.tabs.all", icon: Earth, route: routes.home },
  { key: "homes", labelKey: "nav.tabs.homes", icon: House, route: routes.search },
  {
    key: "experiences",
    labelKey: "nav.tabs.experiences",
    icon: Balloon,
    route: comingSoonRoute("experiences"),
  },
  {
    key: "services",
    labelKey: "nav.tabs.services",
    icon: ConciergeBell,
    route: comingSoonRoute("services"),
  },
];

export type UserMenuAction = "login" | "signup" | "logout";

export type UserMenuItem = {
  key: string;
  labelKey: string;
  emphasized?: boolean;
  route?: string;
  action?: UserMenuAction;
};

export const HELP_CENTRE_SLUG = "help-centre";

export const GUEST_MENU_GROUPS: UserMenuItem[][] = [
  [
    { key: "signup", labelKey: "nav.signUp", emphasized: true, action: "signup" },
    { key: "login", labelKey: "nav.logIn", action: "login" },
  ],
  [
    { key: "host", labelKey: "nav.hostYourHome", route: routes.hosting },
    {
      key: "help",
      labelKey: "nav.helpCentre",
      route: comingSoonRoute(HELP_CENTRE_SLUG),
    },
  ],
];

export const MEMBER_MENU_GROUPS: UserMenuItem[][] = [
  [
    {
      key: "messages",
      labelKey: "nav.messages",
      emphasized: true,
      route: routes.messages,
    },
    { key: "trips", labelKey: "nav.trips", emphasized: true, route: routes.trips },
    {
      key: "wishlists",
      labelKey: "nav.wishlists",
      emphasized: true,
      route: routes.wishlists,
    },
  ],
  [
    { key: "host", labelKey: "nav.hostYourHome", route: routes.hosting },
    {
      key: "identity",
      labelKey: "nav.identityVerification",
      route: routes.identityVerification,
    },
  ],
  [
    {
      key: "help",
      labelKey: "nav.helpCentre",
      route: comingSoonRoute(HELP_CENTRE_SLUG),
    },
    { key: "logout", labelKey: "nav.logOut", action: "logout" },
  ],
];

export const HEADER_MORPH_TRANSITION_CLASS_NAME =
  "duration-300 ease-header motion-reduce:transition-none";
