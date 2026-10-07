"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { t } from "@/common/i18n";
import RemoteImage from "@/components/common/RemoteImage";
import { cn } from "@/lib/utils";

import { HEADER_TAB_ICON_SIZE_PX, HEADER_TABS } from "./constants";

const HeaderTabs = () => {
  const pathname = usePathname();

  return (
    <nav aria-label={t("nav.tabs.label")} className="flex items-center gap-2 lg:gap-6">
      {HEADER_TABS.map(({ key, labelKey, iconUrl, route }) => {
        const isActive = pathname === route;
        return (
          <Link
            key={key}
            href={route}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "group relative flex items-center gap-1 px-2 py-2 text-[15px] transition-colors",
              "after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:transition-colors",
              isActive
                ? "font-semibold text-ink after:bg-ink"
                : "text-ink-muted hover:text-ink hover:after:bg-hairline",
            )}
          >
            <RemoteImage
              src={iconUrl}
              alt=""
              width={HEADER_TAB_ICON_SIZE_PX}
              height={HEADER_TAB_ICON_SIZE_PX}
              priority
              className="size-12 object-contain transition-transform group-hover:scale-110"
            />
            <span className="max-lg:sr-only">{t(labelKey)}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default HeaderTabs;
