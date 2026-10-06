"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";

import { t } from "@/common/i18n";
import PageContainer from "@/components/layout/PageContainer";
import FiltersModal from "@/components/listings/FiltersModal";
import { useListingFilters } from "@/components/listings/hooks/useListingFilters";
import { countActiveFilters } from "@/components/listings/utils";
import { cn } from "@/lib/utils";

import CategoryTab from "./CategoryTab";
import { CATEGORIES, DEFAULT_CATEGORY_KEY } from "./constants";
import { useHorizontalScroll } from "./hooks/useHorizontalScroll";

type ScrollArrowProps = {
  direction: "left" | "right";
  isVisible: boolean;
  onClick: () => void;
};

const ScrollArrow = ({ direction, isVisible, onClick }: ScrollArrowProps) => {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-y-0 z-10 flex items-center transition-opacity",
        direction === "left"
          ? "left-0 bg-linear-to-r from-white from-60% to-transparent pr-10"
          : "right-0 bg-linear-to-l from-white from-60% to-transparent pl-10",
        isVisible ? "opacity-100" : "opacity-0",
      )}
    >
      <button
        type="button"
        tabIndex={isVisible ? 0 : -1}
        aria-label={t(direction === "left" ? "categories.scrollLeft" : "categories.scrollRight")}
        onClick={onClick}
        className={cn(
          "flex size-7 items-center justify-center rounded-full border border-hairline/80 bg-white text-ink transition-shadow hover:shadow-pill-hover",
          isVisible && "pointer-events-auto",
        )}
      >
        <Icon className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
      </button>
    </div>
  );
};

const CategoryBar = () => {
  const { filters, setFilters } = useListingFilters();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const activeKey = filters.category ?? DEFAULT_CATEGORY_KEY;
  const activeFilterCount = countActiveFilters(filters);
  const { ref, canScrollLeft, canScrollRight, scrollByStep } =
    useHorizontalScroll<HTMLDivElement>();

  const handleSelect = (key: string) => {
    setFilters({
      ...filters,
      category: key === DEFAULT_CATEGORY_KEY ? undefined : key,
    });
  };

  return (
    <PageContainer>
      <div className="flex h-[78px] items-center gap-6 pt-3">
        <div className="relative min-w-0 flex-1">
          <ScrollArrow
            direction="left"
            isVisible={canScrollLeft}
            onClick={() => scrollByStep("left")}
          />
          <div
            ref={ref}
            role="tablist"
            aria-label={t("categories.label")}
            className="scrollbar-none flex gap-8 overflow-x-auto"
          >
            {CATEGORIES.map(category => (
              <CategoryTab
                key={category.key}
                category={category}
                isActive={category.key === activeKey}
                onSelect={handleSelect}
              />
            ))}
          </div>
          <ScrollArrow
            direction="right"
            isVisible={canScrollRight}
            onClick={() => scrollByStep("right")}
          />
        </div>

        <button
          type="button"
          onClick={() => setIsFiltersOpen(true)}
          aria-label={
            activeFilterCount > 0
              ? t("categories.filtersApplied", { count: activeFilterCount })
              : undefined
          }
          className={cn(
            "relative mb-2 flex h-12 shrink-0 items-center gap-2 rounded-xl border px-4 text-xs font-semibold text-ink transition-colors hover:border-ink hover:bg-surface-muted",
            activeFilterCount > 0 ? "border-ink bg-surface-muted" : "border-hairline",
          )}
        >
          <SlidersHorizontal className="size-4" aria-hidden="true" />
          {t("categories.filters")}
          {activeFilterCount > 0 ? (
            <span
              aria-hidden="true"
              className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-ink text-[10px] font-bold text-white"
            >
              {activeFilterCount}
            </span>
          ) : null}
        </button>
      </div>

      <FiltersModal
        open={isFiltersOpen}
        onOpenChange={setIsFiltersOpen}
        filters={filters}
        onApply={setFilters}
      />
    </PageContainer>
  );
};

export default CategoryBar;
