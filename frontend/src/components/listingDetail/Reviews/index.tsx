"use client";

import { useMemo } from "react";
import { Star } from "lucide-react";

import { t } from "@/common/i18n";
import { Skeleton } from "@/components/ui/skeleton";
import { REVIEWS_PAGE_SIZE } from "@/constants";
import { useListingReviewsInfinite } from "@/queries/listings";
import type { ListingDetail } from "@/types/listing";

import { RATING_DECIMALS, SECTION_IDS } from "../constants";
import { pluralize } from "../utils";
import RatingSummary from "./RatingSummary";
import ReviewCard from "./ReviewCard";

type ReviewsSectionProps = {
  listing: ListingDetail;
};

const ReviewSkeleton = () => (
  <div className="flex flex-col gap-3">
    <div className="flex items-center gap-3">
      <Skeleton className="size-12 rounded-full bg-surface-muted" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-28 bg-surface-muted" />
        <Skeleton className="h-3 w-20 bg-surface-muted" />
      </div>
    </div>
    <Skeleton className="h-3 w-32 bg-surface-muted" />
    <Skeleton className="h-12 w-full bg-surface-muted" />
  </div>
);

const ReviewsSection = ({ listing }: ReviewsSectionProps) => {
  const { data, isPending, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useListingReviewsInfinite(listing.id);
  const reviews = useMemo(() => data?.pages.flatMap(page => page.items) ?? [], [data]);

  if (listing.reviewCount === 0) {
    return (
      <section id={SECTION_IDS.reviews} className="border-t border-hairline py-12">
        <h2 className="text-[22px] font-semibold text-ink">{t("listingDetail.reviews.noReviews")}</h2>
        <p className="mt-2 text-base text-ink-muted">
          {t("listingDetail.reviews.noReviewsDescription")}
        </p>
      </section>
    );
  }

  return (
    <section id={SECTION_IDS.reviews} className="border-t border-hairline py-12">
      <h2 className="flex items-center gap-2 text-[22px] font-semibold text-ink">
        <Star className="size-4 fill-ink" aria-hidden="true" />
        <span>{listing.ratingAvg.toFixed(RATING_DECIMALS)}</span>
        <span aria-hidden="true">·</span>
        <span>{pluralize(listing.reviewCount, "listingDetail.overview.reviews")}</span>
      </h2>
      <RatingSummary breakdown={listing.ratingBreakdown} total={listing.reviewCount} />

      <div className="mt-10 grid gap-x-24 gap-y-10 md:grid-cols-2">
        {isPending
          ? Array.from({ length: REVIEWS_PAGE_SIZE }, (_, index) => <ReviewSkeleton key={index} />)
          : reviews.map(review => <ReviewCard key={review.id} review={review} />)}
      </div>

      {hasNextPage ? (
        <button
          type="button"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="mt-10 rounded-lg border border-ink px-6 py-3 text-base font-semibold text-ink transition-colors hover:bg-surface-muted disabled:cursor-wait disabled:opacity-60"
        >
          {t(isFetchingNextPage ? "listingDetail.reviews.loadingMore" : "listingDetail.reviews.showMore")}
        </button>
      ) : null}
    </section>
  );
};

export default ReviewsSection;
