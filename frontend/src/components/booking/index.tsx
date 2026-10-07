"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startOfToday } from "date-fns";
import { ChevronLeft } from "lucide-react";

import { t } from "@/common/i18n";
import PageContainer from "@/components/layout/PageContainer";
import ReserveButton from "@/components/listingDetail/BookingCard/ReserveButton";
import { DETAIL_COLUMNS_CLASS_NAME } from "@/components/listingDetail/constants";
import { useBookingSelection } from "@/components/listingDetail/hooks/useBookingSelection";
import ListingUnavailable from "@/components/listingDetail/ListingUnavailable";
import {
  availabilityWindow,
  isStayBookable,
  selectionQuery,
} from "@/components/listingDetail/utils";
import { totalGuests } from "@/components/search/utils";
import { bookingRoute, listingRoute } from "@/constants/routes";
import { useCreateBooking } from "@/queries/bookings";
import { useListing, useListingUnavailableDates } from "@/queries/listings";
import type { ListingDetail } from "@/types/listing";
import { buildUrl } from "@/utils/buildUrl";
import { calculatePriceBreakdown } from "@/utils/pricing";

import BookingCheckoutSkeleton from "./BookingCheckoutSkeleton";
import PaymentForm from "./PaymentForm";
import PriceDetailsCard from "./PriceDetailsCard";
import TripDetails from "./TripDetails";
import { EMPTY_CARD, formatTripDate, validateCard, type CardDetails } from "./utils";

type BookingCheckoutProps = {
  listingSlug: string;
};

const NO_BOOKED_DATES: string[] = [];

const BookingCheckoutContent = ({ listing }: { listing: ListingDetail }) => {
  const router = useRouter();
  const [datesWindow] = useState(availabilityWindow);
  const [card, setCard] = useState<CardDetails>(EMPTY_CARD);
  const [showCardErrors, setShowCardErrors] = useState(false);
  const { selection, setDates, setGuests, guestLimits } = useBookingSelection(listing.maxGuests);
  const { data: bookedDates = NO_BOOKED_DATES } = useListingUnavailableDates(listing.slug, datesWindow);
  const bookedNights = useMemo(() => new Set(bookedDates), [bookedDates]);
  const createBooking = useCreateBooking();

  const { checkIn, checkOut } = selection;
  const dates = { checkIn, checkOut };
  const isBookable = isStayBookable(dates, bookedNights, startOfToday());
  const breakdown = isBookable
    ? calculatePriceBreakdown({
        nightlyPrice: listing.pricePerNight,
        cleaningFee: listing.cleaningFee,
        checkIn,
        checkOut,
      })
    : null;
  const cardErrors = showCardErrors ? validateCard(card, startOfToday()) : {};

  // After a successful booking the refetched availability includes the new booking itself.
  let datesError: string | undefined;
  if (!isBookable && !createBooking.isSuccess) {
    datesError = checkIn && checkOut
      ? t("listingDetail.booking.datesUnavailable")
      : t("checkout.trip.datesRequired");
  }

  const handleConfirm = () => {
    setShowCardErrors(true);
    const hasCardErrors = Object.keys(validateCard(card, startOfToday())).length > 0;
    if (!isBookable || !checkIn || !checkOut || hasCardErrors) {
      return;
    }
    createBooking.mutate(
      { listingId: listing.id, checkIn, checkOut, guests: totalGuests(selection) },
      { onSuccess: booking => router.replace(bookingRoute(booking.id)) },
    );
  };

  const isSubmitting = createBooking.isPending || createBooking.isSuccess;

  return (
    <PageContainer width="narrow" className="pb-16 pt-6 md:pt-10">
      <div className="flex items-center gap-2 md:-ml-12">
        <Link
          href={buildUrl({ path: listingRoute(listing.slug), query: selectionQuery(selection) })}
          aria-label={t("checkout.back")}
          className="flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface-muted"
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
        </Link>
        <h1 className="text-[26px] font-semibold leading-8 text-ink md:text-[32px] md:leading-9">
          {t("checkout.title")}
        </h1>
      </div>

      <div className={`mt-8 ${DETAIL_COLUMNS_CLASS_NAME}`}>
        <div className="flex min-w-0 flex-col">
          <div className="mb-8 md:hidden">
            <PriceDetailsCard listing={listing} breakdown={breakdown} />
          </div>

          <TripDetails
            dates={dates}
            guests={selection}
            guestLimits={guestLimits}
            city={listing.city}
            bookedDates={bookedDates}
            bookedNights={bookedNights}
            datesError={datesError}
            onDatesChange={setDates}
            onGuestsChange={setGuests}
          />

          <hr className="my-8 border-hairline" />
          <PaymentForm card={card} errors={cardErrors} onChange={setCard} />

          <hr className="my-8 border-hairline" />
          <section aria-labelledby="cancellation-heading">
            <h2 id="cancellation-heading" className="text-[22px] font-semibold text-ink">
              {t("checkout.cancellation.title")}
            </h2>
            <p className="mt-4 text-base text-ink">
              {checkIn
                ? t("checkout.cancellation.freeUntil", { date: formatTripDate(checkIn) })
                : t("checkout.cancellation.generic")}
            </p>
          </section>

          <hr className="my-8 border-hairline" />
          <p className="text-xs leading-5 text-ink-muted">{t("checkout.terms")}</p>
          <ReserveButton
            disabled={!isBookable || isSubmitting}
            onClick={handleConfirm}
            label={t(isSubmitting ? "checkout.confirming" : "checkout.confirmAndPay")}
            className="mt-6 w-full md:w-auto md:px-10"
          />
        </div>

        <aside className="hidden md:block">
          <div className="sticky top-32 pb-12">
            <PriceDetailsCard listing={listing} breakdown={breakdown} />
          </div>
        </aside>
      </div>
    </PageContainer>
  );
};

const BookingCheckout = ({ listingSlug }: BookingCheckoutProps) => {
  const { data: listing, isPending, isError } = useListing(listingSlug);

  if (isPending) {
    return <BookingCheckoutSkeleton />;
  }
  if (isError) {
    return <ListingUnavailable />;
  }
  return <BookingCheckoutContent listing={listing} />;
};

export default BookingCheckout;
