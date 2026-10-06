import { t } from "@/common/i18n";
import type { RatingCount } from "@/types/listing";

type RatingSummaryProps = {
  breakdown: RatingCount[];
  total: number;
};

const RatingSummary = ({ breakdown, total }: RatingSummaryProps) => (
  <div className="mt-8 w-full max-w-[260px]">
    <p className="mb-2 text-sm font-semibold text-ink">{t("listingDetail.reviews.overallRating")}</p>
    <ul className="flex flex-col gap-1">
      {breakdown.map(({ rating, count }) => (
        <li
          key={rating}
          className="flex items-center gap-3 text-xs text-ink"
          aria-label={`${t("listingDetail.reviews.starsLabel", { count: rating })}: ${count}`}
        >
          <span className="w-2 text-right" aria-hidden="true">
            {rating}
          </span>
          <span className="h-1 flex-1 overflow-hidden rounded-full bg-hairline" aria-hidden="true">
            <span
              className="block h-full rounded-full bg-ink"
              style={{ width: total > 0 ? `${(count / total) * 100}%` : 0 }}
            />
          </span>
        </li>
      ))}
    </ul>
  </div>
);

export default RatingSummary;
