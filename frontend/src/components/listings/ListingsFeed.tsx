"use client";

import { useMemo } from "react";

import { t } from "@/common/i18n";
import { INFINITE_SCROLL_ROOT_MARGIN, LISTING_EAGER_IMAGE_COUNT } from "@/constants";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useListingsInfinite } from "@/queries/listings";

import {
  EMPTY_LISTING_FILTERS,
  LISTING_GRID_CLASS_NAME,
  NEXT_PAGE_SKELETON_COUNT,
} from "./constants";
import { useListingFilters } from "./hooks/useListingFilters";
import ListingCard from "./ListingCard";
import ListingCardSkeleton from "./ListingCardSkeleton";
import ListingGridSkeleton from "./ListingGridSkeleton";
import ListingsEmptyState from "./ListingsEmptyState";
import { countActiveFilters } from "./utils";

const ListingsFeed = () => {
  const { filters, setFilters } = useListingFilters();
  const {
    data,
    isPending,
    isError,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useListingsInfinite(filters);

  const listings = useMemo(
    () => data?.pages.flatMap(page => page.items) ?? [],
    [data],
  );

  const sentinelRef = useIntersectionObserver<HTMLDivElement>({
    onIntersect: fetchNextPage,
    enabled: hasNextPage && !isFetchingNextPage,
    rootMargin: INFINITE_SCROLL_ROOT_MARGIN,
  });

  if (isPending) {
    return <ListingGridSkeleton />;
  }

  if (isError && listings.length === 0) {
    return (
      <ListingsEmptyState
        title={t("listings.error.title")}
        description={t("listings.error.description")}
        actionLabel={t("listings.error.retry")}
        onAction={() => refetch()}
      />
    );
  }

  if (listings.length === 0) {
    const hasAnyFilter = countActiveFilters(filters) > 0 || Boolean(filters.category);

    return (
      <ListingsEmptyState
        title={t("listings.empty.title")}
        description={t(
          hasAnyFilter ? "listings.empty.description" : "listings.empty.noListings",
        )}
        actionLabel={hasAnyFilter ? t("listings.empty.removeFilters") : undefined}
        onAction={() => setFilters(EMPTY_LISTING_FILTERS)}
      />
    );
  }

  return (
    <>
      <div className={LISTING_GRID_CLASS_NAME}>
        {listings.map((listing, index) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            isEager={index < LISTING_EAGER_IMAGE_COUNT}
          />
        ))}
        {isFetchingNextPage
          ? Array.from({ length: NEXT_PAGE_SKELETON_COUNT }, (_, index) => (
              <ListingCardSkeleton key={`next-page-skeleton-${index}`} />
            ))
          : null}
      </div>
      {/* Keyed by filters so a fresh observer re-checks visibility for each result set. */}
      <div
        key={JSON.stringify(filters)}
        ref={sentinelRef}
        aria-hidden="true"
        className="h-px"
      />
    </>
  );
};

export default ListingsFeed;
