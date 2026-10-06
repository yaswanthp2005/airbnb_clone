import { t } from "@/common/i18n";
import { cn } from "@/lib/utils";

import type { Category } from "./constants";

type CategoryTabProps = {
  category: Category;
  isActive: boolean;
  onSelect: (key: string) => void;
};

const CategoryTab = ({ category, isActive, onSelect }: CategoryTabProps) => {
  const Icon = category.icon;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => onSelect(category.key)}
      className={cn(
        "group flex shrink-0 flex-col items-center gap-2 border-b-2 pb-2.5 pt-1 transition-colors",
        isActive
          ? "border-ink text-ink"
          : "border-transparent text-ink-muted hover:border-hairline hover:text-ink",
      )}
    >
      <Icon
        className={cn("size-6", !isActive && "opacity-70 group-hover:opacity-100")}
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <span className="whitespace-nowrap text-xs font-semibold">
        {t(category.labelKey)}
      </span>
    </button>
  );
};

export default CategoryTab;
