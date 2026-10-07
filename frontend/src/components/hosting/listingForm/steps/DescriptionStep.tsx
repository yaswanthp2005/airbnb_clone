import { t } from "@/common/i18n";
import { cn } from "@/lib/utils";

import { LISTING_LIMITS } from "../constants";
import FormField, { FORM_INPUT_CLASS_NAME, fieldA11yProps } from "../FormField";
import type { StepProps } from "../types";

const TITLE_ID = "listing-title";
const DESCRIPTION_ID = "listing-description";

const CharacterCount = ({ count, max }: { count: number; max: number }) => (
  <span className="text-sm text-ink-muted">{t("hosting.form.fields.characterCount", { count, max })}</span>
);

const DescriptionStep = ({ values, errors, onChange }: StepProps) => (
  <div className="flex flex-col gap-6">
    <FormField
      id={TITLE_ID}
      label={t("hosting.form.fields.title")}
      error={errors.title}
      trailing={<CharacterCount count={values.title.length} max={LISTING_LIMITS.titleMax} />}
    >
      <input
        {...fieldA11yProps(TITLE_ID, errors.title)}
        name="title"
        value={values.title}
        maxLength={LISTING_LIMITS.titleMax}
        placeholder={t("hosting.form.fields.titlePlaceholder")}
        onChange={event => onChange({ title: event.target.value })}
        className={cn(FORM_INPUT_CLASS_NAME, "text-lg")}
      />
    </FormField>
    <FormField
      id={DESCRIPTION_ID}
      label={t("hosting.form.fields.description")}
      error={errors.description}
      trailing={<CharacterCount count={values.description.length} max={LISTING_LIMITS.descriptionMax} />}
    >
      <textarea
        {...fieldA11yProps(DESCRIPTION_ID, errors.description)}
        name="description"
        rows={8}
        value={values.description}
        maxLength={LISTING_LIMITS.descriptionMax}
        placeholder={t("hosting.form.fields.descriptionPlaceholder")}
        onChange={event => onChange({ description: event.target.value })}
        className={cn(FORM_INPUT_CLASS_NAME, "resize-y leading-relaxed")}
      />
    </FormField>
  </div>
);

export default DescriptionStep;
