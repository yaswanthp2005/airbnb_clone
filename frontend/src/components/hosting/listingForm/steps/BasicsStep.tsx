import { Minus, Plus } from "lucide-react";

import { t } from "@/common/i18n";
import StepperButton from "@/components/common/StepperButton";

import { BASICS_FIELDS } from "../constants";
import type { StepProps } from "../types";

const BasicsStep = ({ values, onChange }: StepProps) => (
  <div className="flex flex-col">
    {BASICS_FIELDS.map(({ key, labelKey, min, max }) => {
      const label = t(labelKey);
      const count = values[key];
      return (
        <div
          key={key}
          className="flex items-center justify-between border-b border-hairline py-6 last:border-b-0"
        >
          <span className="text-lg text-ink">{label}</span>
          <div className="flex items-center gap-4">
            <StepperButton
              label={t("hosting.form.fields.decrease", { label })}
              disabled={count <= min}
              onClick={() => onChange({ [key]: count - 1 })}
            >
              <Minus className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
            </StepperButton>
            <span className="w-6 text-center text-base text-ink" aria-live="polite" data-count={key}>
              {count}
            </span>
            <StepperButton
              label={t("hosting.form.fields.increase", { label })}
              disabled={count >= max}
              onClick={() => onChange({ [key]: count + 1 })}
            >
              <Plus className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
            </StepperButton>
          </div>
        </div>
      );
    })}
  </div>
);

export default BasicsStep;
