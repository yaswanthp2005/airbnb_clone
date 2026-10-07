"use client";

import { useState } from "react";
import Link from "next/link";

import { t } from "@/common/i18n";
import RemoteImage from "@/components/common/RemoteImage";
import UserAvatar from "@/components/listingDetail/UserAvatar";
import { pluralize } from "@/components/listingDetail/utils";
import { formatDateRange } from "@/components/search/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { listingRoute } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { useHostBookingsInfinite } from "@/queries/host";
import type { HostBooking, HostBookingTab } from "@/types/host";
import { formatPrice } from "@/utils/formatPrice";

import {
  DEFAULT_RESERVATION_TAB,
  RESERVATION_GRID_CLASS_NAME,
  RESERVATION_SKELETON_COUNT,
  RESERVATION_TABS,
  RESERVATION_THUMBNAIL_SIZES,
} from "./constants";
import LoadError from "./LoadError";
import ShowMoreButton from "./ShowMoreButton";

const ReservationRow = ({ booking }: { booking: HostBooking }) => {
  const isCancelled = booking.status === "cancelled";

  return (
    <li
      data-booking-id={booking.id}
      className={cn(
        "grid gap-4 border-b border-hairline py-5 last:border-b-0 md:items-center",
        RESERVATION_GRID_CLASS_NAME,
      )}
    >
      <div className="flex items-center gap-3">
        <UserAvatar name={booking.guest.name} avatarUrl={booking.guest.avatarUrl} />
        <div className="flex flex-col">
          <span className="text-base font-semibold text-ink">{booking.guest.name}</span>
          <span className="text-sm text-ink-muted">
            {pluralize(booking.guests, "bookingConfirmation.guestCount")}
          </span>
        </div>
      </div>
      <Link href={listingRoute(booking.listing.id)} className="flex min-w-0 items-center gap-3 hover:underline">
        <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
          {booking.listing.photoUrl ? (
            <RemoteImage
              src={booking.listing.photoUrl}
              alt={booking.listing.title}
              fill
              sizes={RESERVATION_THUMBNAIL_SIZES}
              className="object-cover"
            />
          ) : null}
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="line-clamp-1 text-sm font-semibold text-ink">{booking.listing.title}</span>
          <span className="text-sm text-ink-muted">{booking.listing.city}</span>
        </div>
      </Link>
      <div className="flex flex-col text-sm">
        <span className="text-ink">{formatDateRange(booking.checkIn, booking.checkOut)}</span>
        <span className="text-ink-muted">{pluralize(booking.nights, "hosting.reservations.nights")}</span>
      </div>
      <div className="flex items-center gap-3 md:justify-end">
        {isCancelled ? (
          <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-ink">
            {t("hosting.reservations.cancelledBadge")}
          </span>
        ) : null}
        <span className={cn("text-base font-semibold text-ink", isCancelled && "text-ink-muted line-through")}>
          {formatPrice(booking.hostPayout)}
        </span>
      </div>
    </li>
  );
};

const ReservationsTabList = ({ tab }: { tab: HostBookingTab }) => {
  const { data, isPending, isError, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useHostBookingsInfinite(tab);

  if (isPending) {
    return (
      <div className="flex flex-col gap-4" aria-busy="true">
        {Array.from({ length: RESERVATION_SKELETON_COUNT }, (_, index) => (
          <Skeleton key={index} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <LoadError onRetry={() => void refetch()} />;
  }

  const bookings = data.pages.flatMap(page => page.items);

  if (bookings.length === 0) {
    return <p className="py-10 text-base text-ink-muted">{t(`hosting.reservations.empty.${tab}`)}</p>;
  }

  return (
    <>
      <div
        className={cn(
          "hidden gap-4 border-b border-hairline pb-3 text-xs font-semibold uppercase tracking-wide text-ink-muted md:grid",
          RESERVATION_GRID_CLASS_NAME,
        )}
      >
        <span>{t("hosting.reservations.guest")}</span>
        <span>{t("hosting.reservations.listing")}</span>
        <span>{t("hosting.reservations.dates")}</span>
        <span className="text-right">{t("hosting.reservations.payout")}</span>
      </div>
      <ul>
        {bookings.map(booking => (
          <ReservationRow key={booking.id} booking={booking} />
        ))}
      </ul>
      {hasNextPage ? (
        <ShowMoreButton
          label={t("hosting.reservations.showMore")}
          isLoading={isFetchingNextPage}
          onClick={() => void fetchNextPage()}
        />
      ) : null}
    </>
  );
};

const ReservationsList = () => {
  const [tab, setTab] = useState<HostBookingTab>(DEFAULT_RESERVATION_TAB);

  return (
    <div className="flex flex-col gap-6">
      <div role="group" className="flex flex-wrap gap-2">
        {RESERVATION_TABS.map(value => (
          <button
            key={value}
            type="button"
            aria-pressed={tab === value}
            onClick={() => setTab(value)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              tab === value
                ? "border-ink bg-ink text-on-ink"
                : "border-hairline text-ink hover:border-ink",
            )}
          >
            {t(`hosting.reservations.tabs.${value}`)}
          </button>
        ))}
      </div>
      <ReservationsTabList tab={tab} />
    </div>
  );
};

export default ReservationsList;
