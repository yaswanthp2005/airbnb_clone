"use client";

import { useState } from "react";

import { t } from "@/common/i18n";
import { formatTripDate } from "@/components/booking/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCancelBooking } from "@/queries/bookings";
import type { Booking } from "@/types/booking";
import { formatPrice } from "@/utils/formatPrice";

type CancelTripDialogProps = {
  booking: Booking | null;
  onClose: () => void;
};

const CancelTripDialog = ({ booking, onClose }: CancelTripDialogProps) => {
  const cancelBooking = useCancelBooking();
  // Keeps the text in place while the dialog animates out after `booking` becomes null.
  const [shownBooking, setShownBooking] = useState(booking);
  if (booking && booking !== shownBooking) {
    setShownBooking(booking);
  }

  const handleOpenChange = (open: boolean) => {
    if (!open && !cancelBooking.isPending) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (booking) {
      cancelBooking.mutate(booking.id, { onSuccess: onClose });
    }
  };

  return (
    <Dialog open={booking !== null} onOpenChange={handleOpenChange}>
      <DialogContent className="rounded-xl bg-surface-raised p-6 sm:max-w-md">
        <DialogTitle className="text-[22px] font-semibold text-ink">
          {t("trips.cancelDialog.title")}
        </DialogTitle>
        {shownBooking ? (
          <DialogDescription className="text-base text-ink-muted">
            {t("trips.cancelDialog.description", {
              title: shownBooking.listing.title,
              checkIn: formatTripDate(shownBooking.checkIn),
              checkOut: formatTripDate(shownBooking.checkOut),
              amount: formatPrice(shownBooking.totalPrice),
            })}
          </DialogDescription>
        ) : null}
        <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => handleOpenChange(false)}
            disabled={cancelBooking.isPending}
            className="rounded-lg border border-ink px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface-muted disabled:opacity-40"
          >
            {t("trips.cancelDialog.keep")}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={cancelBooking.isPending}
            className="rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-on-brand transition-opacity hover:opacity-95 disabled:opacity-60"
          >
            {t(cancelBooking.isPending ? "trips.cancelDialog.cancelling" : "trips.cancelDialog.confirm")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CancelTripDialog;
