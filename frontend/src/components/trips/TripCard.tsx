import Link from "next/link";
import { Star } from "lucide-react";

import { t } from "@/common/i18n";
import RemoteImage from "@/components/common/RemoteImage";
import { SECTION_IDS, STAR_COUNT } from "@/components/listingDetail/constants";
import { pluralize } from "@/components/listingDetail/utils";
import { formatDateRange } from "@/components/search/utils";
import { bookingRoute, listingRoute } from "@/constants/routes";
import type { Booking } from "@/types/booking";
import { formatPrice } from "@/utils/formatPrice";

import { TRIP_PHOTO_SIZES } from "./constants";

type TripCardProps = {
  booking: Booking;
  onCancel: (booking: Booking) => void;
  onReview: (booking: Booking) => void;
};

const footerButtonClassName =
  "rounded-lg px-2 py-1 text-sm font-semibold text-ink underline underline-offset-2 hover:bg-surface-muted";

const YourRating = ({ rating }: { rating: number }) => (
  <span className="flex items-center gap-2 text-sm text-ink">
    {t("trips.yourRating")}
    <span
      role="img"
      aria-label={t("trips.ratedLabel", { rating })}
      className="flex items-center gap-0.5"
    >
      {Array.from({ length: STAR_COUNT }, (_, index) => (
        <Star
          key={index}
          aria-hidden="true"
          className={index < rating ? "size-3.5 fill-ink text-ink" : "size-3.5 text-ink-muted/50"}
        />
      ))}
    </span>
  </span>
);

const TripCard = ({ booking, onCancel, onReview }: TripCardProps) => {
  const { listing } = booking;
  const isCancelled = booking.status === "cancelled";

  return (
    <article className="flex w-full flex-col overflow-hidden rounded-xl border border-hairline bg-surface-raised shadow-card-soft">
      <Link href={bookingRoute(booking.id)} className="group block">
        <div className="relative aspect-[3/2] w-full overflow-hidden bg-surface-muted">
          {listing.photoUrl ? (
            <RemoteImage
              src={listing.photoUrl}
              alt={listing.title}
              fill
              sizes={TRIP_PHOTO_SIZES}
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : null}
          {isCancelled ? (
            <span className="absolute left-3 top-3 rounded-full bg-surface px-3 py-1 text-xs font-semibold text-ink shadow-sm">
              {t("trips.cancelledBadge")}
            </span>
          ) : null}
        </div>
        <div className="flex flex-col gap-1 p-4">
          <h3 className="text-base font-semibold text-ink">{listing.city}</h3>
          <p className="line-clamp-1 text-sm text-ink-muted">{listing.title}</p>
          <p className="text-sm text-ink-muted">{t("trips.hostedBy", { name: listing.hostName })}</p>
          <p className="mt-2 text-sm text-ink">
            {formatDateRange(booking.checkIn, booking.checkOut)}
            <span aria-hidden="true"> · </span>
            {pluralize(booking.guests, "bookingConfirmation.guestCount")}
          </p>
          <p className="text-sm font-semibold text-ink">
            {t("trips.total", { amount: formatPrice(booking.totalPrice) })}
          </p>
        </div>
      </Link>
      {booking.canCancel ? (
        <div className="mt-auto border-t border-hairline px-4 py-3">
          <button type="button" onClick={() => onCancel(booking)} className={footerButtonClassName}>
            {t("trips.cancelTrip")}
          </button>
        </div>
      ) : null}
      {booking.canReview ? (
        <div className="mt-auto border-t border-hairline px-4 py-3">
          <button
            type="button"
            onClick={() => onReview(booking)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-ink px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-surface-muted"
          >
            <Star className="size-3.5" aria-hidden="true" />
            {t("trips.leaveReview")}
          </button>
        </div>
      ) : null}
      {booking.review ? (
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-hairline px-4 py-3">
          <YourRating rating={booking.review.rating} />
          <Link
            href={`${listingRoute(listing.id)}#${SECTION_IDS.reviews}`}
            className={footerButtonClassName}
          >
            {t("trips.seeReview")}
          </Link>
        </div>
      ) : null}
    </article>
  );
};

export default TripCard;
