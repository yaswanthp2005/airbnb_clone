"use client";

import Link from "next/link";
import { CircleCheck, CircleX } from "lucide-react";

import { t } from "@/common/i18n";
import RemoteImage from "@/components/common/RemoteImage";
import PageContainer from "@/components/layout/PageContainer";
import PriceBreakdownList from "@/components/listingDetail/BookingCard/PriceBreakdownList";
import { pluralize } from "@/components/listingDetail/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { listingRoute, routes } from "@/constants/routes";
import { useBooking } from "@/queries/bookings";
import type { Booking } from "@/types/booking";

import { CONFIRMATION_PHOTO_SIZES } from "./constants";
import { bookingBreakdown, formatTripDate } from "./utils";

type BookingConfirmationProps = {
  bookingId: number;
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start justify-between gap-4 py-4">
    <dt className="text-base text-ink-muted">{label}</dt>
    <dd className="text-right text-base font-medium text-ink">{value}</dd>
  </div>
);

const ConfirmationSkeleton = () => (
  <PageContainer width="narrow" className="max-w-3xl py-12">
    <Skeleton className="size-12 rounded-full" />
    <Skeleton className="mt-6 h-9 w-80" />
    <Skeleton className="mt-3 h-5 w-56" />
    <Skeleton className="mt-10 h-96 w-full rounded-xl" />
  </PageContainer>
);

const BookingNotFound = () => (
  <PageContainer className="flex flex-1 items-center justify-center py-24">
    <div className="flex max-w-md flex-col items-center text-center">
      <h1 className="mb-3 text-[32px] font-semibold leading-tight text-ink">
        {t("bookingConfirmation.notFound.title")}
      </h1>
      <p className="mb-8 text-base text-ink-muted">{t("bookingConfirmation.notFound.description")}</p>
      <Link
        href={routes.trips}
        className="rounded-lg bg-ink px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-black"
      >
        {t("bookingConfirmation.goToTrips")}
      </Link>
    </div>
  </PageContainer>
);

const ConfirmationContent = ({ booking }: { booking: Booking }) => {
  const isCancelled = booking.status === "cancelled";
  const { listing } = booking;
  const StatusIcon = isCancelled ? CircleX : CircleCheck;

  return (
    <PageContainer width="narrow" className="max-w-3xl py-10 md:py-14">
      <StatusIcon
        className={isCancelled ? "size-12 text-ink-muted" : "size-12 text-brand"}
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <h1 className="mt-5 text-[28px] font-semibold leading-9 text-ink md:text-[32px]">
        {t(isCancelled ? "bookingConfirmation.cancelledTitle" : "bookingConfirmation.title")}
      </h1>
      <p className="mt-2 text-base text-ink-muted">
        {isCancelled
          ? t("bookingConfirmation.cancelledSubtitle")
          : t("bookingConfirmation.subtitle", { city: listing.city })}
      </p>

      <article className="mt-10 overflow-hidden rounded-xl border border-hairline">
        <Link href={listingRoute(listing.id)} className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
          <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-lg bg-surface-muted sm:w-40">
            {listing.photoUrl ? (
              <RemoteImage
                src={listing.photoUrl}
                alt={listing.title}
                fill
                sizes={CONFIRMATION_PHOTO_SIZES}
                loading="eager"
                className="object-cover"
              />
            ) : null}
          </div>
          <div className="min-w-0">
            <p className="text-sm text-ink-muted">
              {t("bookingConfirmation.propertyIn", { type: listing.propertyType, city: listing.city })}
            </p>
            <h2 className="mt-1 text-lg font-semibold text-ink">{listing.title}</h2>
            <p className="mt-1 text-sm text-ink-muted">
              {t("bookingConfirmation.hostedBy", { name: listing.hostName })}
            </p>
          </div>
        </Link>

        <dl className="divide-y divide-hairline border-t border-hairline px-6">
          <DetailRow label={t("bookingConfirmation.checkIn")} value={formatTripDate(booking.checkIn)} />
          <DetailRow label={t("bookingConfirmation.checkOut")} value={formatTripDate(booking.checkOut)} />
          <DetailRow
            label={t("bookingConfirmation.guests")}
            value={pluralize(booking.guests, "bookingConfirmation.guestCount")}
          />
          <DetailRow
            label={t("bookingConfirmation.confirmationCode")}
            value={t("bookingConfirmation.code", { id: booking.id })}
          />
        </dl>

        <div className="border-t border-hairline px-6 pb-6 pt-6">
          <h2 className="text-lg font-semibold text-ink">
            {t(isCancelled ? "bookingConfirmation.refundDetails" : "bookingConfirmation.paymentDetails")}
          </h2>
          <PriceBreakdownList
            breakdown={bookingBreakdown(booking)}
            totalLabel={t(isCancelled ? "bookingConfirmation.totalRefunded" : "bookingConfirmation.totalPaid")}
            className="mt-4"
          />
        </div>
      </article>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href={routes.trips}
          className="rounded-lg bg-ink px-6 py-3.5 text-center text-base font-semibold text-white transition-colors hover:bg-black"
        >
          {t("bookingConfirmation.goToTrips")}
        </Link>
        <Link
          href={routes.home}
          className="rounded-lg border border-ink px-6 py-3.5 text-center text-base font-semibold text-ink transition-colors hover:bg-surface-muted"
        >
          {t("bookingConfirmation.keepExploring")}
        </Link>
      </div>
    </PageContainer>
  );
};

const BookingConfirmation = ({ bookingId }: BookingConfirmationProps) => {
  const { data: booking, isPending, isError } = useBooking(bookingId);

  if (isPending) {
    return <ConfirmationSkeleton />;
  }
  if (isError) {
    return <BookingNotFound />;
  }
  return <ConfirmationContent booking={booking} />;
};

export default BookingConfirmation;
