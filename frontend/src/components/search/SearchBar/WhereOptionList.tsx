import type { LucideIcon } from "lucide-react";

import { t } from "@/common/i18n";
import { cn } from "@/lib/utils";

export type WhereOption = {
  key: string;
  city: string;
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  tintClassName: string;
};

export type WhereOptionListProps = {
  listboxId: string;
  optionId: (index: number) => string;
  heading?: string;
  options: WhereOption[];
  highlightedIndex: number;
  emptyMessage?: string;
  onSelect: (option: WhereOption) => void;
  onHighlight: (index: number) => void;
  /** Horizontal padding shared by the heading and rows. */
  insetClassName?: string;
};

const WhereOptionList = ({
  listboxId,
  optionId,
  heading,
  options,
  highlightedIndex,
  emptyMessage,
  onSelect,
  onHighlight,
  insetClassName = "px-8",
}: WhereOptionListProps) => (
  <>
    {heading ? (
      <p className={cn("pb-2 text-xs font-semibold text-ink", insetClassName)}>{heading}</p>
    ) : null}
    {options.length === 0 && emptyMessage ? (
      <p className={cn("py-3 text-sm text-ink-muted", insetClassName)}>{emptyMessage}</p>
    ) : null}
    <ul id={listboxId} role="listbox" aria-label={t("search.where")}>
      {options.map((option, index) => {
        const Icon = option.icon;

        return (
          <li
            key={option.key}
            id={optionId(index)}
            role="option"
            aria-selected={index === highlightedIndex}
            // Keep focus in the input so typing continues after hovering an option.
            onMouseDown={event => event.preventDefault()}
            onClick={() => onSelect(option)}
            onMouseEnter={() => onHighlight(index)}
            className={cn(
              "flex cursor-pointer items-center gap-4 py-2.5 transition-colors",
              insetClassName,
              index === highlightedIndex && "bg-surface-muted",
            )}
          >
            <span
              className={cn(
                "flex size-14 shrink-0 items-center justify-center rounded-xl",
                option.tintClassName,
              )}
            >
              <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-base text-ink">{option.title}</span>
              {option.subtitle ? (
                <span className="truncate text-sm text-ink-muted">{option.subtitle}</span>
              ) : null}
            </span>
          </li>
        );
      })}
    </ul>
  </>
);

export default WhereOptionList;
