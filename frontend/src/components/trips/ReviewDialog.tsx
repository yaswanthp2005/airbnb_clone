"use client";

import { useState, type FormEvent } from "react";
import { CircleAlert } from "lucide-react";

import { t } from "@/common/i18n";
import { formatDateRange } from "@/components/search/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useCreateReview } from "@/queries/reviews";
import type { Booking } from "@/types/booking";

import { REVIEW_COMMENT_MAX_LENGTH, REVIEW_COMMENT_MIN_LENGTH } from "./constants";
import StarRatingInput from "./StarRatingInput";

type ReviewDialogProps = {
  booking: Booking | null;
  onClose: () => void;
};

type ReviewFormProps = {
  booking: Booking;
  onClose: () => void;
};

type ReviewErrors = {
  rating?: string;
  comment?: string;
};

const RATING_LABEL_ID = "review-rating-label";
const RATING_ERROR_ID = "review-rating-error";
const COMMENT_ID = "review-comment";
const COMMENT_ERROR_ID = "review-comment-error";

const validate = (rating: number | null, comment: string): ReviewErrors => ({
  rating: rating === null ? t("trips.reviewDialog.ratingRequired") : undefined,
  comment:
    comment.trim().length < REVIEW_COMMENT_MIN_LENGTH
      ? t("trips.reviewDialog.commentTooShort", { min: REVIEW_COMMENT_MIN_LENGTH })
      : undefined,
});

const FieldError = ({ id, message }: { id: string; message?: string }) =>
  message ? (
    <p id={id} className="flex items-center gap-1.5 text-sm text-destructive">
      <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
      {message}
    </p>
  ) : null;

const ReviewForm = ({ booking, onClose }: ReviewFormProps) => {
  const createReview = useCreateReview();
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<ReviewErrors>({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(rating, comment);
    setErrors(nextErrors);
    if (rating === null || nextErrors.rating || nextErrors.comment) {
      return;
    }
    createReview.mutate(
      { bookingId: booking.id, rating, comment: comment.trim() },
      { onSuccess: onClose },
    );
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span id={RATING_LABEL_ID} className="text-sm font-semibold text-ink">
          {t("trips.reviewDialog.ratingLabel")}
        </span>
        <StarRatingInput
          value={rating}
          onChange={value => {
            setRating(value);
            setErrors(previous => ({ ...previous, rating: undefined }));
          }}
          labelledBy={RATING_LABEL_ID}
          describedBy={errors.rating ? RATING_ERROR_ID : undefined}
          hasError={Boolean(errors.rating)}
        />
        <FieldError id={RATING_ERROR_ID} message={errors.rating} />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-2">
          <label htmlFor={COMMENT_ID} className="text-sm font-semibold text-ink">
            {t("trips.reviewDialog.commentLabel")}
          </label>
          <span className="text-sm text-ink-muted">
            {t("trips.reviewDialog.characterCount", {
              count: comment.length,
              max: REVIEW_COMMENT_MAX_LENGTH,
            })}
          </span>
        </div>
        <textarea
          id={COMMENT_ID}
          rows={5}
          value={comment}
          maxLength={REVIEW_COMMENT_MAX_LENGTH}
          placeholder={t("trips.reviewDialog.commentPlaceholder")}
          aria-invalid={Boolean(errors.comment)}
          aria-describedby={errors.comment ? COMMENT_ERROR_ID : undefined}
          onChange={event => {
            setComment(event.target.value);
            setErrors(previous => ({ ...previous, comment: undefined }));
          }}
          className={cn(
            "w-full resize-y rounded-lg border border-surface-strong px-4 py-3 text-base leading-relaxed text-ink outline-none placeholder:text-ink-muted/70 focus:border-ink focus:ring-1 focus:ring-ink",
            errors.comment && "border-destructive ring-1 ring-destructive",
          )}
        />
        <FieldError id={COMMENT_ERROR_ID} message={errors.comment} />
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onClose}
          disabled={createReview.isPending}
          className="rounded-lg border border-ink px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface-muted disabled:opacity-40"
        >
          {t("trips.reviewDialog.cancel")}
        </button>
        <button
          type="submit"
          disabled={createReview.isPending}
          className="rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-60"
        >
          {t(createReview.isPending ? "trips.reviewDialog.submitting" : "trips.reviewDialog.submit")}
        </button>
      </div>
    </form>
  );
};

const ReviewDialog = ({ booking, onClose }: ReviewDialogProps) => {
  // Keeps the content in place while the dialog animates out after `booking` becomes null.
  const [shownBooking, setShownBooking] = useState(booking);
  if (booking && booking !== shownBooking) {
    setShownBooking(booking);
  }

  return (
    <Dialog open={booking !== null} onOpenChange={open => !open && onClose()}>
      <DialogContent className="rounded-xl bg-white p-6 sm:max-w-lg">
        <DialogTitle className="text-[22px] font-semibold text-ink">
          {t("trips.reviewDialog.title")}
        </DialogTitle>
        {shownBooking ? (
          <>
            <DialogDescription className="text-base text-ink-muted">
              {t("trips.reviewDialog.description", {
                title: shownBooking.listing.title,
                dates: formatDateRange(shownBooking.checkIn, shownBooking.checkOut) ?? "",
              })}
            </DialogDescription>
            <ReviewForm key={shownBooking.id} booking={shownBooking} onClose={onClose} />
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;
