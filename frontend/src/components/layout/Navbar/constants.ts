import { comingSoonRoute, routes } from "@/constants/routes";

const HEADER_TAB_ICON_BASE_URL =
  "https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original";

export type HeaderTab = {
  key: string;
  labelKey: string;
  iconUrl: string;
  route: string;
};

/** Experiences and services aren't built yet; their tabs lead to "Coming soon". */
export const HEADER_TABS: HeaderTab[] = [
  {
    key: "all",
    labelKey: "nav.tabs.all",
    iconUrl:
      "https://a0.muscache.com/im/pictures/AirbnbPlatformAssets/AirbnbPlatformAssets-search-bar-icons/original/a811de29-114f-43a0-b8c5-698d4564bd04.png?im_w=240",
    route: routes.home,
  },
  {
    key: "homes",
    labelKey: "nav.tabs.homes",
    iconUrl: `${HEADER_TAB_ICON_BASE_URL}/a32adab1-f9df-47e1-a411-bdff91b579c3.png?im_w=240`,
    route: routes.search,
  },
  {
    key: "experiences",
    labelKey: "nav.tabs.experiences",
    iconUrl: `${HEADER_TAB_ICON_BASE_URL}/e47ab655-027b-4679-b2e6-df1c99a5c33d.png?im_w=240`,
    route: comingSoonRoute("experiences"),
  },
  {
    key: "services",
    labelKey: "nav.tabs.services",
    iconUrl: `${HEADER_TAB_ICON_BASE_URL}/3d67e9a9-520a-49ee-b439-7b3a75ea814d.png?im_w=240`,
    route: comingSoonRoute("services"),
  },
];

export const HEADER_TAB_ICON_SIZE_PX = 48;

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
    { key: "host", labelKey: "nav.becomeHost", route: routes.hosting },
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
    { key: "host", labelKey: "nav.becomeHost", route: routes.hosting },
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
