"use client";

import { Fragment } from "react";
import { useRouter } from "next/navigation";
import { Menu, UserRound } from "lucide-react";

import { t } from "@/common/i18n";
import ThemeMenuItems from "@/components/common/theme/ThemeMenuItems";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

import {
  GUEST_MENU_GROUPS,
  MEMBER_MENU_GROUPS,
  type UserMenuItem,
} from "./constants";

const getInitial = (name: string): string => name.trim().charAt(0).toUpperCase();

const UserMenu = () => {
  const router = useRouter();
  const { isAuthenticated, user, openAuthModal, logout } = useAuth();
  const groups = isAuthenticated ? MEMBER_MENU_GROUPS : GUEST_MENU_GROUPS;

  const handleSelect = (item: UserMenuItem) => {
    if (item.route) {
      router.push(item.route);
      return;
    }
    if (item.action === "logout") {
      logout();
      return;
    }
    if (item.action) {
      openAuthModal(item.action === "signup" ? "register" : "login");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("nav.mainMenu")}
        className="flex items-center gap-3 rounded-full border border-hairline bg-surface py-1.5 pl-3.5 pr-1.5 text-ink outline-none transition-shadow hover:shadow-pill-hover data-popup-open:shadow-pill-hover"
      >
        <Menu className="size-4" strokeWidth={2.5} aria-hidden="true" />
        {isAuthenticated && user ? (
          <Avatar className="size-8">
            {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={user.name} /> : null}
            <AvatarFallback className="bg-ink text-sm font-semibold text-on-ink">
              {getInitial(user.name)}
            </AvatarFallback>
          </Avatar>
        ) : (
          <span className="flex size-8 items-center justify-center rounded-full bg-ink-muted text-on-ink">
            <UserRound className="size-5" fill="currentColor" aria-hidden="true" />
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-60 rounded-xl py-2 shadow-menu ring-0"
      >
        {groups.map((group, index) => (
          <Fragment key={group[0]?.key ?? index}>
            {index > 0 ? <DropdownMenuSeparator className="my-2 bg-hairline" /> : null}
            {group.map(item => (
              <DropdownMenuItem
                key={item.key}
                onClick={() => handleSelect(item)}
                className={cn(
                  "cursor-pointer rounded-none px-4 py-3 text-sm text-ink focus:bg-surface-muted",
                  item.emphasized && "font-semibold",
                )}
              >
                {t(item.labelKey)}
              </DropdownMenuItem>
            ))}
          </Fragment>
        ))}
        <DropdownMenuSeparator className="my-2 bg-hairline" />
        <ThemeMenuItems />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
