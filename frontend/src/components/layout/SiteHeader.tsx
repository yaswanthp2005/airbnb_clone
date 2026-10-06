"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { t } from "@/common/i18n";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { routes } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { useRequireAuth } from "@/hooks/useRequireAuth";

const SiteHeader = () => {
  const router = useRouter();
  const { isAuthenticated, user, openAuthModal, logout } = useAuth();
  const requireAuth = useRequireAuth();

  const initials =
    user?.name
      ?.split(" ")
      .map(part => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "G";

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href={routes.home} className="text-xl font-semibold text-[#ff385c]">
          {t("common.appName")}
        </Link>

        <nav className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="hidden rounded-full sm:inline-flex"
            onClick={() => requireAuth(() => router.push(routes.hosting))}
          >
            {t("nav.hostYourHome")}
          </Button>

          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-full border bg-background px-2 py-1.5 text-sm shadow-xs outline-none hover:bg-accent">
                <Avatar className="size-8">
                  {user.avatarUrl ? (
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                  ) : null}
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <span className="max-w-[120px] truncate pr-1">{user.name}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => router.push(routes.trips)}>
                  {t("nav.trips")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(routes.wishlists)}>
                  {t("nav.wishlists")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>{t("auth.logout")}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => openAuthModal("login")}
            >
              {t("auth.modal.openLabel")}
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default SiteHeader;
