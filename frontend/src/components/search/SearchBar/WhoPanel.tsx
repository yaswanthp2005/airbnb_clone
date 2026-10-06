import { Minus, Plus } from "lucide-react";

import { t } from "@/common/i18n";

import { GUEST_FIELDS, type GuestCounts, type GuestKey } from "../constants";
import { guestBounds } from "../utils";

type WhoPanelProps = {
  counts: GuestCounts;
  onChange: (key: GuestKey, delta: number) => void;
};

type StepperButtonProps = {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

const StepperButton = ({ label, disabled, onClick, children }: StepperButtonProps) => (
  <button
    type="button"
    aria-label={label}
    disabled={disabled}
    onClick={onClick}
    className="flex size-8 items-center justify-center rounded-full border border-ink-muted/60 text-ink-muted transition-colors hover:border-ink hover:text-ink disabled:cursor-not-allowed disabled:border-surface-strong disabled:text-surface-strong"
  >
    {children}
  </button>
);

const WhoPanel = ({ counts, onChange }: WhoPanelProps) => (
  <div className="absolute right-0 top-full z-50 mt-3 w-[400px] max-w-[calc(100vw-3rem)] rounded-[32px] bg-white px-8 py-4 shadow-menu">
    {GUEST_FIELDS.map(field => {
      const label = t(field.labelKey);
      const { min, max } = guestBounds(counts, field.key);
      const count = counts[field.key];

      return (
        <div
          key={field.key}
          className="flex items-center justify-between border-b border-hairline py-6 last:border-b-0"
        >
          <div className="flex flex-col">
            <span className="text-base font-semibold text-ink">{label}</span>
            <span className="text-sm text-ink-muted">{t(field.descriptionKey)}</span>
          </div>
          <div className="flex items-center gap-4">
            <StepperButton
              label={t("search.guests.decrease", { label })}
              disabled={count <= min}
              onClick={() => onChange(field.key, -1)}
            >
              <Minus className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
            </StepperButton>
            <span className="w-5 text-center text-base text-ink" aria-live="polite">
              {count}
            </span>
            <StepperButton
              label={t("search.guests.increase", { label })}
              disabled={count >= max}
              onClick={() => onChange(field.key, 1)}
            >
              <Plus className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
            </StepperButton>
          </div>
        </div>
      );
    })}
  </div>
);

export default WhoPanel;
