"use client";

import { useState } from "react";

import { t } from "@/common/i18n";
import DetailModal from "@/components/listingDetail/DetailModal";
import type { GuestCounts, GuestKey } from "@/components/search/constants";
import GuestSteppers from "@/components/search/GuestSteppers";
import { updateGuestCount, type GuestBoundsOptions } from "@/components/search/utils";

type EditGuestsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guests: GuestCounts;
  guestLimits: GuestBoundsOptions;
  onSave: (guests: GuestCounts) => void;
};

const EditGuestsModal = ({ open, onOpenChange, guests, guestLimits, onSave }: EditGuestsModalProps) => {
  const [draft, setDraft] = useState<GuestCounts>(guests);
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setDraft(guests);
    }
  }

  const changeGuests = (key: GuestKey, delta: number) =>
    setDraft(current => ({ ...current, ...updateGuestCount(current, key, delta, guestLimits) }));

  return (
    <DetailModal
      open={open}
      onOpenChange={onOpenChange}
      title={t("checkout.trip.guests")}
      className="sm:max-w-[480px]"
      footer={
        <>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-lg px-2 py-1 text-sm font-semibold text-ink underline underline-offset-2 hover:bg-surface-muted"
          >
            {t("common.cancel")}
          </button>
          <button
            type="button"
            onClick={() => {
              onSave(draft);
              onOpenChange(false);
            }}
            className="rounded-lg bg-ink px-6 py-3 text-sm font-semibold text-on-ink transition-colors hover:bg-ink-strong"
          >
            {t("common.save")}
          </button>
        </>
      }
    >
      <GuestSteppers counts={draft} onChange={changeGuests} bounds={guestLimits} rowClassName="py-4" />
      {guestLimits.maxGuests ? (
        <p className="mt-4 text-xs text-ink-muted">
          {t("listingDetail.booking.maxGuestsNote", { count: guestLimits.maxGuests })}
        </p>
      ) : null}
    </DetailModal>
  );
};

export default EditGuestsModal;
