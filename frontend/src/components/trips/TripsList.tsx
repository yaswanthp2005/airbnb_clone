"use client";

import Link from "next/link";
import { Luggage } from "lucide-react";

import { t } from "@/common/i18n";
import { Skeleton } from "@/components/ui/skeleton";
import { routes } from "@/constants/routes";
import { useMyBookingsInfinite } from "@/queries/bookings";
import type { Booking, BookingTab } from "@/types/booking";

import { TRIP_SKELETON_COUNT } from "./constants";
import TripCard from "./TripCard";

type TripsListProps = {
  tab: BookingTab;
  onCancel: (booking: Booking) => void;
};

const GRID_CLASS_NAME = "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

const TripsList = ({ tab, onCancel }: TripsListProps) => {
  const { data, isPending, isError, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useMyBookingsInfinite(tab);

  if (isPending) {
    return (
      <div className={GRID_CLASS_NAME} aria-busy="true">
        {Array.from({ length: TRIP_SKELETON_COUNT }, (_, index) => (
          <div key={index} className="flex flex-col gap-3">
            <Skeleton className="aspect-[3/2] w-full rounded-xl" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-start gap-4 py-10">
        <p className="text-base text-ink-muted">{t("common.somethingWentWrong")}</p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="rounded-lg border border-ink px-5 py-2.5 text-sm font-semibold text-ink hover:bg-surface-muted"
        >
          {t("trips.retry")}
        </button>
      </div>
    );
  }

  const bookings = data.pages.flatMap(page => page.items);

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-start gap-3 border-b border-hairline pb-12 pt-4">
        <Luggage className="size-10 text-brand" strokeWidth={1.5} aria-hidden="true" />
        <h2 className="text-[22px] font-semibold text-ink">{t(`trips.empty.${tab}.title`)}</h2>
        <p className="max-w-md text-base text-ink-muted">{t(`trips.empty.${tab}.description`)}</p>
        <Link
          href={routes.home}
          className="mt-3 rounded-lg border border-ink px-6 py-3 text-base font-semibold text-ink transition-colors hover:bg-surface-muted"
        >
          {t("trips.startSearching")}
        </Link>
      </div>
    );
  }

  return (
    <>
      <ul className={GRID_CLASS_NAME}>
        {bookings.map(booking => (
          <li key={booking.id} className="flex">
            <TripCard booking={booking} onCancel={onCancel} />
          </li>
        ))}
      </ul>
      {hasNextPage ? (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => void fetchNextPage()}
            disabled={isFetchingNextPage}
            className="rounded-lg border border-ink px-6 py-3 text-base font-semibold text-ink transition-colors hover:bg-surface-muted disabled:opacity-40"
          >
            {t(isFetchingNextPage ? "common.loading" : "trips.showMore")}
          </button>
        </div>
      ) : null}
    </>
  );
};

export default TripsList;
