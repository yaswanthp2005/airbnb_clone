"use client";

import { useId } from "react";

import { t } from "@/common/i18n";
import { DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";
import { THEME_OPTIONS, type Theme } from "@/constants/theme";
import { useThemePreference } from "@/hooks/useThemePreference";
import { cn } from "@/lib/utils";

/** Light / Dark / System as compact icon radios on one menu row. */
const ThemeMenuItems = () => {
  const { theme, setTheme } = useThemePreference();
  const labelId = useId();

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2">
      <span id={labelId} className="text-sm text-ink">
        {t("theme.label")}
      </span>
      <DropdownMenuRadioGroup
        aria-labelledby={labelId}
        value={theme ?? ""}
        onValueChange={value => setTheme(value as Theme)}
        className="flex rounded-full bg-surface-muted p-0.5"
      >
        {THEME_OPTIONS.map(({ value, labelKey, icon: Icon }) => (
          <DropdownMenuRadioItem
            key={value}
            value={value}
            closeOnClick={false}
            aria-label={t(labelKey)}
            title={t(labelKey)}
            className={cn(
              "size-8 cursor-pointer justify-center rounded-full p-0 text-ink-muted focus:bg-surface-strong focus:text-ink",
              "data-checked:bg-surface-raised data-checked:text-ink data-checked:shadow-pill",
              "[&>[data-slot=dropdown-menu-radio-item-indicator]]:hidden",
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
          </DropdownMenuRadioItem>
        ))}
      </DropdownMenuRadioGroup>
    </div>
  );
};

export default ThemeMenuItems;
