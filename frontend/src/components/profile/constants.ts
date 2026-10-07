import { CircleHelp, House, MessageSquare, ShieldCheck, type LucideIcon } from "lucide-react";

import { HELP_CENTRE_SLUG } from "@/components/layout/Navbar/constants";
import { comingSoonRoute, routes } from "@/constants/routes";

export type ProfileLink = {
  key: string;
  labelKey: string;
  route: string;
  icon: LucideIcon;
  /** Hosting needs an account; guests are asked to log in first. */
  requiresAuth?: boolean;
  membersOnly?: boolean;
};

export const PROFILE_LINKS: ProfileLink[] = [
  { key: "hosting", labelKey: "nav.switchToHosting", route: routes.hosting, icon: House, requiresAuth: true },
  { key: "messages", labelKey: "nav.messages", route: routes.messages, icon: MessageSquare, membersOnly: true },
  {
    key: "identity",
    labelKey: "nav.identityVerification",
    route: routes.identityVerification,
    icon: ShieldCheck,
    membersOnly: true,
  },
  { key: "help", labelKey: "nav.helpCentre", route: comingSoonRoute(HELP_CENTRE_SLUG), icon: CircleHelp },
];
