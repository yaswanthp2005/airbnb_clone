"use client";

import Link from "next/link";
import { House } from "lucide-react";

import { t } from "@/common/i18n";
import { Skeleton } from "@/components/ui/skeleton";
import { LISTING_EAGER_IMAGE_COUNT } from "@/constants";
import { routes } from "@/constants/routes";
import { useHostListingsInfinite } from "@/queries/host";
import type { HostListing } from "@/types/host";

import { HOST_LISTING_GRID_CLASS_NAME, HOST_SKELETON_COUNT } from "./constants";
import HostListingCard from "./HostListingCard";
import LoadError from "./LoadError";
import ShowMoreButton from "./ShowMoreButton";

type HostListingsListProps = {
  onDelete: (listing: HostListing) => void;
};

const HostListingsList = ({ onDelete }: HostListingsListProps) => {
  const { data, isPending, isError, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useHostListingsInfinite();

  if (isPending) {
    return (
      <div className={HOST_LISTING_GRID_CLASS_NAME} aria-busy="true">
        {Array.from({ length: HOST_SKELETON_COUNT }, (_, index) => (
          <div key={index} className="flex flex-col gap-3">
            <Skeleton className="aspect-[3/2] w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return <LoadError onRetry={() => void refetch()} />;
  }

  const listings = data.pages.flatMap(page => page.items);

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-start gap-3 border-b border-hairline pb-12 pt-4">
        <House className="size-10 text-brand" strokeWidth={1.5} aria-hidden="true" />
        <h2 className="text-[22px] font-semibold text-ink">{t("hosting.listings.emptyTitle")}</h2>
        <p className="max-w-md text-base text-ink-muted">{t("hosting.listings.emptyDescription")}</p>
        <Link
          href={routes.hostingNewListing}
          className="mt-3 rounded-lg bg-ink px-6 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90"
        >
          {t("hosting.createListing")}
        </Link>
      </div>
    );
  }

  return (
    <>
      <ul className={HOST_LISTING_GRID_CLASS_NAME}>
        {listings.map((listing, index) => (
          <li key={listing.id} className="flex">
            <HostListingCard
              listing={listing}
              onDelete={onDelete}
              isEager={index < LISTING_EAGER_IMAGE_COUNT}
            />
          </li>
        ))}
      </ul>
      {hasNextPage ? (
        <ShowMoreButton
          label={t("hosting.listings.showMore")}
          isLoading={isFetchingNextPage}
          onClick={() => void fetchNextPage()}
        />
      ) : null}
    </>
  );
};

export default HostListingsList;
