import { CircleAlert } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const FORM_INPUT_CLASS_NAME =
  "h-auto min-h-0 w-full rounded-lg border-surface-strong bg-surface px-4 py-3 text-base shadow-none focus-visible:border-ink focus-visible:ring-1 focus-visible:ring-ink md:text-base dark:bg-surface";

type ListingFormInputProps = React.ComponentProps<typeof Input>;

export const ListingFormInput = ({ className, ...props }: ListingFormInputProps) => (
  <Input className={cn(FORM_INPUT_CLASS_NAME, className)} {...props} />
);

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
