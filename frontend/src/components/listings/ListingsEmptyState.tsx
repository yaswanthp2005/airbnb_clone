import { SearchX } from "lucide-react";

type ListingsEmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

const ListingsEmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
}: ListingsEmptyStateProps) => (
  <div
    role="status"
    className="mx-auto flex max-w-md flex-col items-center gap-3 py-24 text-center"
  >
    <SearchX className="size-10 text-ink-muted" strokeWidth={1.5} aria-hidden="true" />
    <h2 className="text-[22px] font-semibold text-ink">{title}</h2>
    <p className="text-ink-muted">{description}</p>
    {actionLabel && onAction ? (
      <button
        type="button"
        onClick={onAction}
        className="mt-3 rounded-lg border border-ink px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface-muted"
      >
        {actionLabel}
      </button>
    ) : null}
  </div>
);

export default ListingsEmptyState;
