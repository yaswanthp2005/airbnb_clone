import { t } from "@/common/i18n";
import { SERVICE_FEE_RATE } from "@/constants";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils/formatPrice";

import { PRICE_INPUT_MAX_DIGITS } from "../constants";
import FormField, { FORM_INPUT_CLASS_NAME, fieldA11yProps } from "../FormField";
import type { StepProps } from "../types";
import { digitsOnly } from "../utils";

const PRICE_ID = "listing-price";
const CLEANING_FEE_ID = "listing-cleaning-fee";

const PriceStep = ({ values, errors, onChange }: StepProps) => {
  const price = Number(values.pricePerNight) || 0;

  return (
    <div className="flex flex-col gap-8">
      <FormField id={PRICE_ID} label={t("hosting.form.fields.pricePerNight")} error={errors.pricePerNight}>
        <div className="relative">
          <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-4xl font-semibold text-ink">
            {t("hosting.form.fields.currencySymbol")}
          </span>
          <input
            {...fieldA11yProps(PRICE_ID, errors.pricePerNight)}
            name="pricePerNight"
            inputMode="numeric"
            value={values.pricePerNight}
            onChange={event =>
              onChange({ pricePerNight: digitsOnly(event.target.value, PRICE_INPUT_MAX_DIGITS) })
            }
            className={cn(FORM_INPUT_CLASS_NAME, "py-5 pl-12 text-4xl font-semibold")}
          />
        </div>
      </FormField>

      {price > 0 ? (
        <div className="flex flex-col gap-1 rounded-xl border border-hairline p-4 text-sm">
          <p className="text-ink">
            {t("hosting.form.fields.youEarn", { amount: formatPrice(price) })}
          </p>
          <p className="text-ink-muted">
            {t("hosting.form.fields.guestPrice", {
              amount: formatPrice(Math.round(price * (1 + SERVICE_FEE_RATE))),
            })}
          </p>
        </div>
      ) : null}

      <FormField
        id={CLEANING_FEE_ID}
        label={t("hosting.form.fields.cleaningFee")}
        error={errors.cleaningFee}
        hint={t("hosting.form.fields.cleaningFeeHint")}
      >
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base text-ink">
            {t("hosting.form.fields.currencySymbol")}
          </span>
          <input
            {...fieldA11yProps(CLEANING_FEE_ID, errors.cleaningFee)}
            name="cleaningFee"
            inputMode="numeric"
            value={values.cleaningFee}
            onChange={event =>
              onChange({ cleaningFee: digitsOnly(event.target.value, PRICE_INPUT_MAX_DIGITS) })
            }
            className={cn(FORM_INPUT_CLASS_NAME, "pl-8")}
          />
        </div>
      </FormField>
    </div>
  );
};

export default PriceStep;
