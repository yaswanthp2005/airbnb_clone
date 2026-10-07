import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import PageContainer from "@/components/layout/PageContainer";

export const STATUS_PRIMARY_ACTION_CLASS_NAME =
  "rounded-lg bg-ink px-6 py-3.5 text-base font-semibold text-on-ink transition-colors hover:bg-ink-strong";
export const STATUS_SECONDARY_ACTION_CLASS_NAME =
  "rounded-lg border border-ink px-6 py-3.5 text-base font-semibold text-ink transition-colors hover:bg-surface-muted";

type StatusPageProps = {
  title: string;
  description: string;
  eyebrow?: string;
  icon?: LucideIcon;
  /** Links / buttons, styled with the `STATUS_*_ACTION_CLASS_NAME`s. */
  actions: ReactNode;
};

/** Centered full-page message: 404, errors, coming soon, missing records. */
const StatusPage = ({ title, description, eyebrow, icon: Icon, actions }: StatusPageProps) => (
  <PageContainer className="flex flex-1 items-center justify-center py-24">
    <div className="flex max-w-md flex-col items-center text-center">
      {Icon ? (
        <span className="mb-6 flex size-16 items-center justify-center rounded-full bg-surface-muted text-brand">
          <Icon className="size-8" strokeWidth={1.5} aria-hidden="true" />
        </span>
      ) : null}
      {eyebrow ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">{eyebrow}</p>
      ) : null}
      <h1 className="mb-3 text-[32px] font-semibold leading-tight text-ink">{title}</h1>
      <p className="mb-8 text-base text-ink-muted">{description}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">{actions}</div>
    </div>
  </PageContainer>
);

export default StatusPage;
