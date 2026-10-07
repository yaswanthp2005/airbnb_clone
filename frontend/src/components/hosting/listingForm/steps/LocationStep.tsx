import { t } from "@/common/i18n";

import { LISTING_LIMITS } from "../constants";
import FormField, { ListingFormInput, fieldA11yProps } from "../FormField";
import type { ListingFormValues, StepProps } from "../types";

type TextKey = "address" | "city" | "state" | "country";

const TEXT_FIELDS: { key: TextKey; maxLength: number; autoComplete: string }[] = [
  { key: "address", maxLength: LISTING_LIMITS.addressMax, autoComplete: "street-address" },
  { key: "city", maxLength: LISTING_LIMITS.placeMax, autoComplete: "address-level2" },
  { key: "state", maxLength: LISTING_LIMITS.placeMax, autoComplete: "address-level1" },
  { key: "country", maxLength: LISTING_LIMITS.placeMax, autoComplete: "country-name" },
];

const COORDINATE_FIELDS: ("latitude" | "longitude")[] = ["latitude", "longitude"];

const fieldId = (key: keyof ListingFormValues) => `listing-${key}`;

const LocationStep = ({ values, errors, onChange }: StepProps) => (
  <div className="flex flex-col gap-5">
    <div className="grid gap-5 sm:grid-cols-2">
      {TEXT_FIELDS.map(({ key, maxLength, autoComplete }) => (
        <FormField
          key={key}
          id={fieldId(key)}
          label={t(`hosting.form.fields.${key}`)}
          error={errors[key]}
          className={key === "address" ? "sm:col-span-2" : undefined}
        >
          <ListingFormInput
            {...fieldA11yProps(fieldId(key), errors[key])}
            name={key}
            value={values[key]}
            maxLength={maxLength}
            autoComplete={autoComplete}
            onChange={event => onChange({ [key]: event.target.value })}
          />
        </FormField>
      ))}
    </div>

    <fieldset className="flex flex-col gap-3 rounded-xl border border-hairline p-4">
      <legend className="px-1 text-sm font-semibold text-ink">
        {t("hosting.form.fields.coordinates")}
      </legend>
      <p className="text-sm text-ink-muted">{t("hosting.form.fields.coordinatesHint")}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {COORDINATE_FIELDS.map(key => (
          <FormField key={key} id={fieldId(key)} label={t(`hosting.form.fields.${key}`)} error={errors[key]}>
            <ListingFormInput
              {...fieldA11yProps(fieldId(key), errors[key])}
              name={key}
              inputMode="decimal"
              required
              value={values[key]}
              onChange={event => onChange({ [key]: event.target.value.replace(/[^\d.-]/g, "") })}
            />
          </FormField>
        ))}
      </div>
    </fieldset>
  </div>
);

export default LocationStep;
