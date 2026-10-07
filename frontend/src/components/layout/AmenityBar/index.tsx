"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";

import { t } from "@/common/i18n";
import PageContainer from "@/components/layout/PageContainer";
import FiltersModal from "@/components/listings/FiltersModal";
import { useListingFilters } from "@/components/listings/hooks/useListingFilters";
import { countActiveFilters, toggleValue } from "@/components/listings/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";
import { cn } from "@/lib/utils";
import { useListingFilterOptions, useSearchAmenities } from "@/queries/listings";

import ListingsSortSelect from "@/components/listings/ListingsSortSelect";
import type { ListingSort } from "@/types/listing";

import AmenityTab from "./AmenityTab";
import { AMENITY_TAB_SKELETON_COUNT } from "./constants";

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
        "pointer-events-none absolute inset-y-0 z-10 hidden items-center transition-opacity md:flex",
        direction === "left"
          ? "left-0 bg-linear-to-r from-surface from-60% to-transparent pr-10"
          : "right-0 bg-linear-to-l from-surface from-60% to-transparent pl-10",
        isVisible ? "opacity-100" : "opacity-0",
      )}
    >
      <button
        type="button"
        tabIndex={isVisible ? 0 : -1}
        aria-label={t(direction === "left" ? "amenityBar.scrollLeft" : "amenityBar.scrollRight")}
        onClick={onClick}
        className={cn(
          "flex size-7 items-center justify-center rounded-full border border-hairline/80 bg-surface text-ink transition-shadow hover:shadow-pill-hover",
          isVisible && "pointer-events-auto",
        )}
      >
        <Icon className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
      </button>
    </div>
  );
};

const AmenityBar = () => {
  const { filters, setFilters } = useListingFilters();
  const { data: filterOptions } = useListingFilterOptions();
  const { data: searchAmenities, isPending } = useSearchAmenities(filters);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const activeFilterCount = countActiveFilters(filters);
  const { ref, canScrollLeft, canScrollRight, scrollByStep } =
    useHorizontalScroll<HTMLDivElement>();

  // Selected amenities stay visible even when no listing in the search offers them, so they can be removed.
  const selectedElsewhere = (filterOptions?.amenities ?? []).filter(
    amenity =>
      filters.amenities.includes(amenity.id) &&
      !searchAmenities?.some(searchAmenity => searchAmenity.id === amenity.id),
  );
  const amenities = [...selectedElsewhere, ...(searchAmenities ?? [])];

  const handleToggle = (amenityId: number) => {
    setFilters({ ...filters, amenities: toggleValue(filters.amenities, amenityId) });
  };

  const handleSortChange = (sort: ListingSort) => {
    setFilters({ ...filters, sort: sort === "recommended" ? undefined : sort }, { scrollToTop: true });
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
            role="group"
            aria-label={t("amenityBar.label")}
            aria-busy={isPending}
            className="scrollbar-none flex gap-6 overflow-x-auto md:gap-8"
          >
            {isPending
              ? Array.from({ length: AMENITY_TAB_SKELETON_COUNT }, (_, index) => (
                  <div key={index} className="flex shrink-0 flex-col items-center gap-2 pb-3 pt-1">
                    <Skeleton className="size-6 rounded-md" />
                    <Skeleton className="h-3 w-14" />
                  </div>
                ))
              : amenities.map(amenity => (
                  <AmenityTab
                    key={amenity.id}
                    amenity={amenity}
                    isActive={filters.amenities.includes(amenity.id)}
                    onToggle={handleToggle}
                  />
                ))}
          </div>
          <ScrollArrow
            direction="right"
            isVisible={canScrollRight}
            onClick={() => scrollByStep("right")}
          />
        </div>

        <ListingsSortSelect value={filters.sort} onChange={handleSortChange} />

        <button
          type="button"
          onClick={() => setIsFiltersOpen(true)}
          aria-label={
            activeFilterCount > 0
              ? t("amenityBar.filtersApplied", { count: activeFilterCount })
              : t("amenityBar.filters")
          }
          className={cn(
            "relative mb-2 flex h-12 shrink-0 items-center gap-2 rounded-xl border px-4 text-xs font-semibold text-ink transition-colors hover:border-ink hover:bg-surface-muted",
            activeFilterCount > 0 ? "border-ink bg-surface-muted" : "border-hairline",
          )}
        >
          <SlidersHorizontal className="size-4" aria-hidden="true" />
          <span className="hidden md:inline">{t("amenityBar.filters")}</span>
          {activeFilterCount > 0 ? (
            <span
              aria-hidden="true"
              className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-ink text-[10px] font-bold text-on-ink"
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

export default AmenityBar;
