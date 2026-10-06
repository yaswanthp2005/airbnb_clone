import { format, parseISO } from "date-fns";
import { Star } from "lucide-react";

import { t } from "@/common/i18n";
import { cn } from "@/lib/utils";
import type { Review } from "@/types/listing";

import { REVIEW_DATE_FORMAT, STAR_COUNT } from "../constants";
import UserAvatar from "../UserAvatar";
import { pluralize, yearsSince } from "../utils";

type ReviewCardProps = {
  review: Review;
};

const memberSinceLabel = (joinedAt: string) => {
  const years = yearsSince(joinedAt);
  return years > 0
    ? pluralize(years, "listingDetail.reviews.yearsOnAirbnb")
    : t("listingDetail.reviews.newToAirbnb");
};

const ReviewCard = ({ review }: ReviewCardProps) => (
  <article className="flex flex-col gap-3">
    <div className="flex items-center gap-3">
      <UserAvatar name={review.guest.name} avatarUrl={review.guest.avatarUrl} className="size-12" />
      <div className="flex flex-col">
        <p className="text-base font-semibold text-ink">{review.guest.name}</p>
        <p className="text-sm text-ink-muted">{memberSinceLabel(review.guest.joinedAt)}</p>
      </div>
    </div>
    <div className="flex items-center gap-2 text-sm text-ink">
      <span
        role="img"
        aria-label={t("listingDetail.reviews.ratedLabel", { rating: review.rating })}
        className="flex items-center gap-0.5"
      >
        {Array.from({ length: STAR_COUNT }, (_, index) => (
          <Star
            key={index}
            aria-hidden="true"
            className={cn(
              "size-2.5",
              index < review.rating ? "fill-ink stroke-ink" : "fill-hairline stroke-hairline",
            )}
          />
        ))}
      </span>
      <span aria-hidden="true">·</span>
      <span className="font-semibold">{format(parseISO(review.createdAt), REVIEW_DATE_FORMAT)}</span>
    </div>
    <p className="text-base leading-6 text-ink">{review.comment}</p>
  </article>
);

export default ReviewCard;
