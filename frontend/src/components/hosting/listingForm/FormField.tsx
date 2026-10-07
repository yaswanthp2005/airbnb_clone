import { CircleAlert } from "lucide-react";

import { cn } from "@/lib/utils";

export const FORM_INPUT_CLASS_NAME =
  "w-full rounded-lg border border-surface-strong bg-white px-4 py-3 text-base text-ink outline-none transition-shadow placeholder:text-ink-muted/70 focus:border-ink focus:ring-1 focus:ring-ink aria-invalid:border-destructive aria-invalid:ring-destructive";

export const fieldErrorId = (id: string) => `${id}-error`;

type FormFieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  trailing?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

const FormField = ({ id, label, error, hint, trailing, className, children }: FormFieldProps) => (
  <div className={cn("flex flex-col gap-1.5", className)}>
    <div className="flex items-baseline justify-between gap-2">
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
      </label>
      {trailing}
    </div>
    {children}
    {error ? (
      <p id={fieldErrorId(id)} className="flex items-center gap-1.5 text-sm text-destructive">
        <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
        {error}
      </p>
    ) : hint ? (
      <p className="text-sm text-ink-muted">{hint}</p>
    ) : null}
  </div>
);

export const fieldA11yProps = (id: string, error?: string) => ({
  id,
  "aria-invalid": Boolean(error),
  "aria-describedby": error ? fieldErrorId(id) : undefined,
});

export const StepError = ({ id, error }: { id: string; error?: string }) =>
  error ? (
    <p id={id} role="alert" className="flex items-center gap-1.5 text-sm text-destructive">
      <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
      {error}
    </p>
  ) : null;

export default FormField;
