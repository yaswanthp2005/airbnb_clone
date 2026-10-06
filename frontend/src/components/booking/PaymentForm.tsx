"use client";

import { ChevronDown, CircleAlert, CreditCard, Lock } from "lucide-react";

import { t } from "@/common/i18n";
import { cn } from "@/lib/utils";

import { COUNTRY_CODES, DEFAULT_COUNTRY, DEMO_CARD_NUMBER } from "./constants";
import {
  formatCardNumber,
  formatCvv,
  formatExpiry,
  formatPostalCode,
  type CardDetails,
  type CardErrors,
  type CardField,
} from "./utils";

type PaymentFormProps = {
  card: CardDetails;
  errors: CardErrors;
  onChange: (card: CardDetails) => void;
};

const fieldId = (field: CardField) => `payment-${field}`;
const errorId = (field: CardField) => `payment-${field}-error`;

const INPUT_CLASS_NAME =
  "w-full bg-transparent text-base text-ink outline-none placeholder:text-ink-muted/70";

type FieldBoxProps = {
  field: CardField;
  label: string;
  hasError: boolean;
  className?: string;
  children: React.ReactNode;
};

const FieldBox = ({ field, label, hasError, className, children }: FieldBoxProps) => (
  <label
    htmlFor={fieldId(field)}
    className={cn(
      "relative block px-3 py-2 focus-within:z-10 focus-within:rounded-lg focus-within:ring-2 focus-within:ring-ink",
      hasError && "bg-destructive/5",
      className,
    )}
  >
    <span className={cn("block text-xs", hasError ? "text-destructive" : "text-ink-muted")}>
      {label}
    </span>
    {children}
  </label>
);

const FieldErrors = ({ errors, fields }: { errors: CardErrors; fields: CardField[] }) => {
  const visible = fields.filter(field => errors[field]);
  if (visible.length === 0) {
    return null;
  }
  return (
    <ul className="mt-2 flex flex-col gap-1">
      {visible.map(field => (
        <li key={field} id={errorId(field)} className="flex items-center gap-1.5 text-xs text-destructive">
          <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
          {errors[field]}
        </li>
      ))}
    </ul>
  );
};

const PaymentForm = ({ card, errors, onChange }: PaymentFormProps) => {
  const update = (field: CardField, value: string) => onChange({ ...card, [field]: value });
  const inputProps = (field: CardField) => ({
    id: fieldId(field),
    name: field,
    value: card[field],
    "aria-invalid": Boolean(errors[field]),
    "aria-describedby": errors[field] ? errorId(field) : undefined,
    className: INPUT_CLASS_NAME,
  });
  const isIndia = card.country === DEFAULT_COUNTRY;

  return (
    <section aria-labelledby="pay-with-heading">
      <div className="flex items-center justify-between gap-4">
        <h2 id="pay-with-heading" className="text-[22px] font-semibold text-ink">
          {t("checkout.payment.title")}
        </h2>
        <span className="flex items-center gap-1.5 text-sm text-ink-muted">
          <CreditCard className="size-5" aria-hidden="true" />
          {t("checkout.payment.cardLabel")}
        </span>
      </div>
      <p className="mt-2 flex items-start gap-2 rounded-lg bg-surface-muted px-3 py-2 text-sm text-ink-muted">
        <Lock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        {t("checkout.payment.demoNotice", { card: DEMO_CARD_NUMBER })}
      </p>

      <div className="mt-4 rounded-lg border border-input">
        <FieldBox
          field="cardNumber"
          label={t("checkout.payment.cardNumber")}
          hasError={Boolean(errors.cardNumber)}
          className="rounded-t-lg border-b border-input"
        >
          <input
            {...inputProps("cardNumber")}
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder={t("checkout.payment.cardNumberPlaceholder")}
            onChange={event => update("cardNumber", formatCardNumber(event.target.value))}
          />
        </FieldBox>
        <div className="grid grid-cols-2">
          <FieldBox
            field="expiry"
            label={t("checkout.payment.expiry")}
            hasError={Boolean(errors.expiry)}
            className="rounded-bl-lg"
          >
            <input
              {...inputProps("expiry")}
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder={t("checkout.payment.expiryPlaceholder")}
              onChange={event => update("expiry", formatExpiry(event.target.value))}
            />
          </FieldBox>
          <FieldBox
            field="cvv"
            label={t("checkout.payment.cvv")}
            hasError={Boolean(errors.cvv)}
            className="rounded-br-lg border-l border-input"
          >
            <input
              {...inputProps("cvv")}
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder={t("checkout.payment.cvvPlaceholder")}
              onChange={event => update("cvv", formatCvv(event.target.value))}
            />
          </FieldBox>
        </div>
      </div>
      <FieldErrors errors={errors} fields={["cardNumber", "expiry", "cvv"]} />

      <div className="mt-4 rounded-lg border border-input">
        <FieldBox
          field="postalCode"
          label={t(isIndia ? "checkout.payment.pinCode" : "checkout.payment.postalCode")}
          hasError={Boolean(errors.postalCode)}
          className="rounded-lg"
        >
          <input
            {...inputProps("postalCode")}
            inputMode={isIndia ? "numeric" : "text"}
            autoComplete="postal-code"
            onChange={event => update("postalCode", formatPostalCode(event.target.value, card.country))}
          />
        </FieldBox>
      </div>
      <FieldErrors errors={errors} fields={["postalCode"]} />

      <div className="mt-4 rounded-lg border border-input">
        <FieldBox field="country" label={t("checkout.payment.country")} hasError={false} className="rounded-lg">
          <span className="flex items-center">
            <select
              id={fieldId("country")}
              name="country"
              value={card.country}
              autoComplete="country"
              onChange={event =>
                onChange({
                  ...card,
                  country: event.target.value,
                  postalCode: formatPostalCode(card.postalCode, event.target.value),
                })
              }
              className={cn(INPUT_CLASS_NAME, "cursor-pointer appearance-none pr-6")}
            >
              {COUNTRY_CODES.map(code => (
                <option key={code} value={code}>
                  {t(`checkout.payment.countries.${code}`)}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none -ml-5 size-4 text-ink" aria-hidden="true" />
          </span>
        </FieldBox>
      </div>
    </section>
  );
};

export default PaymentForm;
