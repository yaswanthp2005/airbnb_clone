"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { addDays, addMonths, endOfMonth, startOfToday } from "date-fns";

import PageContainer from "@/components/layout/PageContainer";
import { CALENDAR_MAX_MONTHS_AHEAD } from "@/components/search/constants";
import { comingSoonRoute } from "@/constants/routes";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useListing, useListingUnavailableDates } from "@/queries/listings";
import type { ListingDetail as ListingDetailData } from "@/types/listing";
import { toDateParam } from "@/utils/dateParam";
import { calculatePriceBreakdown } from "@/utils/pricing";

import AmenitiesSection from "./AmenitiesSection";
import AvailabilitySection from "./AvailabilitySection";
import BookingCard from "./BookingCard";
import { DETAIL_COLUMNS_CLASS_NAME, RESERVE_COMING_SOON_SLUG } from "./constants";
import Description from "./Description";
import HostedBy from "./HostedBy";
import { useBookingSelection } from "./hooks/useBookingSelection";
import ListingActions from "./ListingActions";
import ListingDetailSkeleton from "./ListingDetailSkeleton";
import ListingOverview from "./ListingOverview";
import ListingUnavailable from "./ListingUnavailable";
import LocationSection from "./LocationSection";
import MeetHost from "./MeetHost";
import MobileBookingBar from "./MobileBookingBar";
import PhotoGalleryModal from "./PhotoGalleryModal";
import PhotoGrid from "./PhotoGrid";
import ReviewsSection from "./Reviews";
import { isStayBookable } from "./utils";

type ListingDetailProps = {
  listingId: number;
};

const NO_BOOKED_DATES: string[] = [];

/** Covers every month the calendar can show (checkout may land the day after the last one). */
const availabilityWindow = () => {
  const today = startOfToday();
  return {
    startDate: toDateParam(today),
    endDate: toDateParam(addDays(endOfMonth(addMonths(today, CALENDAR_MAX_MONTHS_AHEAD)), 1)),
  };
};

const ListingDetailContent = ({ listing }: { listing: ListingDetailData }) => {
  const router = useRouter();
  const requireAuth = useRequireAuth();
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const [datesWindow] = useState(availabilityWindow);
  const { selection, setDates, changeGuests, guestLimits } = useBookingSelection(
    listing.maxGuests,
  );
  const { data: bookedDates = NO_BOOKED_DATES } = useListingUnavailableDates(listing.id, datesWindow);
  const bookedNights = useMemo(() => new Set(bookedDates), [bookedDates]);

  const { checkIn, checkOut } = selection;
  const dates = { checkIn, checkOut };
  const isBookable = isStayBookable(dates, bookedNights, startOfToday());
  const breakdown = calculatePriceBreakdown({
    nightlyPrice: listing.pricePerNight,
    cleaningFee: listing.cleaningFee,
    checkIn,
    checkOut,
  });

  const handleReserve = () => {
    if (isBookable) {
      requireAuth(() => router.push(comingSoonRoute(RESERVE_COMING_SOON_SLUG)));
    }
  };

  return (
    <>
      <PageContainer width="narrow" className="pb-28 pt-6 lg:pb-16">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-[22px] font-semibold leading-7 text-ink md:text-[26px] md:leading-8">
            {listing.title}
          </h1>
          <ListingActions title={listing.title} isWishlisted={listing.isWishlisted} />
        </div>
        <PhotoGrid photos={listing.photos} onOpen={setGalleryIndex} />

        <div className={`mt-8 ${DETAIL_COLUMNS_CLASS_NAME}`}>
          <div className="min-w-0">
            <ListingOverview listing={listing} />
            <HostedBy host={listing.host} />
            <Description text={listing.description} />
            <AmenitiesSection amenities={listing.amenities} />
            <AvailabilitySection
              {...dates}
              city={listing.city}
              bookedDates={bookedDates}
              bookedNights={bookedNights}
              onChange={setDates}
            />
          </div>
          <aside className="hidden lg:block">
            <div className="sticky top-32 pb-12">
              <BookingCard
                listing={listing}
                dates={dates}
                guests={selection}
                guestLimits={guestLimits}
                bookedDates={bookedDates}
                bookedNights={bookedNights}
                breakdown={breakdown}
                isBookable={isBookable}
                onDatesChange={setDates}
                onGuestsChange={changeGuests}
                onReserve={handleReserve}
              />
            </div>
          </aside>
        </div>

        <ReviewsSection listing={listing} />
        <LocationSection listing={listing} />
        <MeetHost host={listing.host} />
      </PageContainer>

      <MobileBookingBar
        pricePerNight={listing.pricePerNight}
        dates={dates}
        isBookable={isBookable}
        onReserve={handleReserve}
      />
      <PhotoGalleryModal
        title={listing.title}
        photos={listing.photos}
        isWishlisted={listing.isWishlisted}
        openIndex={galleryIndex}
        onClose={() => setGalleryIndex(null)}
      />
    </>
  );
};

const ListingDetail = ({ listingId }: ListingDetailProps) => {
  const { data: listing, isPending, isError } = useListing(listingId);

  if (isPending) {
    return <ListingDetailSkeleton />;
  }
  if (isError) {
    return <ListingUnavailable />;
  }
  return <ListingDetailContent listing={listing} />;
};

export default ListingDetail;
