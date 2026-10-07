"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";

import { t } from "@/common/i18n";
import PageContainer from "@/components/layout/PageContainer";
import { LISTING_GRID_CLASS_NAME, NEXT_PAGE_SKELETON_COUNT } from "@/components/listings/constants";
import ListingCard from "@/components/listings/ListingCard";
import ListingCardSkeleton from "@/components/listings/ListingCardSkeleton";
import ListingGridSkeleton from "@/components/listings/ListingGridSkeleton";
import ListingsEmptyState from "@/components/listings/ListingsEmptyState";
import { INFINITE_SCROLL_ROOT_MARGIN, LISTING_EAGER_IMAGE_COUNT } from "@/constants";
import { routes } from "@/constants/routes";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useWishlistInfinite } from "@/queries/wishlist";

import { WISHLIST_SKELETON_COUNT } from "./constants";

const WishlistEmptyState = () => (
  <div className="flex flex-col items-start gap-3 border-b border-hairline pb-12 pt-2">
    <Heart className="size-10 text-brand" strokeWidth={1.5} aria-hidden="true" />
    <h2 className="text-[22px] font-semibold text-ink">{t("wishlists.empty.title")}</h2>
    <p className="max-w-md text-base text-ink-muted">{t("wishlists.empty.description")}</p>
    <Link
      href={routes.home}
      className="mt-3 rounded-lg bg-ink px-6 py-3 text-base font-semibold text-on-ink transition-colors hover:bg-ink-strong"
    >
      {t("wishlists.empty.action")}
    </Link>
  </div>
);

const Wishlists = () => {
  const { data, isPending, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useWishlistInfinite();

  const listings = useMemo(() => data?.pages.flatMap(page => page.items) ?? [], [data]);
  const total = data?.pages[0]?.total ?? 0;

  const sentinelRef = useIntersectionObserver<HTMLDivElement>({
    onIntersect: fetchNextPage,
    enabled: hasNextPage && !isFetchingNextPage,
    rootMargin: INFINITE_SCROLL_ROOT_MARGIN,
  });

  let content: React.ReactNode;
  if (isPending) {
    content = <ListingGridSkeleton count={WISHLIST_SKELETON_COUNT} />;
  } else if (isError && listings.length === 0) {
    content = (
      <ListingsEmptyState
        title={t("listings.error.title")}
        description={t("listings.error.description")}
        actionLabel={t("listings.error.retry")}
        onAction={() => refetch()}
      />
    );
  } else if (listings.length === 0) {
    content = <WishlistEmptyState />;
  } else {
    content = (
      <>
        <div className={LISTING_GRID_CLASS_NAME}>
          {listings.map((listing, index) => (
            <ListingCard key={listing.id} listing={listing} isEager={index < LISTING_EAGER_IMAGE_COUNT} />
          ))}
          {isFetchingNextPage
            ? Array.from({ length: NEXT_PAGE_SKELETON_COUNT }, (_, index) => (
                <ListingCardSkeleton key={`next-page-skeleton-${index}`} />
              ))
            : null}
        </div>
        <div ref={sentinelRef} aria-hidden="true" className="h-px" />
      </>
    );
  }

  return (
    <PageContainer className="pb-16 pt-8 md:pt-12">
      <h1 className="text-[32px] font-semibold leading-tight text-ink">{t("wishlists.title")}</h1>
      <p className="mb-8 mt-1 min-h-6 text-base text-ink-muted">
        {!isPending && total > 0
          ? t(total === 1 ? "wishlists.countOne" : "wishlists.countOther", { count: total })
          : null}
      </p>
      {content}
    </PageContainer>
  );
};

export default Wishlists;
