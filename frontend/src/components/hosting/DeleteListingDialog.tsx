"use client";

import { useState } from "react";

import { t } from "@/common/i18n";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteHostListing } from "@/queries/host";
import type { HostListing } from "@/types/host";

type DeleteListingDialogProps = {
  listing: HostListing | null;
  onClose: () => void;
};

const secondaryButtonClassName =
  "rounded-lg border border-ink px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface-muted disabled:opacity-40";

/**
 * Listings with upcoming stays can't be deleted; the server enforces it too (409) in case
 * a reservation came in after the dashboard loaded.
 */
const DeleteListingDialog = ({ listing, onClose }: DeleteListingDialogProps) => {
  const deleteListing = useDeleteHostListing();
  // Keeps the text in place while the dialog animates out after `listing` becomes null.
  const [shownListing, setShownListing] = useState(listing);
  if (listing && listing !== shownListing) {
    setShownListing(listing);
  }

  const isBlocked = (shownListing?.upcomingBookingCount ?? 0) > 0;

  const handleOpenChange = (open: boolean) => {
    if (!open && !deleteListing.isPending) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (listing) {
      deleteListing.mutate(listing.id, { onSettled: onClose });
    }
  };

  return (
    <Dialog open={listing !== null} onOpenChange={handleOpenChange}>
      <DialogContent className="rounded-xl bg-white p-6 sm:max-w-md">
        <DialogTitle className="text-[22px] font-semibold text-ink">
          {t(isBlocked ? "hosting.deleteDialog.blockedTitle" : "hosting.deleteDialog.title")}
        </DialogTitle>
        {shownListing ? (
          <DialogDescription className="text-base text-ink-muted">
            {isBlocked
              ? t(
                  shownListing.upcomingBookingCount === 1
                    ? "hosting.deleteDialog.blockedDescriptionOne"
                    : "hosting.deleteDialog.blockedDescriptionOther",
                  { title: shownListing.title, count: shownListing.upcomingBookingCount },
                )
              : t("hosting.deleteDialog.description", { title: shownListing.title })}
          </DialogDescription>
        ) : null}
        <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          {isBlocked ? (
            <button type="button" onClick={() => handleOpenChange(false)} className={secondaryButtonClassName}>
              {t("hosting.deleteDialog.close")}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                disabled={deleteListing.isPending}
                className={secondaryButtonClassName}
              >
                {t("hosting.deleteDialog.keep")}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={deleteListing.isPending}
                className="rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-60"
              >
                {t(deleteListing.isPending ? "hosting.deleteDialog.deleting" : "hosting.deleteDialog.confirm")}
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteListingDialog;
