import { t } from "@/common/i18n";
import { DEFAULT_PAGE_SIZE } from "@/constants";

import { LISTING_GRID_CLASS_NAME } from "./constants";
import ListingCardSkeleton from "./ListingCardSkeleton";

type ListingGridSkeletonProps = {
  count?: number;
  className?: string;
};

const ListingGridSkeleton = ({
  count = DEFAULT_PAGE_SIZE,
  className = LISTING_GRID_CLASS_NAME,
}: ListingGridSkeletonProps) => (
  <div
    role="status"
    aria-label={t("home.listingsLoading")}
    className={className}
  >
    {Array.from({ length: count }, (_, index) => (
      <ListingCardSkeleton key={index} />
    ))}
  </div>
);

export default ListingGridSkeleton;
