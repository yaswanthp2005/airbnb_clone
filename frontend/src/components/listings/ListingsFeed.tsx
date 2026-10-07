"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";

import { t } from "@/common/i18n";
import { Skeleton } from "@/components/ui/skeleton";
import { INFINITE_SCROLL_ROOT_MARGIN, LISTING_EAGER_IMAGE_COUNT } from "@/constants";
import { MAP_SPLIT_MEDIA_QUERY } from "@/constants/map";
import { listingRoute } from "@/constants/routes";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { useListingsInfinite } from "@/queries/listings";
import type { ListingSummary } from "@/types/listing";
import { buildUrl } from "@/utils/buildUrl";

import {
  EMPTY_LISTING_FILTERS,
  LISTING_GRID_CLASS_NAME,
  LISTING_MAP_GRID_CLASS_NAME,
  NEXT_PAGE_SKELETON_COUNT,
} from "./constants";
import { useListingFilters } from "./hooks/useListingFilters";
import HoverableListingCard from "./HoverableListingCard";
import ListingCardSkeleton from "./ListingCardSkeleton";
import ListingGridSkeleton from "./ListingGridSkeleton";
import ListingsEmptyState from "./ListingsEmptyState";
import { countActiveFilters, hasSearchCriteria, stayQuery } from "./utils";

const MapSkeleton = () => (
  <Skeleton role="status" aria-label={t("listings.map.loading")} className="size-full rounded-none" />
);

/** Leaflet touches `window`, so the map only ever renders in the browser. */
const ListingsMap = dynamic(() => import("./map/ListingsMap"), {
  ssr: false,
  loading: MapSkeleton,
});

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
  // Browsing a category shows the map beside the cards; the default "Trending" view is list-only.
  const isSplitView = Boolean(filters.category);
  // The layout is CSS-driven (no shift after hydration); this only avoids mounting a hidden map.
  const isMapVisible = useMediaQuery(MAP_SPLIT_MEDIA_QUERY);
  const [hoveredListingId, setHoveredListingId] = useState<number | null>(null);

  const listings = useMemo(
    () => data?.pages.flatMap(page => page.items) ?? [],
    [data],
  );
  const listingQuery = useMemo(() => stayQuery(filters), [filters]);
  const filtersKey = useMemo(() => JSON.stringify(filters), [filters]);
  const listingHref = useCallback(
    (listing: ListingSummary) => buildUrl({ path: listingRoute(listing.id), query: listingQuery }),
    [listingQuery],
  );
  const gridClassName = isSplitView ? LISTING_MAP_GRID_CLASS_NAME : LISTING_GRID_CLASS_NAME;

  const sentinelRef = useIntersectionObserver<HTMLDivElement>({
    onIntersect: fetchNextPage,
    enabled: hasNextPage && !isFetchingNextPage,
    rootMargin: INFINITE_SCROLL_ROOT_MARGIN,
  });

  const renderResults = (): ReactNode => {
    if (isPending) {
      return <ListingGridSkeleton className={gridClassName} />;
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
      const hasAnyFilter =
        countActiveFilters(filters) > 0 ||
        Boolean(filters.category) ||
        hasSearchCriteria(filters);

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
        <div className={gridClassName}>
          {listings.map((listing, index) => (
            <HoverableListingCard
              key={listing.id}
              listing={listing}
              href={listingHref(listing)}
              isEager={index < LISTING_EAGER_IMAGE_COUNT}
              onHoverChange={isSplitView && isMapVisible ? setHoveredListingId : undefined}
            />
          ))}
          {isFetchingNextPage
            ? Array.from({ length: NEXT_PAGE_SKELETON_COUNT }, (_, index) => (
                <ListingCardSkeleton key={`next-page-skeleton-${index}`} />
              ))
            : null}
        </div>
        {/* Keyed by filters so a fresh observer re-checks visibility for each result set. */}
        <div key={filtersKey} ref={sentinelRef} aria-hidden="true" className="h-px" />
      </>
    );
  };

  return (
    <div
      className={cn(
        isSplitView && "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:items-start lg:gap-8",
      )}
    >
      <div>{renderResults()}</div>
      {isSplitView ? (
        <aside
          aria-label={t("listings.map.label")}
          className="sticky isolate top-[calc(var(--app-header-height)+1rem)] hidden h-[calc(100dvh-var(--app-header-height)-2rem)] overflow-hidden rounded-xl border border-hairline lg:block"
        >
          {isMapVisible ? (
            <ListingsMap
              listings={listings}
              resultsKey={filtersKey}
              hoveredListingId={hoveredListingId}
              listingHref={listingHref}
            />
          ) : (
            <MapSkeleton />
          )}
        </aside>
      ) : null}
    </div>
  );
};

export default ListingsFeed;
