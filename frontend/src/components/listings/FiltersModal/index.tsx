"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { t } from "@/common/i18n";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { FILTERS_PREVIEW_DEBOUNCE_MS } from "@/constants";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useListingFilterOptions, useListingsCount } from "@/queries/listings";
import type { ListingFilters } from "@/types/listing";

import { EMPTY_LISTING_FILTERS } from "../constants";
import { countActiveFilters, toggleValue } from "../utils";
import AmenitiesFilter from "./AmenitiesFilter";
import BedroomsFilter from "./BedroomsFilter";
import FilterSection from "./FilterSection";
import Footer from "./Footer";
import PriceRangeFilter from "./PriceRangeFilter";
import PropertyTypeFilter from "./PropertyTypeFilter";

type FiltersModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: ListingFilters;
  onApply: (filters: ListingFilters) => void;
};

type FiltersPanelProps = Omit<FiltersModalProps, "open" | "onOpenChange"> & {
  onClose: () => void;
};

const FiltersPanel = ({ filters, onApply, onClose }: FiltersPanelProps) => {
  const [draft, setDraft] = useState<ListingFilters>(filters);
  const { data: options, isPending: isOptionsPending } = useListingFilterOptions(
    filters.category,
  );

  const debouncedDraft = useDebouncedValue(draft, FILTERS_PREVIEW_DEBOUNCE_MS);
  const { data: resultCount, isFetching: isCounting } = useListingsCount(debouncedDraft);

  const updateDraft = (patch: Partial<ListingFilters>) =>
    setDraft(current => ({ ...current, ...patch }));

  const handlePriceChange = ([nextMin, nextMax]: [number, number]) => {
    if (!options) {
      return;
    }
    updateDraft({
      minPrice: nextMin <= options.minPrice ? undefined : nextMin,
      maxPrice: nextMax >= options.maxPrice ? undefined : nextMax,
    });
  };

  const handleApply = () => {
    onApply(draft);
    onClose();
  };

  return (
    <>
      <header className="relative flex h-16 shrink-0 items-center justify-center border-b border-hairline px-6">
        <DialogClose
          aria-label={t("listings.filters.close")}
          className="absolute left-4 flex size-8 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface-muted"
        >
          <X className="size-4" strokeWidth={2.5} aria-hidden="true" />
        </DialogClose>
        <DialogTitle className="text-base font-semibold text-ink">
          {t("listings.filters.title")}
        </DialogTitle>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-6">
        <FilterSection
          title={t("listings.filters.priceRange")}
          description={t("listings.filters.priceRangeDescription")}
        >
          {options ? (
            <PriceRangeFilter
              bounds={[options.minPrice, options.maxPrice]}
              histogram={options.priceHistogram}
              value={[
                draft.minPrice ?? options.minPrice,
                draft.maxPrice ?? options.maxPrice,
              ]}
              onChange={handlePriceChange}
            />
          ) : (
            <Skeleton className="h-36 w-full bg-surface-muted" />
          )}
        </FilterSection>

        <FilterSection title={t("listings.filters.propertyType")}>
          {isOptionsPending ? (
            <Skeleton className="h-10 w-full bg-surface-muted" />
          ) : (
            <PropertyTypeFilter
              options={options?.propertyTypes ?? []}
              selected={draft.propertyType}
              onToggle={propertyType =>
                updateDraft({ propertyType: toggleValue(draft.propertyType, propertyType) })
              }
            />
          )}
        </FilterSection>

        <FilterSection title={t("listings.filters.bedrooms")}>
          <BedroomsFilter
            value={draft.bedrooms}
            onChange={bedrooms => updateDraft({ bedrooms })}
          />
        </FilterSection>

        <FilterSection title={t("listings.filters.amenities")}>
          {isOptionsPending ? (
            <Skeleton className="h-32 w-full bg-surface-muted" />
          ) : (
            <AmenitiesFilter
              amenities={options?.amenities ?? []}
              selected={draft.amenities}
              onToggle={amenityId =>
                updateDraft({ amenities: toggleValue(draft.amenities, amenityId) })
              }
            />
          )}
        </FilterSection>
      </div>

      <Footer
        resultCount={resultCount}
        isCounting={isCounting}
        canClear={countActiveFilters(draft) > 0}
        onClear={() => setDraft({ ...EMPTY_LISTING_FILTERS, category: filters.category })}
        onApply={handleApply}
      />
    </>
  );
};

const FiltersModal = ({ open, onOpenChange, filters, onApply }: FiltersModalProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent
      showCloseButton={false}
      className="flex max-h-[calc(100dvh-4rem)] w-full max-w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden rounded-xl p-0 shadow-card sm:max-w-[780px]"
    >
      <FiltersPanel
        filters={filters}
        onApply={onApply}
        onClose={() => onOpenChange(false)}
      />
    </DialogContent>
  </Dialog>
);

export default FiltersModal;
