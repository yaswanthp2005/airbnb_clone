"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { Star } from "lucide-react";

import { t } from "@/common/i18n";
import { pluralize } from "@/components/listingDetail/utils";
import { cn } from "@/lib/utils";

import { REVIEW_RATINGS } from "./constants";

type StarRatingInputProps = {
  value: number | null;
  onChange: (rating: number) => void;
  labelledBy: string;
  describedBy?: string;
  hasError?: boolean;
};

const NEXT_KEYS = ["ArrowRight", "ArrowUp"];
const PREVIOUS_KEYS = ["ArrowLeft", "ArrowDown"];
const MIN_RATING = REVIEW_RATINGS[0];
const MAX_RATING = REVIEW_RATINGS[REVIEW_RATINGS.length - 1];

/** Radio group of stars: hover previews, arrow keys move the selection (roving tabindex). */
const StarRatingInput = ({ value, onChange, labelledBy, describedBy, hasError }: StarRatingInputProps) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const shown = hovered ?? value;
  const focusable = value ?? MIN_RATING;

  const select = (rating: number) => {
    onChange(rating);
    buttonRefs.current[rating - 1]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = value ?? 0;
    if (NEXT_KEYS.includes(event.key)) {
      event.preventDefault();
      select(Math.min(current + 1, MAX_RATING));
    } else if (PREVIOUS_KEYS.includes(event.key)) {
      event.preventDefault();
      select(Math.max(current - 1, MIN_RATING));
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div
        role="radiogroup"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        aria-invalid={hasError || undefined}
        onKeyDown={handleKeyDown}
        onMouseLeave={() => setHovered(null)}
        className="flex items-center gap-1"
      >
        {REVIEW_RATINGS.map(rating => (
          <button
            key={rating}
            ref={element => {
              buttonRefs.current[rating - 1] = element;
            }}
            type="button"
            role="radio"
            aria-checked={value === rating}
            aria-label={pluralize(rating, "trips.reviewDialog.star")}
            tabIndex={rating === focusable ? 0 : -1}
            onClick={() => select(rating)}
            onMouseEnter={() => setHovered(rating)}
            className="rounded-md p-1 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-ink"
          >
            <Star
              aria-hidden="true"
              strokeWidth={1.5}
              className={cn(
                "size-9 transition-colors",
                shown !== null && rating <= shown
                  ? "fill-ink text-ink"
                  : cn("fill-transparent", hasError ? "text-destructive" : "text-ink-muted/60"),
              )}
            />
          </button>
        ))}
      </div>
      {shown !== null ? (
        <span className="text-base font-semibold text-ink" aria-hidden="true">
          {t(`trips.reviewDialog.ratings.${shown}`)}
        </span>
      ) : null}
    </div>
  );
};

export default StarRatingInput;
