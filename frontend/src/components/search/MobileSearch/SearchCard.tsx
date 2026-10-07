import type { ReactNode } from "react";

type SearchCardProps = {
  isActive: boolean;
  label: string;
  value: string;
  title: string;
  onActivate: () => void;
  children: ReactNode;
};

/** One step of the mobile search: a one-line summary until tapped, then its full editor. */
const SearchCard = ({ isActive, label, value, title, onActivate, children }: SearchCardProps) =>
  isActive ? (
    <section aria-label={label} className="rounded-3xl bg-surface-raised p-5 shadow-card">
      <h2 className="text-[22px] font-semibold leading-7 text-ink">{title}</h2>
      {children}
    </section>
  ) : (
    <button
      type="button"
      onClick={onActivate}
      aria-expanded={false}
      className="flex w-full items-center justify-between gap-4 rounded-2xl bg-surface-raised px-5 py-5 text-sm shadow-card"
    >
      <span className="shrink-0 text-ink-muted">{label}</span>
      <span className="truncate font-semibold text-ink">{value}</span>
    </button>
  );

export default SearchCard;
