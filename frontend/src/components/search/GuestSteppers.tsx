import { Minus, Plus } from "lucide-react";

import { t } from "@/common/i18n";
import StepperButton from "@/components/common/StepperButton";
import { cn } from "@/lib/utils";

import { GUEST_FIELDS, type GuestCounts, type GuestKey } from "./constants";
import { guestBounds, type GuestBoundsOptions } from "./utils";

type GuestSteppersProps = {
  counts: GuestCounts;
  onChange: (key: GuestKey, delta: number) => void;
  bounds?: GuestBoundsOptions;
  rowClassName?: string;
};

const GuestSteppers = ({ counts, onChange, bounds, rowClassName }: GuestSteppersProps) => (
  <>
    {GUEST_FIELDS.map(field => {
      const label = t(field.labelKey);
      const { min, max } = guestBounds(counts, field.key, bounds);
      const count = counts[field.key];

      return (
        <div
          key={field.key}
          className={cn(
            "flex items-center justify-between border-b border-hairline py-6 last:border-b-0",
            rowClassName,
          )}
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
  </>
);

export default GuestSteppers;
