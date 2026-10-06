import Image from "next/image";
import Link from "next/link";

import { t } from "@/common/i18n";
import { pluralize } from "@/components/listingDetail/utils";
import { formatDateRange } from "@/components/search/utils";
import { bookingRoute } from "@/constants/routes";
import type { Booking } from "@/types/booking";
import { formatPrice } from "@/utils/formatPrice";

import { TRIP_PHOTO_SIZES } from "./constants";

type TripCardProps = {
  booking: Booking;
  onCancel: (booking: Booking) => void;
};

const TripCard = ({ booking, onCancel }: TripCardProps) => {
  const { listing } = booking;
  const isCancelled = booking.status === "cancelled";

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-hairline bg-white shadow-[0_6px_16px_rgba(0,0,0,0.06)]">
      <Link href={bookingRoute(booking.id)} className="group block">
        <div className="relative aspect-[3/2] w-full overflow-hidden bg-surface-muted">
          {listing.photoUrl ? (
            <Image
              src={listing.photoUrl}
              alt={listing.title}
              fill
              sizes={TRIP_PHOTO_SIZES}
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : null}
          {isCancelled ? (
            <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink shadow-sm">
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
          <button
            type="button"
            onClick={() => onCancel(booking)}
            className="rounded-lg px-2 py-1 text-sm font-semibold text-ink underline underline-offset-2 hover:bg-surface-muted"
          >
            {t("trips.cancelTrip")}
          </button>
        </div>
      ) : null}
    </article>
  );
};

export default TripCard;
