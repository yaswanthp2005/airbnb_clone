import { X } from "lucide-react";

import { t } from "@/common/i18n";
import { cn } from "@/lib/utils";

type SegmentProps = {
  isActive: boolean;
  isAnyActive: boolean;
  className?: string;
  canClear?: boolean;
  onClear?: () => void;
  children: React.ReactNode;
};

export const Segment = ({
  isActive,
  isAnyActive,
  className,
  canClear = false,
  onClear,
  children,
}: SegmentProps) => (
  <div
    className={cn(
      "relative flex h-full min-w-0 items-center rounded-full transition-colors",
      isActive
        ? "bg-surface-raised shadow-card"
        : isAnyActive
          ? "hover:bg-hairline"
          : "hover:bg-surface-strong",
      className,
    )}
  >
    {children}
    {isActive && canClear && onClear ? (
      <button
        type="button"
        onClick={onClear}
        aria-label={t("search.clear")}
        className="absolute right-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full bg-surface-strong text-ink transition-colors hover:bg-hairline"
      >
        <X className="size-3" strokeWidth={3} aria-hidden="true" />
      </button>
    ) : null}
  </div>
);

type SegmentTextProps = {
  label: string;
  value?: string;
  placeholder: string;
};

export const SegmentText = ({ label, value, placeholder }: SegmentTextProps) => (
  <span className="flex min-w-0 flex-col text-left">
    <span className="text-xs font-semibold text-ink">{label}</span>
    <span className={cn("truncate text-sm", value ? "font-medium text-ink" : "text-ink-muted")}>
      {value ?? placeholder}
    </span>
  </span>
);

type DividerProps = {
  isHidden: boolean;
};

export const SegmentDivider = ({ isHidden }: DividerProps) => (
  <span
    aria-hidden="true"
    className={cn("h-8 w-px shrink-0 bg-hairline transition-opacity", isHidden && "opacity-0")}
  />
);
