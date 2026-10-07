"use client";

import { useRef, type KeyboardEvent } from "react";

import { t } from "@/common/i18n";
import { THEME_OPTIONS } from "@/constants/theme";
import { useThemePreference } from "@/hooks/useThemePreference";
import { cn } from "@/lib/utils";

const ARROW_STEPS: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

/** Full-width Light / Dark / System radio group (profile page). */
const ThemeSegmentedControl = () => {
  const { theme, setTheme } = useThemePreference();
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const checkedIndex = Math.max(
    THEME_OPTIONS.findIndex(option => option.value === theme),
    0,
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = ARROW_STEPS[event.key];
    if (!step) {
      return;
    }
    event.preventDefault();
    const next = (checkedIndex + step + THEME_OPTIONS.length) % THEME_OPTIONS.length;
    setTheme(THEME_OPTIONS[next].value);
    buttonsRef.current[next]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label={t("theme.label")}
      onKeyDown={handleKeyDown}
      className="grid grid-cols-3 gap-1 rounded-xl bg-surface-muted p-1"
    >
      {THEME_OPTIONS.map(({ value, labelKey, icon: Icon }, index) => {
        const isChecked = theme === value;
        return (
          <button
            key={value}
            ref={node => {
              buttonsRef.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-checked={isChecked}
            tabIndex={index === checkedIndex ? 0 : -1}
            onClick={() => setTheme(value)}
            className={cn(
              "flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-colors",
              isChecked ? "bg-surface-raised text-ink shadow-pill" : "text-ink-muted hover:text-ink",
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            {t(labelKey)}
          </button>
        );
      })}
    </div>
  );
};

export default ThemeSegmentedControl;
